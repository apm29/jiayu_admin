import Vue from 'vue'
import Vuex from 'vuex'
import remote from '@/utils/remote'
import validator from '@/utils/validator'
import router from '@/router/router'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    app: {
      name: 'MY ADMIN',
      subtext: 'pearl',
      dark:false
    },
    user: {
      info: {},
      roles: [],
    },
    layout: {
      miniSide: false,
      showToolbar: true,
      tags:[]
    },
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
      validator.logout()
      context.commit('logout')
      await router.push({
        path:"/login",
        replace:true
      })
    },
  },
  modules: {},
})
