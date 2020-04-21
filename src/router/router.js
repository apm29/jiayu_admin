import VueRouter from 'vue-router'
import Vue from 'vue'
import nprogress from 'nprogress'
import validator from '@/utils/validator'

Vue.use(VueRouter)
let router =  new VueRouter({
  routes: [
    {
      path: '/',
      name: '父菜单0',
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
          path: '/system/role',
          name: '角色管理',
          icon: 'mdi-account-supervisor',
          component: () => import('@/views/system/RoleManager'),
        },
        {
          path: '/system/admin',
          name: '管理员设置',
          icon: 'mdi-monitor-lock',
          component: () => import('@/views/system/AdminManager'),
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
