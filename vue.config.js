module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/manager',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 3154
  },
}
