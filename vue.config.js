const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const path = require('path')
module.exports = {
  'transpileDependencies': [
    'vuetify',
  ],
  publicPath: process.env.NODE_ENV === 'development'?'./':'/manager',
  outputDir: 'dist',
  assetsDir: 'static',
  //lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: 3154,
  },
  configureWebpack: {
    name:'佳瑜Admin',
    plugins: process.env.NODE_ENV === 'development'
      ? [
        new BundleAnalyzerPlugin({
          analyzerPort:8899
        }),
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
      'moment':'moment',
      'vue':'Vue',
      'vuetify':'Vuetify'
    },
    context: path.resolve(__dirname, './'),
    //别名配置
    resolve: {
      extensions: [',js', '.vue'],
      alias: {
        '@': path.resolve('src'),
      }
    }
  },
}
