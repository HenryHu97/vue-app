<template>
   <!-- 选择供应商 -->

    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '90%' }"
    >
    <div class="item" @click="scrollEvt">
      <ul>
        <li v-for="(item, index) in list" :key="index" @click="supplierConfirm(item)">
          <p class="owner">{{ item.name }}</p>
          <i><img src="../../images/more-icon.png" alt=""></i>
        </li>
        <div class="more">{{ hasMore ? "加载更多数据" : "我是有底线的" }}</div>
      </ul>
    </div>
    </van-popup>
</template>

<script>
import BaseView from "../BaseView";
import { getCityList, getProjectListApi, getMaterialList, getApplyListApi } from "../../apis/userApi"


export default {
  extends: BaseView,
  data() { 
    return {

    }
  },
  props: {
    show: {
      required: true,
      type: Boolean,
      default: false
    }
  },
  async created() {
    let res = await getApplyListApi({
      page: this.page,
      size: this.size,
    })
    this.list = res.data.rows
  },
  methods:{
    supplierConfirm (user) {
      this.$emit('supplierConfirm', user)
      this.$emit('update:show', false)

    },
    async getList() {
      this.$toast.loading("加载中...");
      let result = await getMaterialList();
      console.log(result);
      if (result.code === 200) {
        this.loading = false;
        this.list = this.page === 1 ? result.data.rows : [...this.list, ...result.data.rows];
        this.total = result.data.total;
        this.hasMore = this.page * this.size < result.data.total;
        this.$toast.clear();
      } else {
        this.$toast.fail("请求数据失败！");
      }
    },
    scrollEvt(evt) {
      if (this.loading) return;
      if (!this.hasMore) return;
      if (
        evt.target.clientHeight + evt.target.scrollTop >
        evt.target.scrollHeight - 15
      ) {
        console.log("已经到底了...");
        this.loading = true;
        ++this.page;
        console.log(this.page);
        this.getList();
      }
    },
  },
 }
</script>

<style lang="less" scoped>
@import "../../style/projectEdit.less";

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

.more{
  text-align: center;
  font-size: 14px;
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