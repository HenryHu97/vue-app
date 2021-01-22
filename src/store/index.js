import Vue from "vue"
import Vuex from "vuex"

import common from "./common"
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    common
  },
  plugins: [
    //默认储存到localStorage中
    createPersistedState()
  ]
})

export default store