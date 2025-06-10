<template>
  <div class="form-container">
    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
    >
      <h2>用户注册</h2>
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="passw">
        <el-input v-model="form.passw" type="password" placeholder="请输入密码" show-password />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">
          {{ loading ? '注册中...' : '注册' }}
        </el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from "vue-router";
import axios from 'axios';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';

// --- 状态和实例（这部分无需改动）---
const router = useRouter();
const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({ name: '', passw: '' });
const rules = reactive<FormRules>({ /* ...您的规则... */ });


// --- 方法定义 ---
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        // ✅ try 代码块现在只处理真正成功的情况 (HTTP 200)
        const response = await axios.post('http://127.0.0.1:8080/api/regist', form);

        // 只有当请求成功时，才会执行到这里
        ElMessage({
          message: '注册成功！将跳转到登录页面。',
          type: 'success',
        });
        setTimeout(() => {
          router.push({
            name: 'Login', // 目标路由的名称
            query: {
              username: form.name // 将用户名作为 query 参数
            }
          });
        }, 1500);

      } catch (error) {
        // ✅ catch 代码块现在处理所有错误 (包括409用户名重复)
        console.error("注册请求失败:", error);

        if (axios.isAxiosError(error) && error.response) {
          // 检查后端返回的特定状态码
          if (error.response.status === 409) {
            // 这是我们约定的“用户名已存在”的错误
            ElMessage.error(error.response.data.message || '注册失败：该用户名已被占用');
          } else {
            // 处理其他 HTTP 错误
            ElMessage.error(`注册失败: ${error.response.data.message || '服务器发生错误'}`);
          }
        } else {
          // 处理网络错误等其他问题
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

// goBack 方法无需改动
const goBack = () => {
  router.push({ name: 'Login' });
};
</script>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.el-form h2 {
  text-align: center;
  margin-bottom: 24px;
}
</style>