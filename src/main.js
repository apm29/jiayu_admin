import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify'
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
Vue.prototype.$path = config.fileBaseUrl
Vue.prototype.$thumbnail = config.fileThumbnailParams
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

