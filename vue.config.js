// vue.config.js
module.exports = {
  outputDir: "docs",
  publicPath: process.env.VUE_APP_PUBLIC_PATH
    ? process.env.VUE_APP_PUBLIC_PATH
    : "/smimer",
  configureWebpack: {
    mode: process.env.NODE_ENV
  },
  transpileDependencies: ["buefy", "pvtsutils"]
};
