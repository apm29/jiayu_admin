import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify'
import Notifications from 'vue-notification'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router/router'
import validator from '@/utils/validator'
import remote from '@/utils/remote'
Vue.use(Notifications)
Vue.config.productionTip = false
Vue.prototype.$remote = remote
Vue.prototype.$validator = validator
router.beforeEach((to, from, next) => {
  if (validator.isValidateUser() || to.path === '/login') {
    next()
  } else {
    next({
      path: '/login',
      query: {
        redirect: to.path,
        ...to.query,
      },
    })
  }
})

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')

