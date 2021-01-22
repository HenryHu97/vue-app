<template>
  <div class="projectEdit-container">
    <span class="title">项目基本信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left projectName">
          <span>项目名</span>
        </div>
        <div class="right">
          <input type="text" placeholder="请输入项目名" v-model="data.name" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>签订日期</span>
        </div>
        <div class="right">
          <input readonly type="text" v-model="data.signTime"/>
          <van-button
            size="small"
            @click="
              dateShow = true;
            "
            type="primary"
            >选择日期</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>地市</span>
        </div>
        <div class="right">
          <input type="text" readonly v-model="cityName" />
          <van-button
            size="small"
            @click="
              placeShow = true;
            "
            type="primary"
            >选择地市</van-button
          >
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>详细信息</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.address" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>负责人</span>
        </div>
        <div class="right">
          <input readonly type="text" v-model="data.liableName" />
          <van-button
            size="small"
            @click="fuzerenShow = true"
            type="primary"
            >选择负责人</van-button
          >
        </div>
      </div>
    </div>
    <!-- 业主信息 -->
    <span class="title">业主信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>业主</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.ownerName" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>业主地址</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.ownerAddress" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span>联系电话</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.ownerPhone" />
        </div>
      </div>
    </div>

    <!-- 备注信息 -->
    <span class="title">备注信息</span>
    <div class="project-name">
      <div class="cell">
        <div class="left">
          <span>备注</span>
        </div>
        <div class="right">
          <input type="text" v-model="data.ownerPhone" />
        </div>
      </div>
      <div class="cell">
        <div class="left">
          <span></span>
        </div>
        <div class="right">
          <input type="text" value="" />
        </div>
      </div>
    </div>
    <button style="margin-top:20px" @click="commit" class="van-button van-button--primary van-button--normal van-button--block van-button--round"><div class="van-button__content"><span class="van-button__text">保存</span></div></button>

    <!-- 日期选择 -->
    <van-popup
      v-model="dateShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
    <van-datetime-picker
      v-model="currentDate"
      @confirm="dateConfirm"
      @cancel="dateShow = false"
      type="date"
      title="选择日期"
    />
    </van-popup>


    <!-- 地市选择 -->
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


    <!-- 选择负责人 -->
    
    <pick-user :show.sync='fuzerenShow' @userConfirm='userConfirm'></pick-user>


    <!-- <van-popup
      v-model="fuzerenShow"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '90%' }"
    >
    <div class="item" @click="scrollEvt">
      <ul>
        <li v-for="(item, index) in userList" :key="index" @click="userConfirm(item)">
          <p class="owner">{{ item.name }}</p>
          <i><img src="../../images/more-icon.png" alt=""></i>
        </li>
        <div class="more">{{ hasMore ? "加载更多数据" : "我是有底线的" }}</div>
      </ul>
    </div>
    </van-popup> -->

  </div>
</template>

<script>
import BaseView from "../BaseView";
import { dateFormat } from '../../util'
import { getCityList, getUserListApi, updateProjectApi } from "../../apis/userApi"
// 引入选择用户组件
import pickUser from '../common/pickFuzeren'

export default {
  computed: {
    projectItem() {
      return this.$store.getters['common/getprojectItem']
    }
  },
  components: {
    pickUser
  },
  extends: BaseView,
  data() {
    return {
      isEdit: false,      // 标志是否进入编辑状态
      fuzerenShow: false,
      dateShow: false,
      placeShow: false,
      cityList: [],
      cityName: [],
      cityNumber: [],
      
      // projectItemName: '',
      // signTime: '',
      // liableName: '',
      userList: [],
      // currentDate: new Date(),
      // time: '',
      // projectItem: {},
      data: {}
    };
  },

  async created() {
    // this.projectItem = this.$store.getters['common/getprojectItem']

    this.isEdit = !!this.projectItem


    this.setLayout(this.isEdit ? "编辑项目" : '新建项目', !this.isEdit, this.isEdit)

    if(this.isEdit) {
      this.data = JSON.parse(JSON.stringify(this.projectItem)) 
      console.log(this.data)
    }


    //获取项目数据
    // this.data.name = this.projectItem.name
    // this.signTime = this.projectItem.signTime
    // this.liableName = this.projectItem.liableName


    // let res = await getUserListApi({
    //   page: this.page,
    //   size: this.size,
    // })
    // this.userList = res.data.rows
    // console.log(this.userList)

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
      if (item.value === this.projectItem.province) {
        this.cityName.push(item.label)
        item.children.filter(item2 => {
          if(item2.value == this.projectItem.city) {
            this.cityName.push(item2.label)
            item2.children.filter(item3 => {
              if(item3.value == this.projectItem.county) {
                 this.cityName.push(item3.label)
              }
            })
          }
        })
      }
    })
  },

  methods: {
    dateConfirm (_date) {
      this.data.signTime = dateFormat('yyyy-MM-dd', _date)
      this.dateShow = false
    },

    pickUser(user) {
      this.data.liableId = user.id
      this.data.liableName = user.name
    },
            
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
    userConfirm (user) {
      this.data.liableName = user.name
    },

    async commit () {
      if(!!this.data.name) {
        if(this.isEdit) {
          let res = await updateSupplyApi(data)
          console.log(res)
          if(res.code === 200) {
            this.$toast.success("更新供应商信息成功！")
          } else {
            this.$toast.fail("更新供应商信息失败！")
          }
        } else {
          let r = await saveSupplyApi(data)
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
  beforeDestroy() {
    this.$store.dispatch('common/setprojectItem', '')
  },
};
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