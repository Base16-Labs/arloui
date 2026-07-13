const { getDefaultConfig } = require('expo/metro-config');

// SDK 52+ configures monorepo resolution automatically — custom watchFolders /
// nodeModulesPaths cause duplicate React (runtime crashes).
const config = getDefaultConfig(__dirname);

// react-native-svg source imports Node's `buffer` (see fetchData.ts).
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer/'),
};

module.exports = config;
