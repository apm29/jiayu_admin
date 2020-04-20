import axios from 'axios'

axios.defaults.withCredentials = true // 是否允许跨域
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://axj.ciih.net/'

export default {
  // 上传处理
  async upload (options) {
    let response = await axios({
      url: options.url,
      method: 'post',
      data: options.formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: 'http://axj.ciih.net/'
    })
    return response.data
  },
  async downloadLocal (url) {
    let response = await axios({
      method: 'get',
      url: url,
      responseType: 'text',
      baseURL: '/'
    })
    return response.data
  },
}
