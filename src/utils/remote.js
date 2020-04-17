import axios from 'axios'
import config from '@/utils/config'

axios.defaults.withCredentials = true // 是否允许跨域
axios.defaults.timeout = 10000
axios.defaults.baseURL = config.baseUrl

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
      baseURL: 'http://axj.ciih.net/',
    })
    return response.data
  },
  async downloadLocal (url) {
    let response = await axios({
      method: 'get',
      url: url,
      responseType: 'text',
      baseURL: '/',
    })
    return response.data
  },
  /**
   *
   * @param {*} options
   * @param {*} count
   */
  async post (options) {

    let token = localStorage.getItem(config.tokenKey)
    let axiosResponse = await axios({
      url: options.url,
      method: 'post',
      data: options.data,

      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    })
    if (axiosResponse.data.Code === 200) {
      if (axiosResponse.data.token) {
        localStorage.setItem(config.tokenKey, axiosResponse.data.token)
      }
      return axiosResponse.data
    } else {
      throw Error(axiosResponse.data.Msg || axiosResponse.statusText)
    }

  },
}
