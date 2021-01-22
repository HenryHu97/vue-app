<template>
  <div class="material-container">
    <div class="item" v-for="(item, index) in materialList" :key="index" @click="editEvt(item)">
      <span>{{item.name}}</span>
      <em>{{item.parentName}}</em>
      <i></i>
    </div>
 </div>
</template>

<script>
import BaseView from "../BaseView"
import  { getMaterialList } from "../../apis/userApi"

export default {
  extends: BaseView,
  data() { 
    return {
      materialList: Array
    }
  },
  props: {

  },
  components:{
  },
  async created() {
    this.setLayout("材料管理");
    let result = await getMaterialList()
    console.log(result)
    if(result.code === 200) {
      this.materialList = result.data.rows
    } else {
      this.$toast.fail("数据请求失败！")
    }
  },
  methods:{
    editEvt (val) {
      this.$router.push('/material/new')
      this.$store.dispatch('common/setmaterialItem', val)
    }
  },
 }
</script>

<style lang="less" scoped>
  .material-container {
    height: 100%;
    overflow-x: hidden;
    >.item {
      padding: 0 10px;
      margin: 10px 0;
      height: 46px;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      >span {
        line-height: 46px;
        font-size: 18px;
        margin-right: 10px;
        color: #416fff;
      }
      >em {
        line-height: 46px;
        font-style: normal;
        font-size: 14px;
      }
      >i {
        float: right;
        display: inline-block;
        line-height: 46px;
        width: 46px;
        height: 46px;
        background: url("../../images/more-icon.png") center center / 24px 24px no-repeat;
      }
    }
  }
</style>