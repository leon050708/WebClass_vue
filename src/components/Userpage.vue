<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span><el-icon><User /></el-icon> 个人中心</span>
      </div>
    </template>
    <el-descriptions
        v-if="userId"
        title="用户信息"
        :column="2"
        border
    >
      <el-descriptions-item label="用户ID" label-align="right" align="center">
        {{ userId }}
      </el-descriptions-item>
      <el-descriptions-item label="用户名" label-align="right" align="center">
        <el-tag size="small">{{ userName }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="角色" label-align="right" align="center">
        普通用户
      </el-descriptions-item>
      <el-descriptions-item label="注册时间" label-align="right" align="center">
        2025-06-10
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else description="无法获取用户信息，请先登录" />
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { User } from '@element-plus/icons-vue';

const route = useRoute();
const userId = ref('');
const userName = ref('');

onMounted(() => {
  // 优先从路由参数获取，其次从localStorage获取，确保刷新后数据不丢失
  userId.value = route.params.id || localStorage.getItem('userId');
  userName.value = route.params.name || localStorage.getItem('userName');
});
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  font-weight: bold;
}
.card-header .el-icon {
  margin-right: 8px;
}
</style>