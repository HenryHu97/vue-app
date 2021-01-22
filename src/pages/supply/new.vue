<template>
  <div class="material-container">
    <span class="title">基本信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left projectName">
          <span>供应商名</span>
        </div>
        <div class="right">
          <input type="text" placeholder="请输入供应商名" v-model="data.name" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>地市</span>
        </div>
        <div class="right">
          <input readonly type="text" v-model="cityName"/>
          <van-button
            size="small"
            type="primary"
            @click="placeShow = true"
            >选择地市</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>详细地址</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.address" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>信用码</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.code" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系人</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.contact" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系电话</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.phone" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.address" />
        </div>
      </div>
    </div>
    <button style="margin-top:20px" @click="commit" class="van-button van-button--primary van-button--normal van-button--block van-button--round"><div class="van-button__content"><span class="van-button__text">保存</span></div></button>

    <!-- 选择地市 -->
    <van-popup
      v-model="placeShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
    <van-picker show-toolbar
      title="选择地市"
      :columns="cityList"                         
      @confirm="cityConfirm"
      @cancel="placeShow = false"
    />
    </van-popup>
 </div>
</template>

<script>
import BaseView from "../BaseView"
import { getCityList, updateSupplyApi, saveSupplyApi } from "../../apis/userApi"


export default {
  extends: BaseView,
  data() { 
    return {
      isEdit: false,      // 标志是否进入编辑状态
      placeShow: false,
      cityList: [],
      cityNumber: [],
      cityName: [],
      data: {
        name: '',
        province: '',
        city: '',
        county: '',
        address: '',
        code: '',
        contace: '',
        phone: '',
        remark: ''
       }
    }
  },
  computed: {
    supplyItem() {
      return this.$store.getters['common/getSupplyItem']
    }
  },
  components:{
  },
  async created() {
    this.isEdit = !!this.supplyItem
    // console.log(this.supplyItem)
    this.setLayout(this.isEdit ? "编辑供应商" : '新建供应商', !this.isEdit, this.isEdit)

     if(this.isEdit) {
      this.data = JSON.parse(JSON.stringify(this.supplyItem)) 
    }

    // this.supplyItem = this.$store.getters['common/getSupplyItem']
    let result = await getCityList()
    this.cityList = result.data.map(item => {
      item.text = item.label
      item.children.map(item2 => {
        item2.text = item2.label
        item2.children.map(item3 => {
          item3.text = item3.label
          return item3
        })
        return item2
      })
      return item
    })
    this.cityList.filter(item => {
      // console.log(item)
      if (item.value === this.supplyItem.province) {
        this.cityName.push(item.label)
        item.children.filter(item2 => {
          if(item2.value == this.supplyItem.city) {
            this.cityName.push(item2.label)
            item2.children.filter(item3 => {
              if(item3.value == this.supplyItem.county) {
                 this.cityName.push(item3.label)
              }
            })
          }
        })
      }
    })
  },
  methods:{
    cityConfirm (val) {
      console.log(val)
      this.cityName = val
      this.placeShow = false
      console.log(this.cityName[0])
      this.cityList.filter(item => {
        if (item.label === this.cityName[0]) {
          this.cityNumber.push(item.value)
          item.children.filter(item2 => {
            if(item2.label == this.cityName[1]) {
              this.cityNumber.push(item2.value)
              item2.children.filter(item3 => {
                if(item3.label == this.cityName[2]) {
                  this.cityNumber.push(item3.value)
                }
              })
            }
          })
        }
      })
      console.log(this.cityNumber)
    },
    async commit () {
      if(!!this.data.name) {
        if(this.isEdit) {
          let res = await updateSupplyApi({
            id: this.data.id,
            name: this.data.name,
            province: this.cityNumber[0],
            city: this.cityNumber[1],
            county: this.cityNumber[2],
            address: this.data.address,
            code: this.data.code,
            contact: this.data.contact,
            phone: this.data.phone,
            remark: this.data.remark
          })
          console.log(res)
          if(res.code === 200) {
            this.$toast.success("更新供应商信息成功！")
          } else {
            this.$toast.fail("更新供应商信息失败！")
          }
        } else {
          let r = await saveSupplyApi({
            name: this.data.name,
            province: this.cityNumber[0],
            city: this.cityNumber[1],
            county: this.cityNumber[2],
            address: this.data.address,
            code: this.data.code,
            contact: this.data.contact,
            phone: this.data.phone,
            remark: this.data.remark
          })
          if(r.code === 200) {
            this.$toast.success("添加供应商信息成功！")
          } else {
            this.$toast.fail("添加供应商信息失败！")
          }
        }
        this.data = {}
        this.cityName = []
      } else {
        this.$toast.fail("请输入供应商名字！")
      }
      
    }
  },
  destroyed() {
    this.$store.dispatch("common/setSupplyItem", '')
  },
 }
</script>

<style lang="less" scoped>
  @import "../../style/material.less";
.item {
  height: 100%;
  ul {
    padding: 10px 15px;
    >li {
      display: flex;
      position: relative;
      justify-content: space-between;
      padding: 15px 0;
      align-items: center;
      >:after {
        content: "";
        display: block;
        position: absolute;
        bottom: 4px;
        left: 0px;
        right: 0px;
        border-bottom: 1px solid #ccc;
      }
      p{margin: 0;}
      >i {
        width: 24px;
        height: 24px;
        >img {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
}


.title {
  display: block;
  position: relative;
  padding: 8px 0;
  font-size: 0.6rem;
  color: #666;
}
.project-name {
  background-color: #fff;
  > .cell {
    display: flex;
    position: relative;
    font-size: 14px;
    padding: 8px;
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: " ";
      pointer-events: none;
      right: 8px;
      bottom: 0;
      left: 8px;
      border-bottom: 1px solid #ebedf0;
    }
    > .left {
      width: 3.4rem;
      margin-right: 12px;
      position: relative;
    }
    .projectName::before {
      content: "*";
      color: red;
      position: absolute;
      left: -7px;
    }
    > .right {
      display: flex;
      > input {
        border: none;
        outline: none;
      }
    }
  }
}
</style>