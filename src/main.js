import App from '@/App.vue'
import store from '@/store/store'
import vuetify from '@/plugins/vuetify'
import Notifications from 'vue-notification'
import router from '@/router/router'
import remote from '@/utils/remote'
import messenger from '@/utils/messenger/messenger'
import config from '@/utils/config'
Vue.use(Notifications)
Vue.config.productionTip = false
Vue.prototype.$remote = remote
Vue.prototype.$messenger = messenger
Vue.prototype.$moment = moment
//OSS的BaseUrl
Vue.prototype.$path = config.fileBaseUrl
//OSS缩略图后缀
Vue.prototype.$thumbnail = config.fileThumbnailParamsMedium
Vue.prototype.$thumbnailLarge = config.fileThumbnailParamsLarge
Vue.prototype.$thumbnailSmall = config.fileThumbnailParamsSmall
//公共延迟方法
Vue.prototype.$delay =  function (delay) {
  return new Promise((resolve)=>{
    setTimeout(resolve,delay)
  })
}

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')

