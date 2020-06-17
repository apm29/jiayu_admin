import VueRouter from 'vue-router'
import nprogress from 'nprogress'
import store from '@/store/store'
import Vue from 'vue'

Vue.use(VueRouter)
export const constRoutes = [
  {
    path: '/',
    icon: 'mdi-compass',
    component: () => import('@/views/IndexLayout'),
    children: [
      {
        path: '/',
        name: '首页',
        icon: 'mdi-view-dashboard',
        component: () => import('@/views/dashboard/Dashboard'),
      },
    ],
  },
  //
  // {
  //   path: '/',
  //   name: '商品管理',
  //   component: () => import('@/views/IndexLayout'),
  //   meta: {
  //     roles: ['admin', 'operator'],
  //   },
  //   children: [
  //     {
  //       path: '/goods/create',
  //       name: '商品上架',
  //       icon: 'mdi-upload',
  //       component: () => import('@/views/goods/GoodsCreate'),
  //     },
  //     {
  //       path: '/goods/manager',
  //       name: '商品管理',
  //       icon: 'mdi-view-module',
  //       component: () => import('@/views/goods/GoodsManager'),
  //     },
  //   ],
  // },
  // {
  //   path: '/',
  //   name: '商城管理',
  //   component: () => import('@/views/IndexLayout'),
  //   meta: {
  //     roles: ['admin'],
  //   },
  //   children: [
  //     {
  //       path: '/brand/manager',
  //       name: '品牌管理',
  //       icon: 'mdi-cards-playing-outline',
  //       component: () => import('@/views/mall/BrandManager'),
  //     },
  //     {
  //       path: '/category/manager',
  //       name: '类目管理',
  //       icon: 'mdi-file-tree',
  //       component: () => import('@/views/mall/CategoryManager'),
  //     },
  //   ],
  // },
  //
  // {
  //   path: '/system',
  //   name: '系统管理',
  //   component: () => import('@/views/IndexLayout'),
  //   meta: {
  //     roles: ['admin'],
  //   },
  //   children: [
  //     {
  //       path: '/system/admin',
  //       name: '管理员设置',
  //       icon: 'mdi-monitor-lock',
  //       component: () => import('@/views/system/AdminManager'),
  //     },
  //     {
  //       path: '/system/role',
  //       name: '角色管理',
  //       icon: 'mdi-account-supervisor',
  //       component: () => import('@/views/system/RoleManager'),
  //     },
  //     {
  //       path: '/system/permission',
  //       name: '权限设置',
  //       icon: 'mdi-eye-plus',
  //       component: () => import('@/views/system/PermissionManager'),
  //     },
  //     {
  //       path: '/system/menu',
  //       name: '菜单设置',
  //       icon: 'mdi-playlist-edit',
  //       component: () => import('@/views/system/MenuManager'),
  //     },
  //   ],
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login'),
    hidden: true,
  },
]

export const functionalRoutes = [
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

router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (await store.dispatch('isLogin') || to.path === '/login') {
    document.title = to.name
    if (await store.dispatch('hasRouteGenerated')) {
      next()
    } else {
      await store.dispatch('generateRoute')
      next({ ...to, replace: true })
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
  nprogress.done()
})
export default router
