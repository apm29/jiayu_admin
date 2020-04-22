export default {
  baseUrl: process.env.NODE_ENV === '1development'
    ? 'http://localhost:9998/'
    : 'http://jiayupearl.shop:9998/',
  tokenKey: 'token',
}
