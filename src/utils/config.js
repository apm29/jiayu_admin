export default {
  baseUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:9998/java/'
    : 'http://jiayupearl.shop/java/',
  uploadBaseUrl: process.env.NODE_ENV === 'development'
    ? 'http://jiayupearl.shop/java/'
    : 'http://jiayupearl.shop/java/',
  tokenKey: 'token',
  fileBaseUrl: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
  fileThumbnailParams: '?x-oss-process=image/resize,h_48,w_48',
}
