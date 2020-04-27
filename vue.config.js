const BundleAnalyzerPlugin = require(
  'webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],
  publicPath: '/manager',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 3154,
  },
  configureWebpack: {
    plugins: process.env.NODE_ENV === 'development'
      ? [
        new BundleAnalyzerPlugin(),
        new CompressionWebpackPlugin({
          test:/\.js$|\.html$|.\css/, //匹配文件名
          threshold: 10240,//对超过10k的数据压缩
          deleteOriginalAssets: false //不删除源文件
        })]
      : [
        new CompressionWebpackPlugin({
          test:/\.js$|\.html$|.\css/, //匹配文件名
          threshold: 10240,//对超过10k的数据压缩
          deleteOriginalAssets: false //不删除源文件
        }),
      ],
    externals: {
      'moment':'moment'
    },
  },
}
