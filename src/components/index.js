//注册成全局插件
//引入页面组件
import PageLayout from "./PageLayout"

//引入空白页面组件
import BlankLayout from "./BlankLayout"

export default {
  install(Vue) {
    Vue.component("PageLayout", PageLayout)
    Vue.component("BlankLayout", BlankLayout)
  }
}