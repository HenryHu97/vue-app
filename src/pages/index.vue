//定义一个vue组件

<template>
  <div class="app-container">
    <component :is="layout"></component>
  </div>
</template>


<script>

export default {
  data() {
    return {
      layout: ""
    };
  },

  watch: {
    "$route.path"() {
      this.layout = this.$route.meta.layout
    }
  }
  
};
</script>

<style scope>
</style>