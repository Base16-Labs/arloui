module.exports = function (api) {
  api.cache(true);

  // SDK 57 resolves Router and Worklets from the app root in this monorepo.
  return {
    presets: ['babel-preset-expo'],
  };
};
