<template>
  <div id="app">
<!--    <LoginForm />-->
    <HomePage />
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
/* 全局样式 (可选) */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>