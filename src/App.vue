<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import LoginForm from './components/LoginForm.vue';
import HomePage from "./components/HomePage.vue";

export default {
  name: 'App',
  components: {
    HomePage,
    LoginForm,
  },
};
</script>

<style>
/* 全局样式 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* 新增：设置一个柔和的背景色 */
  background-color: #f4f7f9;
}

.common-layout {
  height: 100%;
}
</style>