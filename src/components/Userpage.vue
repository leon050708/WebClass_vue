<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span><el-icon><User /></el-icon> 个人中心</span>
      </div>
    </template>

    <el-row :gutter="20">
      <el-col :span="16">
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
      </el-col>

      <el-col :span="8">
        <div class="avatar-container">
          <el-avatar :size="120" :src="avatarUrl" @error="handleAvatarError">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              name="avatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-error="onUploadError"
              :before-upload="beforeAvatarUpload"
          >
            <el-button type="primary" style="margin-top: 15px;">点击上传头像</el-button>
          </el-upload>
          <div class="el-upload__tip">
            只能上传 jpg/png 文件，且不超过 2MB
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const route = useRoute();
const userId = ref('');
const userName = ref('');
const avatarUrl = ref('');

// 计算属性，用于动态生成上传URL
const uploadUrl = computed(() => {
  if (userId.value) {
    return `http://127.0.0.1:8080/api/user/${userId.value}/avatar`;
  }
  return '';
});

// 刷新头像的函数，通过添加时间戳来避免浏览器缓存
const refreshAvatar = () => {
  if (userId.value) {
    avatarUrl.value = `http://127.0.0.1:8080/api/user/${userId.value}/avatar?t=${new Date().getTime()}`;
  }
};

onMounted(() => {
  // 优先从路由参数获取，其次从localStorage获取，确保刷新后数据不丢失
  userId.value = route.params.id || localStorage.getItem('userId');
  userName.value = route.params.name || localStorage.getItem('userName');
  refreshAvatar(); // 组件挂载时加载头像
});

const handleAvatarError = () => {
  // 当头像src无法加载时，此函数被调用。
  // 模板中已经通过插槽设置了默认图片，这里可以用于调试。
  console.log('Avatar could not be loaded.');
  return true; // 阻止 el-avatar 默认的错误行为
}

const handleAvatarSuccess = (response, uploadFile) => {
  ElMessage.success('头像上传成功!');
  refreshAvatar(); // 上传成功后刷新头像
};

const onUploadError = (error, uploadFile) => {
  ElMessage.error('头像上传失败，请重试');
  console.error('Upload error:', error);
}

const beforeAvatarUpload = (rawFile) => {
  const isJpgOrPng = rawFile.type === 'image/jpeg' || rawFile.type === 'image/png';
  if (!isJpgOrPng) {
    ElMessage.error('头像图片只能是 JPG/PNG 格式!');
    return false;
  }
  const isLt2M = rawFile.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('头像图片大小不能超过 2MB!');
    return false;
  }
  return true;
};
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
.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-upload__tip {
  font-size: 12px;
  color: #999;
  margin-top: 7px;
  text-align: center;
}
</style>