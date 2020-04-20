import config from '@/utils/config'

export default {
  isValidateUser: function () {
    let token = localStorage.getItem(config.tokenKey)
    return !!token
  },
  logout:function () {
    localStorage.setItem(config.tokenKey,'')
  }
}
