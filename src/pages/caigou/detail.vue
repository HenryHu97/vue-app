<template>
  <div class="projectEdit-container">
    <span class="title">采购基本信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>项目名称：</span>
        </div>
        <div class="right">
          <input type="text" readonly v-model="caigouItem.projectName" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>项目状态：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.state"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>材料名称：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.materialName"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>重量：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.materialWeight"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>单位：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.materialUnit"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>应付：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.paid"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>单价：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.price"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>建单人：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.createName"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>建单时间：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.createTime"/>
        </div>
      </div>
    </div>

    <!-- 供应商信息 -->
    <span class="title">供应商信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>供应商名：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.supplierName"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系人：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.supplierContact"/>
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系电话：</span>
        </div>
        <div class="right">
          <input type="text" readonly  v-model="caigouItem.supplierPhone"/>
        </div>
      </div>
    </div>

    <!-- 环节信息 -->
    <span class="title">环节信息</span>
    <div class="project-name">
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(item, index) in this.caigouItem.remark" :key="index">
          <span>{{ new Date(item.time).toString().slice(11,25) }}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{ item.userName }}</span>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import BaseView from "../BaseView";
export default {
  extends: BaseView,
  data() {
    return {
      caigouItem: {},
      remarkArray: [],
      date:""
    };
  },
  created() {
    this.setLayout("采购单详情", false, true);
    this.caigouItem = this.$store.getters['common/getCaiGouItem']
  },
  methods: {},
  beforeDestroy() {
    this.$store.dispatch('common/setCaiGouItem', '')
  }
};
</script>

<style lang="less" scoped>
@import "../../style/projectEdit.less";

.item {
  height: 100%;
  ul {
    padding: 10px 15px;
    > li {
      display: flex;
      position: relative;
      justify-content: space-between;
      padding: 15px 0;
      align-items: center;
      > :after {
        content: "";
        display: block;
        position: absolute;
        bottom: 4px;
        left: 0px;
        right: 0px;
        border-bottom: 1px solid #ccc;
      }
      p {
        margin: 0;
      }
      > i {
        width: 24px;
        height: 24px;
        > img {
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
    font-size: 12px;
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