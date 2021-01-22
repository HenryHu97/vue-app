<template>
  <div class="login-container">
    <span class="login-title">贸易跟单系统</span>
    <div class="login-line">
      
      <input v-model="phone" type="text">
    </div>
    <div class="login-line pwd">
      <input v-model="vdtCode" type="text">
      <span @click="getVdtCodeEvent">{{vdtText}}</span>
    </div>
    <van-checkbox v-model="remember">七天免登陆？</van-checkbox>
    <van-button :loading="isLoading" loading-text="登录中..." @click="loginEvt" type="primary" :block="true" round>登录</van-button>
    <span class="login-right">powerdby 胡杨帅 &copy; 2020 - 2025</span>
  </div>
</template>

<script>
import { getVtdCode, loginApi, userInfoApi } from '../../apis/userApi'
export default {
  name: '',
  data() { 
    return {
      phone: "17882211898",
      vdtText: "获取验证码",
      remember: false,
      vdtCode: "",
      time: null,
      isLoading: false
    }
  },
  methods:{

    async getVdtCodeEvent () {
      if(this.vdtText !== "获取验证码") return
      if(!/^1[1-9]{1}[0-9]{9}$/.test(this.phone)){
        console.log(this.phone)
        this.$toast.fail('请输入正确的手机号')
        return
      }
      // this.vdtText = "重新获取(60s)"
      this.$toast.loading({message: "验证码获取中...", duration: 0})
      let result = await getVtdCode(this.phone)
      this.$toast.clear()
      if(result.code === 200) {
        this.vdtCode = result.data.vdtCode
        this.loopTime(Date.now())
      }else {
        this.vdtText = "获取验证码"
        this.$toast.fail("获取验证码失败，原因：" + result.message)
      }
    },
    loopTime (startTime) {
      this.time = setTimeout(() => {
        let dis = 10 - Math.floor((Date.now() - startTime) / 1000)
        this.vdtText = `重新获取(${dis}s)`
        if(dis > 0){
          this.loopTime(startTime)
        }else{
          this.vdtText = "获取验证码"
        }
      }, 200);
    },
    async loginEvt () {
      //校验手机号码是否正确
      if(!/^1[1-9]{1}[0-9]{9}$/.test(this.phone)) {
        this.$toast.fail("手机号码错误！请重新输入！")
        return
      }
      //校验验证码是否输入
      if(!this.vdtCode.trim()) {
         this.$toast.fail("请输入正确的验证码！")
         return
      }
      
      //防抖
      this.isLoading = true

      console.log(this.phone,this.vdtCode)
      let result = await loginApi(this.phone, this.vdtCode)
      console.log(result)
      if(result.code !== 200) {
        this.$toast.fail("登录失败，请重试！")
        this.isLoading = false
        return
      }

      //登录成功，将token存入store
      this.$store.dispatch("common/setToken", result.data.token)

      //获取用户信息
      console.log(this.$store.getters['common/getToken'])
      console.log(result.data.id)
      let userInfo = await userInfoApi(result.data.id)
      
      if(userInfo.code === 200) {
        this.$store.dispatch('common/setUserInfo', userInfo.data)
        if(this.remember) {
          if(!!window.plus) {
            plus.storage.setItem("auto-token", result.data.token)
          }else{
            localStorage.setItem("auto-token", result.data.token)
          }
        }else {
          localStorage.removeItem('auto-token')
        }
        this.$router.push('/home')
      }else {
        this.isLoading = false
        this.$toast.fail('用户登录失败，请重试')
      }
    }
  },
 }
</script>

<style lang="less" scope>
  @import "../../style/login.less";
</style>