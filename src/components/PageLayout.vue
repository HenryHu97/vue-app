<template>
  <div class="page-container">
    <header>
      <i @click="$router.push({
        path: '/home'
      }).catch(err => err)" v-if="layout.showHome" class="home"></i>
      <i @click="$router.back()" v-if="layout.showBack"></i>
      <span>{{layout.title}}</span>
    </header>
    <article>
      <router-view></router-view>
    </article>
  </div>
</template>

<script>
export default {
  computed: {
    layout() {
      return this.$store.getters["common/getLayout"]
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../style/page.less";
</style>