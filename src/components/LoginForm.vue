<template>
  <div class="login-form">
    <h2>数据库登录</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="username">用户名 (name):</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">密码 (passw):</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
    </form>
    <div v-if="displayMessage" :class="messageClass" class="message">
      {{ displayMessage }}
    </div>
    <div v-if="loggedInUserInfo" class="user-info">
      <h3>用户信息:</h3>
      <p>ID: {{ loggedInUserInfo.id }}</p>
      <p>Name: {{ loggedInUserInfo.name }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      displayMessage: '', // 用于显示 "xx登录成功" 或 "登录失败"
      messageType: '', // 'success' or 'error'
      loggedInUserInfo: null, // 存储登录成功的用户信息
    };
  },
  computed: {
    messageClass() {
      return this.messageType;
    }
  },
  methods: {
    async handleSubmit() {
      this.displayMessage = '';
      this.messageType = '';
      this.loggedInUserInfo = null;

      try {
        const response = await axios.post('http://localhost:8080/api/login', {
          name: this.username,
          passw: this.password,
        });

        // 后端成功时返回 User 对象，失败时返回 null (或空body)
        if (response.data && response.data.name) { // 检查 response.data 是否是有效的用户对象
          this.loggedInUserInfo = response.data;
          // 作业要求: "**** 登录成功"
          this.displayMessage = `${this.loggedInUserInfo.name} 登录成功`;
          this.messageType = 'success';
        } else {
          // 后端返回 null 或 response.data 为空对象/无效用户对象
          this.displayMessage = '登录失败';
          this.messageType = 'error';
        }
      } catch (error) {
        console.error('登录请求失败:', error);
        this.loggedInUserInfo = null;
        if (error.response && error.response.status === 401) { // 假设后端对失败返回401
          this.displayMessage = '登录失败: 用户名或密码错误。';
        } else if (error.response && error.response.data) {
          this.displayMessage = `登录失败: ${error.response.data.message || '请检查凭据'}`;
        }
        else {
          this.displayMessage = '登录请求出错，请检查网络或后端服务。';
        }
        this.messageType = 'error';
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
  width: calc(100% - 16px);
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.login-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.login-form button:hover {
  background-color: #0056b3;
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