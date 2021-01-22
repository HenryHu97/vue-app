<template>
  <div class="caigou-container" @scroll="scrollEvt">
    <div class="top">
      <input type="text" v-model="projectName" placeholder="请输入项目名" />
      <van-dropdown-menu class="menu">
        <van-dropdown-item
          v-model="state"
          :options="[
            { text: '全部', value: '全部' },
            { text: '新建', value: '新建' },
            { text: '确认', value: '确认' },
            { text: '在途', value: '在途' },
            { text: '完成', value: '完成' },
            { text: '作废', value: '作废' },
          ]"
        />
      </van-dropdown-menu>
      <van-icon class="search" @click="search" name="search" />
    </div>

    <div class="item" v-for="(item, index) in list" :key="index">
      <van-swipe-cell class="cell">
        <span class="sp1"
          >{{ item.projectName }} -- {{ item.materialName }}</span
        ><br />
        <span class="sp2"
          >供应商：{{ item.supplierName }} 数量：{{
            item.materialWeight
          }}吨</span
        >
        <template #right>
          <van-button
            @click="btnEvt('delete', item)"
            v-if="item.state === '新建'"
            square
            text="删除"
            type="danger"
            class="delete-button"
          />
          <van-button
            @click="btnEvt('edit', item)"
            v-if="item.state === '新建'"
            square
            text="编辑"
            type="primary"
            class="delete-button"
          />
          <van-button
            @click="btnEvt('approve', item)"
            v-if="item.state !== '完成' && item.state !== '作废'"
            square
            text="审批"
            type="warning"
            class="delete-button"
          />
          <van-button
            @click="btnEvt('payable', item)"
            v-if="item.state === '完成'"
            square
            text="付款"
            type="warning"
            class="delete-button"
          />
          <van-button
            @click="btnEvt('detail', item)"
            square
            text="详情"
            type="primary"
            class="delete-button"
          />
        </template>
      </van-swipe-cell>
    </div>
    <div class="more">{{ hasMore ? "加载更多数据" : "我是有底线的" }}</div>

    <!-- 付款弹出框 -->
    <van-popup
      v-model="payShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
      <van-field
        readonly
        label="采购单号"
        placeholder=""
        v-model="caigouItem.projectId"
      />
      <van-field
        required
        label="收款人"
        placeholder=""
        v-model="caigouItem.supplierContact"
      />
      <van-field
        required
        label="付款金额"
        placeholder=""
        v-model="caigouItem.price"
      />
      <van-field type="textarea" label="备注" placeholder="填写备注" />
      <div class="password-btn">
        <van-button
          class=""
          type="primary"
          size="small"
          style="width: 250px; margin-right: 20px"
          @click="pay(caigouItem)"
          >付款</van-button
        >
        <van-button @click="payShow = false" size="small" style="width: 50px"
          >取消</van-button
        >
      </div>
    </van-popup>
  
    <!-- 审批弹出框 -->
    <van-popup
      v-model="shenpiShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
      <van-field
        readonly
        label="单据状态"
        placeholder=""
        v-model="caigouItem.state"
      />
      <van-field label="是否通过" placeholder="">
        <template slot="input">
          <van-dropdown-menu>
            <van-dropdown-item v-model="isApprove" :options="[
              {text: '通过', value: true},
              {text: '驳回', value: false}
            ]" />
          </van-dropdown-menu>
        </template>
      </van-field>
      <van-field
        label="审批人"
        placeholder=""
        v-model="caigouItem.supplierContact"
      />
      <van-field type="textarea" label="备注" placeholder="填写备注" />
      <div class="password-btn">
        <van-button
          class=""
          type="primary"
          size="small"
          style="width: 250px; margin-right: 20px"
          @click="shenpi(caigouItem)"
          >审批</van-button
        >
        <van-button @click="shenpiShow = false" size="small" style="width: 50px"
          >取消</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import BaseView from "../BaseView";
import { getCaigouListApi, deleteUserInfo, caigouPayApi, shenpiApi } from "../../apis/userApi";

export default {
  extends: BaseView,
  name: "",
  data() {
    return {
      state: "",
      isApprove: true,
      payShow: false,
      shenpiShow: false,
      projectName: "",
      materialList: Array,
      caigouItem: {},
    };
  },
  props: {},
  components: {},
  async created() {
    this.setLayout("采购管理");
    this.loading = true;
    this.getList();
  },
  methods: {
    async getList() {
      this.$toast.loading("加载中...");
      let result = await getCaigouListApi({
        page: this.page,
        size: this.size,
        projectName: this.projectName,
        state: this.state
      });
      if (result.code === 200) {
        this.loading = false;
        this.list =  this.page === 1 ? result.data.rows : [...this.list, ...result.data.rows];
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
    btnEvt(type, item) {
      switch (type) {
        case "delete":
          this.$dialog
            .confirm({
              title: "删除确认",
              message: "确认删除此条信息吗？",
            })
            .then(async () => {
              let result = await deleteUserInfo(item.id);
              if (result.code === 200) {
                this.$toast.success("删除数据成功！")
                this.page = 1;
                this.list = [];
                this.getList();
              } else {
                this.$toast.fail("删除数据失败！");
              }
            })
            .catch((e) => e);
          break;
        case "payable":
          this.payShow = true;
          this.caigouItem = item;
          console.log(item)
          
          break;
        case "edit":
          this.$store.dispatch('common/setCaiGouItem', item)
          this.$router.push('/caigou/new')
        case "approve":
          this.shenpiShow = true,
          this.caigouItem = item
          console.log(item)
          break
        case "detail":
          this.$store.dispatch('common/setCaiGouItem', item)
          this.$router.push('/caigou/detail')
        default:
          break;
      }
    },
    async pay(item) {
      this.payShow = false
      let result = await caigouPayApi({
        id: item.id,
        amount: item.price,
        userId: item.createid,
        userName: item.createName,
        remark: ''
      })
      if(result.code === 200) {
        this.$toast.success("支付成功！")
      } else {
        this.$toast.fail("支付失败！")
      }
    },

    async shenpi(item) {
      this.shenpiShow = false
      let result = await shenpiApi({
        id: item.id,
        isReject: this.isApprove,
        userId: item.createId,
        userName: item.createName,
        remark: ""
      })
      if(result.code === 200) {
        this.$toast.success("审批通过！")
      } else {
        this.$toast.fail("审批失败！")
      }
    },
    search () {
      this.loading = true,
      this.page = 1,
      this.getList()
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../style/common.less";
.caigou-container {
  height: 100%;
  overflow-x: hidden;
  > .top {
    display: flex;
    align-items: center;
    position: relative;
    padding: 3px 0 3px 8px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 12px;
    background-color: #fff;
    .clear();
    > input {
      flex: 1;
      width: 0;
      height: 36px;
      border: none;
      outline: none;
      font-size: 0.7rem;
      color: #1e1e1e;
    }
    > .menu {
      height: 100%;
      flex: 0 0 86px;
    }
    > .search {
      padding: 0 20px;
    }
  }
  > .item {
    display: block;
    position: relative;
    padding: 5px 16px;
    background-color: #fff;
    &::after {
      content: "";
      position: absolute;
      border-bottom: 1px solid #ccc;
      left: 20px;
      right: 20px;
    }
    // border-bottom: 1px solid #ccc;
    .sp1 {
      font-size: 16px;
    }
    .sp2 {
      font-size: 12px;
    }
  }
  .more {
    text-align: center;
    font-size: 0.6rem;
    color: #ccc;
  }
}
</style>