/**
 * `babel-preset-expo` adds its expo-router plugin only when `hasModule('expo-router')`
 * succeeds — a bare `require.resolve('expo-router')` evaluated from the preset's own
 * location. This repo installs with `install-strategy=nested` (see `.npmrc`), and the
 * root package.json also declares `babel-preset-expo`, so npm keeps a single copy at
 * `<repo>/node_modules` while `expo-router` stays nested in `apps/docs/node_modules`.
 * The preset therefore can't see expo-router, silently skips the plugin, and
 * `process.env.EXPO_ROUTER_APP_ROOT` reaches Metro un-inlined — which fails as
 * "First argument of `require.context` should be a string".
 *
 * Registering the plugin here restores it. It reads the app root from Babel's caller
 * (Metro passes `projectRoot` / `routerRoot`), not from where the module resolved, so
 * the path it inlines is correct regardless of hoisting.
 *
 * The alternative fix is dropping `babel-preset-expo` from the root package.json — no
 * root babel config consumes it, and every workspace declares its own — which lets
 * apps/docs install a copy next to expo-router. That needs a reinstall and a lockfile
 * change, so it is deliberately not done here.
 */
const { expoRouterBabelPlugin } = require('babel-preset-expo/build/expo-router-plugin');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [expoRouterBabelPlugin],
  };
};
