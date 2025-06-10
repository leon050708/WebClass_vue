<template>
  <div class="login-container">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>系统登录</h2>
        </div>
      </template>

      <el-form
          :model="form"
          @submit.prevent="handleSubmit"
          label-position="top"
          size="large"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
              v-model="form.username"
              placeholder="请输入用户名"
              :prefix-icon="User"
              clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              ref="passwordInputRef"
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              native-type="submit"
              style="width: 100%;"
              :loading="loading"
          >
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
              style="width: 100%;"
              @click="goToRegisterPage"
          >
            没有账户？去注册
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
          v-if="displayMessage"
          :title="displayMessage"
          :type="messageType"
          show-icon
          :closable="false"
          style="margin-top: 10px;"
      />

    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';
import { useFavorites } from '@/stores/favoritesStore';

// --- 状态管理 ---
const form = reactive({
  username: '',
  password: '',
});
const displayMessage = ref('');
const messageType = ref('success');
const loading = ref(false);
const passwordInputRef = ref(null);

// --- 路由 ---
const router = useRouter();
const route = useRoute();
const { fetchFavorites } = useFavorites();

// --- 生命周期钩子 ---
onMounted(() => {
  const prefilledUsername = route.query.username;
  if (prefilledUsername) {
    form.username = prefilledUsername;
    passwordInputRef.value?.focus();
    ElMessage.success('注册成功，请输入密码登录');
  }
});

// --- 方法 ---
const handleSubmit = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码');
    return;
  }

  loading.value = true;
  displayMessage.value = '';

  try {
    const response = await axios.post('http://localhost:8080/api/login', {
      name: form.username,
      passw: form.password,
    });

    if (response.data && response.data.id) {
      const userInfo = response.data;
      localStorage.setItem('userId', userInfo.id);
      localStorage.setItem('userName', userInfo.name);

      await fetchFavorites();

      ElMessage.success(`${userInfo.name} 登录成功!`);

      // --- 核心改动：跳转到UserPage ---
      router.push({
        name: 'UserPage',
        params: {
          id: userInfo.id,
          name: userInfo.name
        }
      });
    } else {
      messageType.value = 'error';
      displayMessage.value = '登录失败: 返回的用户信息无效';
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    messageType.value = 'error';
    if (error.response) {
      if (error.response.status === 401) {
        displayMessage.value = '登录失败: 用户名或密码错误。';
      } else {
        displayMessage.value = `登录失败: ${error.response.data.message || '请检查凭据'}`;
      }
    } else {
      displayMessage.value = '登录请求出错，请检查网络或后端服务。';
    }
  } finally {
    loading.value = false;
  }
};

const goToRegisterPage = () => {
  router.push({ name: 'Register' });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7f9;
}
.login-card {
  width: 400px;
}
.card-header h2 {
  margin: 0;
  text-align: center;
  color: #333;
}
.el-form-item {
  margin-bottom: 20px;
}
</style>