export default {
  baseUrl: process.env.NODE_ENV === '1development'
    ? 'http://localhost:9998/java/'
    : 'http://jiayupearl.shop/java/',
  tokenKey: 'token',
  fileBaseUrl: 'http://jiayu-pearl-mall.oss-cn-beijing.aliyuncs.com/',
}
