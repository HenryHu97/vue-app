<template>
  <div class="project-container" @scroll="scrollEvt">
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="editEvt(item)">
        <p class="title">{{ item.name }}</p>
        <p class="liab">负责人：{{ item.liableName }}&nbsp;&nbsp;地址：{{ item.address }}</p>
        <p class="owner">业主{{ item.ownweName }}&nbsp;&nbsp;联系电话：{{ item.ownerPhone }}</p>
        <!-- <i><img src="../../images/more-icon.png" alt=""></i> -->
      </li>
      <div class="more">{{ hasMore ? "加载更多数据" : "我是有底线的" }}</div>
    </ul>
  </div>
</template>

<script>
import BaseView from "../BaseView";
import { getApplyListApi } from "../../apis/userApi";

export default {
  extends: BaseView,
  data() {
    return {};
  },
  created() {
    //加载页面组件
    this.setLayout("项目列表");
    this.loading = true;
    this.getList();
  },
  methods: {
    async getList() {
      this.$toast.loading("加载中...");
      let result = await getApplyListApi({
        page: this.page,
        size: this.size,
      });
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

    editEvt(row) {
      this.$router.push({path: '/supply/new'})
      this.$store.dispatch("common/setSupplyItem", row)
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/project.less";
*{margin: 0;padding: 0;}
ul {
  height: 100%;
  >li {
    background: url("../../images/more-icon.png") 330px center / 24px 24px no-repeat;
    >p{
      padding: 5px 0
    }
    .rel-cls();
    padding: 12px 16px;
    &:after{
      content: "";
      height: 1px;
      width: 100%;
      display: block;
      background-color: #ccc;
    }
    >.title {
      font-size: .8rem;
      font-weight: 400;
    }
    >.liab {
      font-size: .6rem;
    }
    >.owner {
      font-size: .6rem;
    }
  }
  >.more {
    text-align: center;
    font-size: .6rem;
    color: #ccc;
  }
}
</style>