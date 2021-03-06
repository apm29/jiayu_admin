export default {
  baseUrl: process.env.NODE_ENV === '1development'
    ? 'http://localhost:9998/java/'
    : 'https://jiayupearl.shop/java/',
  uploadBaseUrl: process.env.NODE_ENV === 'development'
    ? 'https://jiayupearl.shop/java/'
    : 'https://jiayupearl.shop/java/',
  tokenKey: 'token',
  fileBaseUrl: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
  fileThumbnailParamsSmall: '?x-oss-process=image/resize,h_48,w_48',
  fileThumbnailParamsMedium: '?x-oss-process=image/resize,h_96,w_96',
  fileThumbnailParamsLarge: '?x-oss-process=image/resize,h_200,w_200',
}
