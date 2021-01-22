<template>
   <!-- 选择日期 -->

    <van-popup
      v-model="show"
      :close-on-click-overlay="false"
      position="bottom"
      :style="{ height: '310px' }"
    >
    <van-datetime-picker
      @confirm="dateConfirm"
      @cancel="$emit('update:show', false)"
      type="date"
      title="选择日期"
    />
    </van-popup>
</template>

<script>
import { dateFormat } from '../../util'


export default {
  data() { 
    return {
      origingTime: ''
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  async created() {

  },
  methods:{

    dateConfirm (_date) {
      this.origingTime = dateFormat('yyyy-MM-dd', _date)
      this.$emit('dateConfirm', this.origingTime)
      this.$emit('update:show', false)
    },
    
  },
 }
</script>

<style lang="less" scoped>

</style>