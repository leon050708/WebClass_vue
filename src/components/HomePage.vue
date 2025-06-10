<template>
  <div class="common-layout">
    <el-container class="layout-container-demo">
      <el-header>
        <div class="header-content">
          <div class="logo-title">
<!--            <img alt="logo" src="@/assets/logo.svg" class="logo" />-->
            <h3>课程查询系统</h3>
          </div>
          <div class="toolbar">
            <div v-if="!userId">
              <el-button type="primary" @click="login" :icon="User">登录</el-button>
            </div>
            <div v-else>
              <el-dropdown>
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="toUserCenter" :icon="UserFilled">个人中心</el-dropdown-item>
                    <el-dropdown-item divided @click="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>

      <el-container>
        <el-aside width="220px">
          <el-scrollbar>
            <el-menu router :default-active="$route.path">
              <el-sub-menu index="/class-search">
                <template #title>
                  <el-icon><Search /></el-icon>课程查询
                </template>
                <el-menu-item index="/class" @click="to1_1">人文选修查询</el-menu-item>
                <el-menu-item index="/scclass" @click="to1_2">软件工程培养计划</el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="/test-pages">
                <template #title>
                  <el-icon><Menu /></el-icon>我的收藏
                </template>
                <el-menu-item index="/test/3/cao" @click="to2_1">人文选修</el-menu-item>
                <el-menu-item index="/test/4/ni" @click="to2_2">计划内课程</el-menu-item>
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
import { Search, Menu, User, SwitchButton, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter()
const userId = ref<string | null>(null)

onMounted(() => {
  userId.value = localStorage.getItem('userId');
  window.addEventListener('storage', () => {
    userId.value = localStorage.getItem('userId');
  })
})

function login() {
  router.push('/login')
}

function logout() {
  ElMessageBox.confirm(
      '您确定要退出登录吗?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    localStorage.removeItem('userId');
    userId.value = null;
    ElMessage.success('已成功退出');
    router.push('/');
  }).catch(() => {
    // 用户取消操作
  });
}

function toUserCenter() {
  if (userId.value) {
    router.push({ name: 'UserPage', params: { id: userId.value } })
  }
}
function to1_1() {
  router.push({ name: 'ClassPage' })
}
function to1_2() {
  router.push({ name: 'scClassPage' })
}
function to2_1() {
  router.push({
    name: 'Test',
    params: { AInt: 3, AString: 'cao' }
  })
}
function to2_2() {
  router.push({
    name: 'Test',
    params: { AInt: 4, AString: 'ni' }
  })
}
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: #ffffff;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.logo-title {
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo {
  height: 32px;
}
.logo-title h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: #ffffff;
  height: calc(100vh - 60px);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  /* 关键：给主内容区增加内边距 */
  padding: 20px;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.el-avatar {
  cursor: pointer;
}
</style>