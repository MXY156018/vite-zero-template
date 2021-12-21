<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
// 引入初始化样式
@import "@/style/main.scss";
@import "@/style/base.scss";
@import "@/style/mobile.scss";
#app {
  background: #eee;
  height: 100vh;
  overflow: hidden;
  font-weight: 400 !important;
}
.el-button {
  font-weight: 400 !important;
}
</style>
