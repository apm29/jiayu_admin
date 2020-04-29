
import Vuex from 'vuex'
import remote from '@/utils/remote'
import router from '@/router/router'
import config from '@/utils/config'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: {
      name: 'MY ADMIN',
      subtext: 'pearl',
      dark:true
    },
    user: {
      info: {},
      roles: [],
    },
    layout: {
      miniSide: true,
      showToolbar: true,
      tags:[]
    },
  },
  getters:{

  },
  mutations: {
    showToolBar: function (state, payload) {
      state.layout.showToolbar = payload
    },

    toggleToolbar: function (state) {
      state.layout.showToolbar = !state.layout.showToolbar
    },
    dark:function(state, payload){
      state.app.dark = payload.dark
      payload.vue.$vuetify.theme.dark = payload.dark
    },

    setMiniSide: function (state, payload) {
      state.layout.miniSide = payload
    },

    toggleMiniSide: function (state) {
      state.layout.miniSide = !state.layout.miniSide
    },
    login: function (state, payload) {
      state.user.info = payload.info
      state.user.roles = payload.roles
    },
    logout: function (state) {
      state.user.info = {}
      state.user.roles = []
    },
  },
  actions: {
    login: async function (context) {
      if(context.state.user.info.id){
        return
      }
      try {
        let rolesRes = await remote.post({
          url: '/authorization/roles/mine',
        })
        let infoRes = await remote.post({
          url: '/user/getUserInfo',
        })
        context.commit('login', {
          roles: rolesRes.Data,
          info:infoRes.Data
        })
      } catch (e) {
        console.log(e)
      }
    },
    logout: async function (context) {
      localStorage.setItem(config.tokenKey,'')
      context.commit('logout')
      await router.push({
        path:"/login",
        replace:true
      })
    },
    isLogin: async function () {
      let token = localStorage.getItem(config.tokenKey)
      let validate = !!token
      if(validate){
        await this.dispatch('login')
      }
      return validate
    },
  },
  modules: {},
})
