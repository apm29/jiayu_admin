import axios from "axios"
import config from "@/utils/config"
import Vue from "vue";
import router from "@/router/router"
import store from "@/store/store"

axios.defaults.withCredentials = true // 是否允许跨域
axios.defaults.timeout = 10000
axios.defaults.baseURL = config.baseUrl
axios.defaults.validateStatus = () => true
class Response{
  constructor (data,code,token,msg) {
    this.Data = data
    this.Code = code
    this.Token = token
    this.Msg = msg
  }
}
new Response();
export default {
  // 上传处理
  async upload (options) {
    options = Object.assign(
      {
        hide: true,
      },
      options,
    )
    console.log(options)
    if (!options.hide) {
      store.commit('loading', 1)
    }
    try {
      let token = localStorage.getItem(config.tokenKey)
      let response = await axios({
        url: options.url,
        method: 'post',
        data: options.formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token,
        },
        baseURL: config.uploadBaseUrl,
      })
      if (response.data.Code === 200) {
        if (response.data.Token) {
          localStorage.setItem(config.tokenKey, response.data.Token)
        }
        return response.data
      }
      if (response.data.Code === 401) {
        await store.dispatch('logout')
        await router.push({
          path: '/login',
        })
      }
      if (response.data.Code === 403) {
        Vue.notify({
          title: response.data.Msg,
        })
      }
      throw Error(response.data.Msg || response.data.message || '未知错误')
    } finally {
      if (!options.hide) {
        store.commit('loading', -1)
      }
    }
  },
  /**
   *
   * @param {*} options
   */
  async post (options) {
    if (!options.hide) {
      store.commit('loading', 1)
    }
    try {
      let token = localStorage.getItem(config.tokenKey) || undefined
      let axiosResponse = await axios({
        url: options.url,
        method: 'post',
        data: options.data,

        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        baseURL: config.baseUrl,
      })
      if (axiosResponse.data.Code === 200) {
        if (axiosResponse.data.Token) {
          localStorage.setItem(config.tokenKey, axiosResponse.data.Token)
        }
        return axiosResponse.data
      }
      if (axiosResponse.data.Code === 401) {
        await store.dispatch('logout')
        await router.push({
          path: '/login',
        })
      }
      if (axiosResponse.data.Code === 403) {
        Vue.notify({
          title: axiosResponse.data.Msg,
        })
      }
      throw Error(axiosResponse.data.Msg || '未知错误')
    } finally {
      if (!options.hide) {
        store.commit('loading', -1)
      }
    }
  },
}
