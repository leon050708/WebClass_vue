<template>
  <div class="common-layout">
    <el-container class="layout-container-demo">
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <div v-if="!isLoggedIn">
            <el-button type="primary" @click="login">登录</el-button>
          </div>
          <div v-else>
            <el-dropdown>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-scrollbar>
            <el-menu :default-openeds="['1', '3']">
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><message /></el-icon>Navigator One
                </template>
                <el-menu-item index="1-1" @click="to1_1">Option 1</el-menu-item>
                <el-menu-item index="1-2" @click="to1_2">Option 2</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="2">
                <template #title>
                  <el-icon><message /></el-icon>Navigator One
                </template>
                <el-menu-item index="2-1">Option 1</el-menu-item>
                <el-menu-item index="2-2">Option 2</el-menu-item>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

// 2. 创建一个 ref 变量来追踪登录状态，默认为 false (未登录)
const isLoggedIn = ref(false)
const router = useRouter()

// 3. 创建模拟的登录和退出方法

function login() {
  router.push('/login')
  isLoggedIn.value = true;
}


function logout() {
  console.log('执行退出操作...');
  isLoggedIn.value = false;
}


function to1_1() {
  router.push('/test')
}

function to1_2() {
  router.push('/test2')
}

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
  /* 确保侧边栏和主内容区占满剩余高度 */
  height: calc(100vh - 60px); /* 100vh 减去 header 的高度 (默认为60px) */
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
/* 添加一个样式让头像有可点击的手型光标 */
.el-avatar {
  cursor: pointer;
}
</style>