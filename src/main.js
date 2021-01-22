//引入Vue主库
import Vue from "vue"

//引入Vant组件库
import Vant from "vant"
import "vant/lib/index.css"


//引入项目组件入口
import App from "./pages"

//引入项目样式
import "./style/index.less"

import router from "./router"

//引入通用页面插件
import GlobleComponent from "./components"

//引入store
import store from "./store"

Vue.use(Vant)

Vue.use(GlobleComponent)

new Vue({
  el: "#root",
  router,
  store,
  render(createElement) {
    return createElement(App)
  }
})
