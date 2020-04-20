import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)
export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashBoard'),
      hidden: true,
    },
    {
      path: '/main0',
      name: '父菜单0',
      icon:'mdi-compass',
      component: () => import('@/views/DashBoard'),
      children: [
        {
          path: '/dashboard',
          name: '首页',
          icon: 'mdi-view-dashboard',
          component: () => import('@/views/dashboard/Dashboard'),
        },
      ],
    },
    {
      path: '/main1',
      name: '父菜单1',
      component: () => import('@/views/DashBoard'),
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
      component: () => import('@/views/DashBoard'),
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
