import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    layout:{
      miniSide:false,
      hideToolBar:false
    }
  },
  mutations: {
    HIDE_TOOLBAR:function () {

    }
  },
  actions: {
  },
  modules: {
  }
})
