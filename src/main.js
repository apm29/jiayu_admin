import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import router from '@/router/router'

Vue.config.productionTip = false

router.beforeEach((to,from,next)=>{
  next()
})

new Vue({
  store,
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')

