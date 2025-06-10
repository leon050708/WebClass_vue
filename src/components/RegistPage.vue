<template>
  <div class="register-container">
    <el-card class="register-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h2>用户注册</h2>
        </div>
      </template>
      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          size="large"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="form.name" placeholder="请输入用户名" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="passw">
          <el-input
              v-model="form.passw"
              type="password"
              placeholder="请输入密码"
              show-password
              :prefix-icon="Lock"
              clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="loading" style="width: 100%;">
            {{ loading ? '注册中...' : '注 册' }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="goBack" style="width: 100%;">返回登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { User, Lock } from '@element-plus/icons-vue';

// --- 状态和实例 ---
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({ name: '', passw: '' });

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 10, message: '长度应在 3 到 10 个字符', trigger: 'blur' },
  ],
  passw: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
});


// --- 方法定义 ---
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const response = await axios.post('http://127.0.0.1:8080/api/regist', form);

        ElMessage({
          message: '注册成功！将跳转到登录页面。',
          type: 'success',
        });
        setTimeout(() => {
          router.push({
            name: 'Login',
            query: { username: form.name }
          });
        }, 1500);

      } catch (error) {
        console.error("注册请求失败:", error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 409) {
            ElMessage.error(error.response.data.message || '注册失败：该用户名已被占用');
          } else {
            ElMessage.error(`注册失败: ${error.response.data.message || '服务器发生错误'}`);
          }
        } else {
          ElMessage.error('注册请求出错，请检查网络连接。');
        }
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.error('请检查表单输入是否正确！');
      return false;
    }
  });
};

const goBack = () => {
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7f9;
}
.register-card {
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