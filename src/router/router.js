import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter)
export default new VueRouter({
    routes:[
      {
        path: '/',
        name: 'dashboard',
        component: () => import("@/views/DashBoard")
      },
      {
        path: '/login',
        name: 'login',
        component: () => import("@/views/Login")
      },





      {
        path: '*',
        name: '404',
        component: () => import("@/views/NotFound")
      },
    ]
})
