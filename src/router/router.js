import VueRouter from 'vue-router'
import Vue from 'vue'
import nprogress from 'nprogress'
import validator from '@/utils/validator'

Vue.use(VueRouter)
let router =  new VueRouter({
  routes: [
    {
      path: '/',
      icon:'mdi-compass',
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
    {
      path: '/main1',
      name: '父菜单1',
      component: () => import('@/views/IndexLayout'),
      children: [
        {
          path: '/cascader',
          name: '级联选择器',
          icon: 'mdi-onenote',
          component: () => import('@/views/cascader/CascaderExample'),
        },
        {

          path: '/uploader',
          name: '文件选择器',
          icon: 'mdi-tag-outline',
          component: () => import('@/views/uploader/FileUploaderExample'),
        },
      ],
    },
    {
      path: '/main2',
      name: '父菜单2',
      component: () => import('@/views/IndexLayout'),
      children: [
        {
          path: '/pc/uploader',
          name: 'Markdown',
          icon: 'mdi-android-messages',
          component: () => import('@/views/markdown/MarkdownEditorExample'),
        },
        {
          path: '/pc/list',
          name: '列表',
          icon: 'mdi-format-list-checks',
          component: () => import('@/views/listMore/LoadMoreExample'),
        },
      ],
    },
    {
      path: '/system',
      name: '系统管理',
      component: () => import('@/views/IndexLayout'),
      meta:{
        roles:['admin']
      },
      children: [
        {
          path: '/system/admin',
          name: '管理员设置',
          icon: 'mdi-monitor-lock',
          component: () => import('@/views/system/AdminManager'),
        },
        {
          path: '/system/role',
          name: '角色管理',
          icon: 'mdi-account-supervisor',
          component: () => import('@/views/system/RoleManager'),
        },
        {
          path: '/system/permission',
          name: '权限设置',
          icon: 'mdi-eye-plus',
          component: () => import('@/views/system/PermissionManager'),
        },
      ],
    },
    {
      path: '/',
      name: '商品管理',
      component: () => import('@/views/IndexLayout'),
      meta:{
        roles:['admin']
      },
      children: [
        {
          path: '/goods/create',
          name: '商品上架',
          icon: 'mdi-upload',
          component: () => import('@/views/goods/GoodsCreate'),
        },
        {
          path: '/goods/manager',
          name: '商品管理',
          icon: 'mdi-view-module',
          component: () => import('@/views/goods/GoodsManager'),
        },
      ],
    },
    {
      path: '/',
      name: '商城管理',
      component: () => import('@/views/IndexLayout'),
      meta:{
        roles:['admin']
      },
      children: [
        {
          path: '/brand/manager',
          name: '品牌管理',
          icon: 'mdi-cards-playing-outline',
          component: () => import('@/views/brand/BrandManager'),
        },
        {
          path: '/category/manager',
          name: '类目管理',
          icon: 'mdi-file-tree',
          component: () => import('@/views/brand/BrandManager'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login'),
      hidden: true,
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/404/404'),
      hidden: true,
    },
  ],
})


router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (await validator.isValidateUser() || to.path === '/login') {
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
router.afterEach(()=>{
  nprogress.start()
})
export default router
