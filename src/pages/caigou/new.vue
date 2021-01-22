<template>
  <div class="projectEdit-container">
    <span class="title">项目基本信息</span>

    <div class="project-name">
      <div class="cell">
        <div class="left projectName">
          <span>创建人</span>
        </div>
        <div class="right">
          <input type="text" :value="caigouItem.createName" placeholder="请输入创建人" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>创建时间</span>
        </div>
        <div class="right">
          <input readonly placeholder="请选择创建时间" type="text" v-model="signTime" />
          <van-button size="small"  @click="dateShow = true;" type="primary">选择日期</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>项目名称</span>
        </div>
        <div class="right">
          <input readonly placeholder="请选择项目" v-model="projectName" type="text" />
          <van-button size="small" @click="projectShow = true;" type="primary">选择项目</van-button>
        </div>
      </div>
    </div>


    <span class="title">材料信息</span>

    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>材料名称</span>
        </div>
        <div class="right">
          <input readonly placeholder="请选择材料" v-model="materialName" type="text" />
          <van-button size="small"  @click="materialShow = true;" type="primary">选择材料</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>材料重量</span>
        </div>
        <div class="right">
          <input type="text" :value="caigouItem.materialWeight" placeholder="材料重量" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>单位</span>
        </div>
        <div class="right">
          <!-- <input type="text" placeholder="" /> -->
          <van-dropdown-menu class="menu">
            <van-dropdown-item class="item" v-model="value1" :options="option1" />
          </van-dropdown-menu>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>材料单价</span>
        </div>
        <div class="right">
          <input type="text" :value="caigouItem.price" placeholder="材料单价" />
        </div>
      </div>
    </div>



    <span class="title">供应商信息</span>

    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>名称</span>
        </div>
        <div class="right">
          <input readonly placeholder="请选择供应商" v-model="supplierName" type="text" />
          <van-button size="small"  @click="supplierShow = true;" type="primary">选择供应商</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系人</span>
        </div>
        <div class="right">
          <input type="text" :value="caigouItem.supplierContact" placeholder="联系人" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系电话</span>
        </div>
        <div class="right">
          <input type="text" :value="caigouItem.supplierPhone" placeholder="联系电话" />
        </div>
      </div>
    </div>


    <span class="title">审批信息</span>

    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>审批人</span>
        </div>
        <div class="right">
          <input readonly placeholder="请选择审批人" v-model="liableName" type="text" />
          <van-button size="small" @click="fuzerenShow = true" type="primary">选择审批人</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <input type="text" placeholder="填写备注" />
        </div>
      </div>
    </div>
    <button style="margin-top:20px" class="van-button van-button--primary van-button--normal van-button--block van-button--round"><div class="van-button__content"><span class="van-button__text">保存</span></div></button>


    <!-- 选择日期 -->
    <pick-time :show.sync='dateShow' @dateConfirm='dateConfirm'></pick-time>

    <!-- 选择项目 -->
    <pick-project :show.sync='projectShow' @projectConfirm='projectConfirm'></pick-project>

    <!-- 选择负责人 -->
    <pick-user :show.sync='fuzerenShow' @userConfirm='userConfirm'></pick-user>

    <!-- 选择材料 -->
    <pick-material :show.sync='materialShow' @materialConfirm='materialConfirm'></pick-material>
    
    <!-- 选择供应商 -->
    <pick-supplier :show.sync='supplierShow' @supplierConfirm='supplierConfirm'></pick-supplier>
 
 </div>
</template>

<script>
import BaseView from "../BaseView"

import pickUser from '../common/pickFuzeren'
import pickProject from '../common/pickProject'
import PickMaterial from '../common/pickMaterial'
import PickSupplier from '../common/pickSupplier'
import PickTime from '../common/pickTime'

export default {
  components: {
    pickUser,
    pickProject,
    PickMaterial,
    PickSupplier,
    PickTime,
  },
  extends: BaseView,
  data() { 
    return {
      value1: 1,
      option1: [
        { text: '千克', value: 0 },
        { text: '吨', value: 1 },
        { text: '方', value: 2 },
      ],
      dateShow: false,
      fuzerenShow: false,
      projectShow: false,
      materialShow: false,
      supplierShow: false,
      signTime: '',
      currentDate: '',
      liableName: '',
      projectName: '',
      materialName: '',
      supplierName: '',
      caigouItem: {}
    }
  },
  created () {
    this.setLayout("新建采购单")
    this.caigouItem = this.$store.getters['common/getCaiGouItem']
    if(this.caigouItem) {
      this.signTime = this.caigouItem.createTime.slice(0,10)
    }
    this.projectName = this.caigouItem.projectName
    this.materialName = this.caigouItem.materialName
    this.supplierName = this.caigouItem.supplierName
    this.liableName = this.caigouItem.supplierContact
  },
  methods:{

    dateConfirm (_date) {
      this.signTime = _date
    },
    userConfirm (user) {
      this.liableName = user.name
    },
    projectConfirm (item) {
      this.projectName = item.name
    },
    materialConfirm (item) {
      this.materialName = item.name
    },
    supplierConfirm (item) {
      this.supplierName = item.name
    }
  },
  beforeDestroy () {
    //退出前清除vuex中数据
    this.$store.dispatch('common/setCaiGouItem', '')
  }
 }
</script>



<style lang="less" scoped>
@import "../../style/projectEdit.less";

.menu {
  width: 50px;
  height: 24px;
  .van-dropdown-menu__bar {
    width: 50px;
    height: 24px;
  }
}

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