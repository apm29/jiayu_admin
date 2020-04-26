module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  assetsPublicPath:'/manager',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 3154
  },
}
