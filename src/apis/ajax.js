import axios from "axios"
import store from "../store"

const _axios = axios.create({
  baseURL: "/apis",
  timeout: 150000
})

//设置ajax请求拦截
_axios.interceptors.request.use(config => {
  let token = store.getters['common/getToken']
  if(!token) {
    if(config.url === '/user/validate/code' || config.url === '/user/app/login') {
      return config
    }else {
      return Promise.reject({code: 998,message: "用户非法操作---------"})
    }
  }else {
    config.headers.token = token
    return config
  }
})






export default req => {
  if(!req){
    throw new Error("must need params")
    return
  }
  if(!req.url){
    throw new Error("need url")
    return
  }

  return new Promise(resolve => {
    _axios.request({
      url: req.url,
      // method: !!req.method ? req.method : "GET",
      method: req.method || "GET",
      params: req.params || {},
      data: req.data || {},
      onUploadProgress: req.cb || (() => {})

    }).then(({data}) => {
      resolve(data)
    }).catch(e => {
      if(!!e.code) {
        resolve (e)
      }else{
        resolve({code: 999, message: "ajax err"})
      }
    })
  })
}