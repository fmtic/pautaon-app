module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  plugins.push("react-native-worklets/plugin");

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins,
  };
};

module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    ['module:react-native-dotenv', {
      envName: 'APP_ENV',
      moduleName: '@env',
      path: '.env',
    }]
  ],
};
