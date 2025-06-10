<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>欢迎</span>
      </div>
    </template>
    <el-result
        icon="success"
        title="欢迎使用本系统！"
        sub-title="请通过左侧菜单开始您的操作，或点击右上角登录/查看个人信息。"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/login')">立即登录</el-button>
      </template>
    </el-result>
  </el-card>
</template>

<script setup>
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>