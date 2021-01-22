<template>
    <div class="project-container">
        <img @click="paiZhao" :src="`/apis${userInfo.photo}`" alt="">
        <!-- <van-button @click="paiZhao">拍照</van-button> -->
        <div  class="setting-item" @click="clearCahce">
            <span>清除缓存</span>
            <i></i>
        </div>
        <div  class="setting-item">
            <span @click="show = true">修改密码</span>
            <i></i>
        </div>
        <div  class="setting-item" @click="fileEvt">
            <span>上传文件</span>
            <i></i>
        </div>
        <div  class="setting-item" @click="downloadImg">
            <span>下载头像</span>
            <i></i>
        </div>
        <!-- <van-button @click="setCache">设置缓存</van-button>
        <van-button @click="getCache">获取缓存</van-button> -->

        <!-- <input type="file" @change="fileEvt"/> -->

        <!-- 进度条 -->
        <van-progress v-if="progressShow" class="progress" :percentage="`${progress}`" />

        <!-- <div class="progress">
            <span :style="{width: `${progress}%`}"></span>
        </div> -->


        <van-button class="logout" block type="primary" @click="logOut">退出系统</van-button>

        <!-- 弹出层 -->
        <van-popup v-model="show" 
            position="bottom"
            :close-on-click-overlay='false'>
            
            <van-field  placeholder="请输入密码" v-model.trim="pwd"/>
            <van-field  placeholder="请再次确认密码" v-model.trim="confirmPwd"/>
            <div class="ok-cancle">
                <van-button block type="primary" @click="confirmEvt">确定</van-button>
                <van-button block type="info" @click="show = false">取消</van-button>
            </div>
        </van-popup>

    </div>
</template>

<script>
import { formUploadApi, uploadFileApi, updateUserInfoApi } from '../../apis/userApi'
    import BaseView from '../BaseView'

    export default {
        extends: BaseView,
        data() {
            return {
                progress: 0,
                userInfo: {},
                show: false,
                progressShow: false,
                pwd: "",
                confirmPwd: "",
            }
        },
        created() {
            //获取vux中的用户信息
            this.userInfo = this.$store.getters['common/getUserInfo']

            //加载界面样式及组件
            this.$store.dispatch('common/setLayout', {title: '系统设置', showHome: false, showBack: true})

        },
        methods: {
            setCache () {
                window.plus.storage.setItem('key-' + Date.now(), 'value:' + Date.now())
            },
            getCache () {
                let keys = window.plus.storage.getAllKeys()
                console.log(keys)
            },
            clearCahce () {
                if(window.plus && window.plus.storage) {
                    window.plus.storage.clear()
                    this.$toast({
                        type: "success",
                        message: "清除缓存成功"
                    })
                } else {
                    this.$toast.fail("清除缓存失败，请使用真机调试！")
                }
                
            },
            //退出系统
            logOut () {
                if(window.plus) {
                    window.plus.runtime.quit()
                } else {
                    this.$toast.fail("退出失败，请使用真机调试！")
                }
            },
            paiZhao() {
                if(window.plus) {
                    let camera = window.plus.camera.getCamera()
                    let img2 = document.querySelector("img")

                    camera.captureImage(path => {


                        window.plus.io.resolveLocalFileSystemURL(path, entry => {
                            entry.file(file => {
                                let fd = new window.plus.io.FileReader()
                                fd.onload = function(evt) {
                                    let img = new Image()
                                    img.onload = async () => {
                                        let canvas = document.createElement('canvas')
                                        canvas.width = 720
                                        canvas.height = 400
                                        let ctx = canvas.getContext('2d')
                                        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 720, 400)
                                        // console.log(canvas.toDataURL())

                                        let result = await uploadFileApi({
                                            type: 'testFile',
                                            data: canvas.toDataURL(),
                                            name: '头像.jpg'
                                        })
                                        console.log(result)
                                    }
                                    img2.src = evt.target.result
                                }
                                fd.readAsDataURL(file)
                            })
                        }, function() {
                            // console.log(arguments)
                        })
                    }, function() {
                        // console.log(arguments)
                    }, {})
                } else {
                    this.$toast.fail("请连接手机！")
                }
            },
            //上传文件
            fileEvt () {
                let input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('multiple', true)
                // 创建一个formData对象
                let fd = new FormData()
                input.click()
                input.onchange = async () => {
                    let files = input.files[0]
                    fd.append("fileName" ,files)
                    this.$toast.loading("加载中...")
                    let result = await formUploadApi(fd, (progress) => {
                        this.progress = (progress.loaded / progress.total * 100).toFixed(0)
                        if(this.progress > 0) {
                            this.progressShow = true
                        }
                        if(this.progress >= 100) {
                            this.progress = 100
                            this.progressShow = false
                        }
                    })
                    console.log(result)
                    if(result.code === 200) {
                        this.updateUserPhoto(result.data[0].path)
                    } else {
                        this.$toast.clear()
                        this.$toast.fail('上传失败！')
                    }
                }
            },
            //更新用户头像
            async updateUserPhoto (path) {
                let result = await updateUserInfoApi({
                    id: this.userInfo.id,
                    photo: path
                })
                if(result.code === 200) {
                    //更新vux中用户数据
                    this.$store.dispatch('common/setUserInfo', {...this.userInfo, photo: path })
                } else {
                    this.$toast.fail('用户数据更新失败，请重试！')
                }
            },
            //更新用户密码
            async confirmEvt (data) {
                if(this.pwd != this.confirmPwd) {
                    this.$toast.fail("两次输入的密码不一致，请重新输入！")
                    return
                }
                this.$toast.loading("加载中...")
                let result = await updateUserInfoApi({
                    id: this.userInfo.id,
                    password: this.pwd
                })
                if(result.code === 200) {
                    this.$toast.success("密码修改成功！")
                    //这里进行免登陆处理
                    if(window.plus && window.plus.storage) {
                        window.plus.storage.clear()
                    } else {
                        localStorage.clear()
                    }
                    this.$router.push("/login")
                } else {
                    this.$toast.fail("密码修改失败，请重试！")
                }
            },
            //下载头像
            downloadImg () {
                let a = document.createElement('a')
                a.setAttribute('href', `/apis${this.userInfo.photo}`)
                a.click()
            }
        },
    }
</script>

<style lang="less" scoped>
@import '../../style/common.less';
    .project-container{
        .rel-cls();
        height: 100%;
        overflow: hidden;
        >img{
            width: 150px; 
            height: 150px; 
            display: block; 
            margin: 12px auto; 
            border: solid 3px #416fff; 
            border-radius: 50%;
            padding: 4px;
        }
        .setting-item {
        display: flex;
        border-top: solid 1px #ddd;
        border-bottom: solid 1px #ddd;
        background-color: #fff;
        margin-bottom: .6rem;
        height: 2.1rem;
        >span {
            flex: 1;
            font-size: .85rem;
            font-weight: 400;
            text-indent: 22px;
            line-height: 2rem;
            color: #666;
        }
        >i {
            flex: 0 0 2.1rem;
            background: url(../../images/more-icon.png) center center / 20px 20px no-repeat;
            }
        }
        .ok-cancle {
            margin-top: 40px;
            :nth-child(1) {
                margin-bottom: 10px;
            }
        }
        .logout {
            position: absolute;
            bottom: 0;
        }
    }
    
    .progress {
        margin-top: 20px;
    }
    // .progress {
    //     margin: 12px;
    //     height: 20px;
    //     background-color: rgb(92, 84, 84);
    //     border-radius: 10px;
    //     border: 1px solid #ddd;
    //     overflow: hidden;
    //     >span {
    //         display: block;
    //         width: 0;
    //         height: 18px;
    //         background-color: red;
    //         transition: width .1s linear;
    //     }
    // }
</style>