<template>
  <div class="common-layout">
    <el-container class="layout-container-demo">
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <div v-if="!userId">
            <el-button type="primary" @click="login">登录</el-button>
          </div>
          <div v-else>
            <el-dropdown>
              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="toUserCenter">个人中心</el-dropdown-item>
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
                  <el-icon><message /></el-icon>课程查询
                </template>
                <el-menu-item index="1-1" @click="to1_1">人文选秀查询</el-menu-item>
                <el-menu-item index="1-2" @click="to1_2">软件工程培养计划</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="2">
                <template #title>
                  <el-icon><message /></el-icon>Navigator One
                </template>
                <el-menu-item index="2-1" @click="to2_1">3</el-menu-item>
                <el-menu-item index="2-2" @click="to2_2">4</el-menu-item>
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
import { ref, onMounted } from 'vue'
import { Message } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const userId = ref<string | null>(null)

// 页面加载时，检查 localStorage 中是否有 userId
onMounted(() => {
  userId.value = localStorage.getItem('userId');
  // 监听storage事件，以便在其他标签页登录/退出时，本页面能同步状态
  window.addEventListener('storage', () => {
    userId.value = localStorage.getItem('userId');
  })
})

function login() {
  router.push('/login')
}

function logout() {
  console.log('执行退出操作...');
  // 从 localStorage 移除 userId
  localStorage.removeItem('userId');
  userId.value = null;
  // 退出后跳转到首页
  router.push('/');
}

function toUserCenter() {
  if (userId.value) {
    router.push({ name: 'UserPage', params: { id: userId.value } })
  }
}

function to1_1() {
  router.push({
    name: 'ClassPage'
  })
}
function to1_2() {
  router.push({
    name: 'scClassPage'
  })
}
function to2_1() {
  router.push({
    name: 'Test',
    params: {
      AInt: 3,
      AString: 'cao'
    }
  })
}
function to2_2() {
  router.push({
    name: 'Test',
    params: {
      AInt: 4,
      AString: 'cao'
    }
  })
}
</script>

<style scoped>
/* 样式保持不变 */
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
  height: calc(100vh - 60px);
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
.el-avatar {
  cursor: pointer;
}
</style>