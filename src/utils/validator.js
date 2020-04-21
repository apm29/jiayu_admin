import config from '@/utils/config'
import store from '@/store/store'

export default {
  isValidateUser: async function () {
    let token = localStorage.getItem(config.tokenKey)
    let validate = !!token
    if(validate){
      await store.dispatch('login')
    }
    return validate
  },
  logout:function () {
    localStorage.setItem(config.tokenKey,'')
  }
}
