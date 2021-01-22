import Vue from "vue"
import Router from "vue-router"
import store from "../store"

Vue.use(Router)

import common from "./common"

const router = new Router({
  routes: [
    ...common
  ],
  mode: "hash"
})


router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    next()
    return
  }

  if(to.meta.requireLogin) {
    let token = store.getters['common/getToken']
    if(token) {
      next()
    }else {
      next('/login')
    }
  }else {
    next()
  }
})

export default router