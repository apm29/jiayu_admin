let dynamicRouters = [
  {
    path: '/goods',
    name: '商品管理',
    component: () => import('@/views/IndexLayout')
  },
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
  {
    path: '/mall',
    name: '商城管理',
    component: () => import('@/views/IndexLayout'),
  },
  {
    path: '/brand/manager',
    name: '品牌管理',
    icon: 'mdi-cards-playing-outline',
    component: () => import('@/views/mall/BrandManager'),
  },
  {
    path: '/category/manager',
    name: '类目管理',
    icon: 'mdi-file-tree',
    component: () => import('@/views/mall/CategoryManager'),
  },
  {
    path: '/system',
    name: '系统管理',
    component: () => import('@/views/IndexLayout'),
  },
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
  {
    path: '/system/menu',
    name: '菜单设置',
    icon: 'mdi-playlist-edit',
    component: () => import('@/views/system/MenuManager'),
  },
]
export default dynamicRouters
