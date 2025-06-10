<template>
  <div class="login-form">
    <h2>登录</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名 (name):</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">密码 (passw):</label>
        <input ref="passwordInputRef" type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
    </form>

    <button @click="goToRegisterPage" style="margin-top: 10px; background-color: #6c757d;">注册</button>

    <div v-if="displayMessage" :class="messageType" class="message">
      {{ displayMessage }}
    </div>

    <div v-if="loggedInUserInfo" class="user-info">
      <h3>用户信息:</h3>
      <p>ID: {{ loggedInUserInfo.id }}</p>
      <p>Name: {{ loggedInUserInfo.name }}</p>
    </div>
  </div>
</template>

<script setup>
// ✅ 修改：从 vue 导入 onMounted，从 vue-router 导入 useRoute
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

// --- 1. 状态管理 (State Management) ---
const username = ref('');
const password = ref('');
const displayMessage = ref('');
const messageType = ref('');
const loggedInUserInfo = ref(null);
// ✅ 新增：创建一个 ref 来引用密码输入框的 DOM 元素
const passwordInputRef = ref(null);


// --- 2. 路由 (Routing) ---
const router = useRouter();
// ✅ 新增：使用 useRoute() 来访问当前路由的信息 (比如 query 参数)
const route = useRoute();


// --- 3. 生命周期钩子 (Lifecycle Hooks) ---
// ✅ 新增：在组件挂载后执行的逻辑
onMounted(() => {
  // 尝试从 URL 的 query 中获取 username 参数
  const prefilledUsername = route.query.username;

  // 如果 URL 中存在 username 参数
  if (prefilledUsername) {
    // 将其填充到输入框
    username.value = prefilledUsername;

    // 并且将光标自动聚焦到密码输入框，提示用户输入密码
    // ?. 是可选链操作符，确保 passwordInputRef.value 存在时才调用 .focus()
    passwordInputRef.value?.focus();
  }
});


// --- 4. 方法 (Methods) ---
// 登录逻辑 (这部分无需改动)
const handleSubmit = async () => {
  displayMessage.value = '';
  messageType.value = '';
  loggedInUserInfo.value = null;

  try {
    const response = await axios.post('http://localhost:8080/api/login', {
      name: username.value,
      passw: password.value,
    });

    if (response.data && response.data.id) {
      loggedInUserInfo.value = response.data;
      displayMessage.value = `${loggedInUserInfo.value.name} 登录成功`;
      messageType.value = 'success';
      localStorage.setItem('userId', loggedInUserInfo.value.id);
      router.push({
        name: 'UserPage',
        params: { id: loggedInUserInfo.value.id }
      });
    } else {
      displayMessage.value = '登录失败: 返回的用户信息无效';
      messageType.value = 'error';
    }
  } catch (error) {
    console.error('登录请求失败:', error);
    loggedInUserInfo.value = null;
    if (error.response) {
      if (error.response.status === 401) {
        displayMessage.value = '登录失败: 用户名或密码错误。';
      } else {
        displayMessage.value = `登录失败: ${error.response.data.message || '请检查凭据'}`;
      }
    } else {
      displayMessage.value = '登录请求出错，请检查网络或后端服务。';
    }
    messageType.value = 'error';
  }
};

// 跳转到注册页面的方法 (这部分无需改动)
const goToRegisterPage = () => {
  router.push({ name: 'Register' });
};
</script>

<style scoped>
/* 您的样式无需改动 */
.login-form {
  width: 350px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.login-form h2 {
  text-align: center;
  margin-bottom: 20px;
}
.login-form div {
  margin-bottom: 15px;
}
.login-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.login-form input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.login-form button {
  width: 100%;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;
}
.login-form button:hover {
  background-color: #0056b3;
}
.login-form button[style*="background-color: #6c757d"]:hover {
  background-color: #5a6268;
}
.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}
.success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}
.error {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}
.user-info {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-align: left;
}
.user-info h3 {
  margin-top: 0;
  color: #333;
}
</style>