// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  overrides: [
    // Node
    {
      files: ["metro.config.js"],
      env: {
        node: true,
      },
    },
  ],
};
