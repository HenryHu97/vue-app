<template>
  <div class="home-container">
    <div class="chart-box" :style="{ height: `${charHeight}px` }">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item>
          <span class="total">
            应付：{{ yinfu }}&nbsp;&nbsp;&nbsp;&nbsp;应收  {{ yinshou }}
          </span>
          <div class="pie-chart">
            <div ref="pie01"></div>
            <div ref="pie02"></div>
          </div>
        </van-swipe-item>
        <van-swipe-item>
          <div class="pie-chart">
            <div ref="lineChart"></div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div v-for="(item, i) in gonngNengList" :key="i" class="card-item-list">
      <header :class="item.cls">{{ item.label }}</header>
      <article>
        <div v-for="(item2, j) in item.children" :key="i + '-' + j" @click="toPageEvt(item2)">
          <i :class="item2.icon"></i>
          <span>{{ item2.label }}</span>
        </div>
      </article>
    </div>
  </div>
</template>


<script>
import BaseView from '../BaseView'
import echarts from "echarts"
import { getReceiveMoney, getPayMoney } from "../../apis/userApi"

export default {
  extends: BaseView,
  
  data() {
    return {
      charHeight: 0,
      testValue: 10,
      yinfu: 0,
      yinshou: 0,
      chartPie01: null,
      chartPie02: null,
      lineChart03: null,
      gonngNengList: [
        {
          label: "基础数据",
          cls: "base",
          children: [
            {
              has:true,
              label: "材料管理",
              icon: "material-list",
              path: "/material",
            },
            {has: true, label: "新建材料", icon: "material-new", path: "/material/new" },
            {has: true, label: "供应商管理", icon: "supplier-list", path: "/supply" },
            {
              has: true,
              label: "新建供应商",
              icon: "supplier-new",
              path: "/supply/new",
            },
          ],
        },
        {
          label: "项目管理",
          cls: "project",
          children: [
            { 
              has: true,
              label: "项目列表", 
              icon: "project-list", 
              path: "/project/list" 
            },
            { 
              has: true,
              label: "新建项目", 
              icon: "project-new", 
              path: "/project/edit" 
            }
          ],
        },
        {
          label: "采购管理",
          cls: "caigou",
          children: [
            { 
              has: true,
              label: "采购管理", 
              icon: "caigou-list", 
              path: "/caigou" 
            },
            { 
              has: true,
              label: "新建采购单", 
              icon: "caigou-new", 
              path: "/caigou/new" 
            }
          ],
        },
        {
          label: "收货管理",
          cls: "shouhuo",
          children: [
            { 
              has: true,
              label: "收货列表", 
              icon: "shouhuo-list", 
              path: "/shouhuo" 
            },
            { 
              has: true,
              label: "新建收货单", 
              icon: "shouhuo-new", 
              path: "/shouhuo/new" 
            }
          ],
        },
        {
          label: "系统管理",
          cls: "system",
          children: [
            {
              has: true,
              label: "设置",
              icon: "setting-list",
              path: "/setting",
            },
          ],
        },
      ],
    };
  },
  created() {
    this.setLayout("首页", false, false);

    if (!!window.plus) {
      plus.storage.getItem("auto-token", (data) => {
        console.log("获取手机内存token成功", data);
      });
    }
  },
  async mounted() {
    this.charHeight = 240;
    await this.$nextTick();

    // 初始化echarts
    this.chartPie01 = echarts.init(this.$refs.pie01);
    this.chartPie02 = echarts.init(this.$refs.pie02);
    this.lineChart03 = echarts.init(this.$refs.lineChart);

    //监听窗口尺寸变化
    // window.addEventListener("resize", () => {
    //   this.resizeChart()
    // })
    window.addEventListener("resize", this.resizeChart);

    //渲染应收饼图
    let receiveData = await getReceiveMoney();
    if (receiveData.code === 200) {
      let _data = receiveData.data[receiveData.data.length - 1];
      this.yinshou = _data.total;
      let arr = [
        { value: _data.total, name: "总金额" },
        { value: _data.receiving, name: "应收" },
        { value: _data.received, name: "已收" },
      ];
      this.renderPieFun(this.chartPie01, arr);
    }

    //渲染应付饼图
    let payData = await getPayMoney();
    if (payData.code === 200) {
      let _data = payData.data[payData.data.length - 1];
      this.yinfu = _data.total;
      let arr = [
        { value: _data.total, name: "总金额" },
        { value: _data.payable, name: "应付" },
        { value: _data.paid, name: "已付" },
      ];
      this.renderPieFun(this.chartPie02, arr);
    }

    let xAxisData = [],
      data = [[], [], [], []];

    receiveData.data.map((it) => {
      xAxisData.push(it.date.slice(5));
      data[0].push(it.receiving);
      data[1].push(it.received);
    });

    payData.data.map((it) => {
      data[2].push(it.payable);
      data[3].push(it.paid);
    });
    //渲染折线图
    this.renderLineFun(this.lineChart03, xAxisData, data);
  },

  methods: {
    //设置跳转页面
    toPageEvt (item) {
      if (item.has) {
        this.$router.push(item.path)
      } else {
        this.$toast({
          type: "fail",
          message: "此功能暂未开发"
        })
      }
    },

    resizeChart() {
      this.chartPie01.resize();
      this.chartPie02.resize();
      this.lineChart03.resize();
    },

    renderPieFun(chart, data) {
      let option = {
        visualMap: {
          show: false,
          min: 10000,
          max: 100000,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: data.sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: { normal: { show: true } },
            labelLine: {
              normal: {
                show: true,
                smooth: 0.2,
                length: 5,
                length2: 2,
              },
            },
            itemStyle: {
              normal: {
                color: "#c00",
                shadowBlur: 200,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      chart.setOption(option);
    },
    renderLineFun(chart, xAxisData, data) {
      chart.setOption({
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["应收", "已收", "应付", "已付"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xAxisData,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "应收",
            type: "line",
            stack: "总量",
            data: data[0],
          },
          {
            name: "已收",
            type: "line",
            stack: "总量",
            data: data[1],
          },
          {
            name: "应付",
            type: "line",
            stack: "总量",
            data: data[2],
          },
          {
            name: "已付",
            type: "line",
            stack: "总量",
            data: data[3],
          },
        ],
      });
    },
  },
};
</script>
  
<style lang="less" scoped>
@import "../../style/home.less";
.pie-chart {
  height: 240px;
  display: flex;
  > div {
    flex: 1;
    height: 240px;
  }
}
.total {
  display: block;
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  font-size: 0.8rem;
  text-align: center;
  color: #416fff;
}

.card-item-list {
  margin: 12px;
  background-color: #fff;
  padding: 6px;
  > header {
    margin: 0 -6px;
    height: 33px;
    border-bottom: 1px solid #ddd;
    font-size: 0.8rem;
    padding-left: 32px;
    line-height: 32px;
  }
  > article {
    display: flex;
    flex-wrap: wrap;
    > div {
      flex: 0 0 25%;
      text-align: center;
      > i {
        display: block;
        height: 64px;
        // margin: auto;
        .loop(1)            //                       /;
      }
      > span {
        font-size: 0.6rem;
      }
    }
  }
}

// 定义一个遍历方法
@list: material-list material-new supplier-list supplier-new project-list
       caigou-list caigou-new shouhuo-list shouhuo-new project-new setting-list;

.loop(@index) when (@index <= length(@list)) {
  @key: extract(@list, @index); //提取list中的元素
  &.@{key} {
    //相当于 &.material-list
    background: url("../../images/icons/@{key}.png") center center / 32px 32px
      no-repeat;
  }
  .loop(@index + 1);
}
</style>