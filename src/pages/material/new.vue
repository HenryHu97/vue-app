<template>
  <div class="material-container">
    <span class="title">基本信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left projectName">
          <span>类型名称</span>
        </div>
        <div class="right">
          <input type="text" placeholder="请输入类型名称" v-model="data.name" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>大类</span>
        </div>
        <div class="right">
          <input readonly type="text" v-model="data.parentName"/>
          <van-button
            size="small"
            type="primary"
            @click="materialShow = true"
            >选择大类</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <input type="text" :value="data.remark" />
        </div>
      </div>
    </div>
    <button style="margin-top:20px" @click="commit" class="van-button van-button--primary van-button--normal van-button--block van-button--round"><div class="van-button__content"><span class="van-button__text">保存</span></div></button>
    <!-- 弹出层选择大类 -->
    <van-popup
      v-model="materialShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
    <van-picker show-toolbar
      title="选择大类"
      :columns="materialList"     
      @confirm='materialConfirm'                    
      @cancel="materialShow = false"
    />
    </van-popup>
 </div>
 
</template>

<script>
import BaseView from "../BaseView";
import  { getMaterialList, updateMaterialApi, saveMaterialApi } from "../../apis/userApi"


export default {
  extends: BaseView,
  name: '',
  data() { 
    return {
      
      isEdit: false,      // 标志是否进入编辑状态
      materialShow: false,
      materialList: Array,
      // materialItem: {},
      data: {
        id: '',
        name: '',
        parentId: '',
        parentName: '',
        remark: ''
      }
    }
  },
  computed: {
    materialItem() {
      return this.$store.getters['common/getMaterialItem']
    }
  },

  async created() {
    // this.materialItem = this.$store.getters['common/getMaterialItem']

    this.isEdit = !!this.materialItem
    console.log(this.isEdit)

    this.setLayout(this.isEdit ? "编辑材料" : '新建材料', !this.isEdit, this.isEdit)

    if(this.isEdit) {
      this.data = JSON.parse(JSON.stringify(this.materialItem)) 
    }
    console.log(this.data)

    let result = await getMaterialList()
    if(result.code === 200) {
      this.materialList = result.data.rows.map(item => {
        return item.name
      })
    } else {
      this.$toast.fail("数据请求失败！")
    }
  },
  methods: {
    materialConfirm (val) {
      // this.materialType = val
      console.log(val)
      this.data.parentName = val
      this.materialShow = false
    },

    async commit () {
      if(!!this.data.name) {
        if(this.isEdit) {
          let res = await updateMaterialApi({
            id: this.data.id,
            name: this.data.name,
            parentId: this.data.parentId,
            parentName: this.data.parentName,
            remark: this.data.remark
          })
          console.log(res)
          if(res.code === 200) {
            this.$toast.success("更新材料信息成功！")
          } else {
            this.$toast.fail("更新材料信息失败！")
          }
        } else {
          let r = await saveMaterialApi(this.data)
          if(r.code === 200) {
            this.$toast.success("添加材料信息成功！")
          } else {
            this.$toast.fail("添加材料信息失败！")
          }
        }
        this.data = {}
      } else {
        this.$toast.fail("请输入材料名字！")
      }
      
    }




  },
  beforeDestroy() {
    this.$store.dispatch('common/setmaterialItem', "")
  }
 }
</script>


<style lang=less scoped>
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