export default {
  baseUrl: process.env.NODE_ENV === 'development'
    ? 'http://localhost:9998/'
    : 'http://jiayupearl.shop:9998/',
  tokenKey: 'token',
  fileBaseUrl: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
}
