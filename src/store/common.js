import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const common = {

  namespaced: true,
  //定义数据对象
  state: {
    token: "",
    userInfo: {},
    layout: null,
    projectItem: {},
    materialItem: {},
    supplyItem: {},
    caigouItem: {}
  },
  //获取数据
  getters: {
    getToken(state) {
      return state.token
    },
    getLayout: state => {
      return {
          title: state.layout && state.layout.title ? state.layout.title : '标题',
          showHome: state.layout ? state.layout.showHome : false,
          showBack: state.layout ? state.layout.showBack : false
      }
    },
    getUserInfo: state => {
      return state.userInfo
    },
    getprojectItem: state => {
      return state.projectItem
    },
    getMaterialItem: state => {
      return state.materialItem
    },
    getSupplyItem: state => {
      return state.supplyItem
    },
    getCaiGouItem: state => {
      return state.caigouItem
    }
  },
  //动作
  actions: {
    setToken(store, token) {
      store.commit("mutationText", token)
    },
    setUserInfo({commit}, userInfo) {
      commit("mutationUserInfo", userInfo)
    },
    setLayout({commit}, layout) {
      commit("mutationLayout", {
        title: layout.title,
        showHome: layout.showHome === undefined ? true : layout.showHome,
        showBack: layout.showBack === undefined ? false : layout.showBack
        
      })
    },
    setprojectItem({ commit }, projectItem) {
      commit("mutationProjectItem", projectItem)
    },
    setmaterialItem({ commit }, materialItem) {
      commit("mutationMaterialItem", materialItem)
    },
    setSupplyItem({commit}, supplyItem) {
      commit('mutationSupplyItem', supplyItem)
    },
    setCaiGouItem({commit}, caigouItem) {
      commit('mutationCaiGouItem', caigouItem)
    }
  },
  //扭转数据
  mutations: {
    mutationText(state, token) {
      state.token = token
    },
    mutationUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    mutationLayout(state, layout) {
      state.layout = layout
    },
    mutationProjectItem(state, projectItem) {
      state.projectItem = projectItem
    },
    mutationMaterialItem(state, materialItem) {
      state.materialItem = materialItem
    },
    mutationSupplyItem(state, supplyItem) {
      state.supplyItem = supplyItem
    },
    mutationCaiGouItem(state, caigouItem) {
      state.caigouItem = caigouItem
    }
  }

}

export default common