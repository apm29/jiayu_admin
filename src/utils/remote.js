import axios from 'axios'
import config from '@/utils/config'
import router from '@/router/router'
import Vue from 'vue'
axios.defaults.withCredentials = true // 是否允许跨域
axios.defaults.timeout = 10000
axios.defaults.baseURL = 'http://localhost:9998//'//config.baseUrl
axios.defaults.validateStatus = () => true
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
      if (axiosResponse.data.Token) {
        localStorage.setItem(config.tokenKey, axiosResponse.data.Token)
      }
      return axiosResponse.data
    }
    if (axiosResponse.data.Code === 401) {
      router.push({
        path: '/login'
      })
    }
    if(axiosResponse.data.Code === 403){
      Vue.notify({
        title:axiosResponse.data.Msg,
      })
    }
    throw Error("")
  },
}
