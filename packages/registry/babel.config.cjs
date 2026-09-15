// Used only by Jest (babel-jest). The package itself is built with tsup/esbuild.
// Under test we down-level dynamic `import()` to a require-based form so Jest's
// CommonJS runtime (and its module mocks) can resolve it.
module.exports = function (api) {
  const isTest = api.env('test');
  api.cache.using(() => process.env.NODE_ENV);
  return {
    // Jest uses the Reanimated mock, not a native worklet runtime.
    presets: [['babel-preset-expo', { reanimated: !isTest, worklets: !isTest }]],
    plugins: isTest ? ['babel-plugin-dynamic-import-node'] : [],
  };
};
