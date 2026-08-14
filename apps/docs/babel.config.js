/**
 * Works around `babel-preset-expo` being hoisted away from this app's dependencies.
 *
 * The preset pulls several of its plugins in with a bare `require()` evaluated from
 * its own directory. This repo installs with `install-strategy=nested` (see
 * `.npmrc`), and five workspaces declare `babel-preset-expo`, so npm keeps a single
 * deduped copy at `<repo>/node_modules` while this app's dependencies stay in
 * `apps/docs/node_modules`. From up there the preset cannot see them:
 *
 *   expo-router        → the router plugin is skipped, so
 *                        `process.env.EXPO_ROUTER_APP_ROOT` reaches Metro un-inlined
 *                        and `require.context` is handed an expression, not a string.
 *   react-refresh      → hard `Cannot find module 'react-refresh/babel'` in dev.
 *   expo/config        → caught by the preset and degraded to null, so the app
 *                        manifest is not inlined for `expo-constants`. Nothing here
 *                        reads it, so it is left alone rather than papered over.
 *
 * Both failing plugins are registered here instead, resolved from this directory
 * where the modules actually live. The router plugin reads its app root from Babel's
 * caller rather than from where it resolved, so the inlined path stays correct.
 *
 * The structural fix would be a copy of `babel-preset-expo` inside
 * `apps/docs/node_modules`. Dropping the root declaration is not enough — npm still
 * hoists it for the other four workspaces (verified) — so it would take an exact
 * version pin that diverges from the packages, which trades this problem for a
 * dedupe that silently comes back on the next SDK bump.
 */
const { getIsFastRefreshEnabled } = require('babel-preset-expo/build/common');
const { expoRouterBabelPlugin } = require('babel-preset-expo/build/expo-router-plugin');

module.exports = function (api) {
  // Reading the caller is what configures Babel's cache here — it keys the result on
  // platform/dev/server, which is exactly what `fastRefresh` varies by. Do not swap
  // this for `api.cache(true)`: that pins the first caller's answer for every later
  // one, so a web or production build would inherit the dev server's decision.
  const fastRefresh = api.caller(getIsFastRefreshEnabled);

  return {
    // The preset's own Fast Refresh branch is the one that cannot resolve the
    // module, so turn it off and re-add the plugin below.
    presets: [['babel-preset-expo', { enableReactFastRefresh: false }]],
    plugins: [
      expoRouterBabelPlugin,
      // `react-refresh/babel` throws outright when NODE_ENV is production, so this
      // has to stay gated rather than rely on the plugin's own env check.
      ...(fastRefresh
        ? [[require.resolve('react-refresh/babel'), { skipEnvCheck: true }]]
        : []),
    ],
  };
};
