import Vuex from 'vuex'
import remote from '@/utils/remote'
import router, { constRoutes, functionalRoutes } from '@/router/router'
import config from '@/utils/config'
import dynamicRouters from '@/router/dynamicRouters'
import filterAsyncRouter from '@/store/permission'
import localStorageTools from '@/store/localStorageTools'

Vue.use(Vuex)
let layout = localStorageTools.getLayout()
export default new Vuex.Store({
  state: {
    app: {
      name: '佳谕ADMIN',
      subtext: '商城管理平台',
      dark: false,
      loading: 0,
    },
    user: {
      info: {},
      //角色
      roles: [],
      //当前用户菜单权限
      menu: [],
      //全部菜单权限
      allMenu: [],
      //自己维护一份动态路由表,用于菜单权限
      generatedRoutes: undefined,
    },
    layout: {
      miniSide: layout.miniSide,
      showToolbar: layout.showToolbar,
    },
  },
  getters: {},
  mutations: {
    showToolBar: function (state, payload) {
      state.layout.showToolbar = payload
      localStorageTools.setToolbar(state.layout.showToolbar)
    },
    toggleToolbar: function (state) {
      state.layout.showToolbar = !state.layout.showToolbar
      localStorageTools.setToolbar(state.layout.showToolbar)
    },
    setMiniSide: function (state, payload) {
      state.layout.miniSide = payload
      localStorageTools.setMiniSide(state.layout.miniSide)
    },
    toggleMiniSide: function (state) {
      state.layout.miniSide = !state.layout.miniSide
      localStorageTools.setMiniSide(state.layout.miniSide)
    },
    dark: function (state, payload) {
      state.app.dark = payload.dark
      payload.vue.$vuetify.theme.dark = payload.dark
    },

    login: function (state, payload) {
      state.user.info = payload.info
      state.user.roles = payload.roles
      state.user.menu = payload.menu
      state.user.allMenu = payload.allMenu
    },
    logout: function (state) {
      state.user.info = {}
      state.user.roles = []
      state.user.menu = []
    },
    loading: function (state, payload) {
      state.app.loading += payload
    },
    routeGenerated: function (state, payload) {
      state.user.generatedRoutes = payload
    },
  },
  actions: {
    login: async function (context) {
      if (context.state.user.info.id) {
        return
      }
      try {
        let rolesRes = await remote.post({
          url: '/authorization/roles/mine',
        })
        let menuRes = await remote.post({
          url: '/authorization/menu/mine',
        })
        let menuAllRes = await remote.post({
          url: '/authorization/menu/get',
        })
        let infoRes = await remote.post({
          url: '/user/getUserInfo',
        })
        context.commit('login', {
          roles: rolesRes.Data,
          info: infoRes.Data,
          menu: menuRes.Data,
          allMenu: menuAllRes.Data,
        })
        await context.dispatch('generateRoute')
      } catch (e) {
        console.log(e)
      }
    },
    logout: async function (context) {
      localStorage.setItem(config.tokenKey, '')
      context.commit('logout')
      await router.push({
        path: '/login',
        replace: true,
      })
    },
    isLogin: async function () {
      let token = localStorage.getItem(config.tokenKey)
      return !!token
    },
    hasGetUserInfo: async function (context) {
      return !!context.state.user.info && !!context.state.user.generatedRoutes
    },
    generateRoute: async function (context) {
      let filter = filterAsyncRouter(dynamicRouters,
        context.state.user.menu.map(m => m.path))
      let generated = [...constRoutes, ...filter, ...functionalRoutes]
      router.addRoutes(
        generated,
      )
      context.commit('routeGenerated', generated)
    },
    hasMenuPermission: function (context, payload) {
      let path = payload.path
      return context.state.user.menu.find(m => m.path === path)
    },
  },
  modules: {},
})
