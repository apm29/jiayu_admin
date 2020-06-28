import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/store'
import Vue from 'vue'

Vue.use(VueRouter)
export const constRoutes = [
  {
    path: '/',
    icon: 'mdi-equalizer',
    component: () => import('@/views/IndexLayout'),
    children: [
      {
        path: '/',
        name: '首页',
        icon: 'mdi-equalizer',
        component: () => import('@/views/dashboard/Dashboard'),
      },
    ],
  },
  {
    path: '/login',
    name: '登录管理平台',
    component: () => import('@/views/Login'),
    hidden: true,
  },
]

export const functionalRoutes = [
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401/401'),
    hidden: true,
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404/404'),
    hidden: true,
  },
]

let router = new VueRouter({
  routes: constRoutes,
})

const routeWhiteList = [
  '/', '/login', '/404', '/401',
]

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = to.name || store.state.app.name
  if (await store.dispatch('isLogin') || to.path === '/login') {
    if (!await store.dispatch('hasGetUserInfo') && to.path !== '/login') {
      await store.dispatch('login')
      next({ ...to, replace: true })
    } else {
      //这里需要判断页面权限再放行
      if (routeWhiteList.indexOf(to.path) >= 0 ||
        await store.dispatch('hasMenuPermission', to)
      ) {
        next()
      } else {
        next({
          path: '/401',
          query: {
            noGoBack: 0,
            redirect: to.path,
            ...to.query,
          },
        })
      }

    }

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
router.afterEach(() => {
  NProgress.done()
})
export default router
