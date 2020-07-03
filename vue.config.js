// vue.config.js
module.exports = {
  outputDir: "docs",
  publicPath: "/smimer",
  configureWebpack: {
    mode: process.env.NODE_ENV
  },
  transpileDependencies: ["buefy", "pvtsutils"]
};
