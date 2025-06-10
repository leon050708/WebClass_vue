<template>
  <div class="test-container">
    <h1>测试页面</h1>
    <p>这个页面接收了来自路由的参数。</p>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>接收到的信息</span>
        </div>
      </template>
      <div class="text item">
        <strong>传入的整数 (AInt):</strong> {{ AInt }} (类型: {{ typeof AInt }})
      </div>
      <div class="text item">
        <strong>传入的字符串 (AString):</strong> {{ AString }} (类型: {{ typeof AString }})
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 使用 defineProps 定义组件期望接收的 props
// 因为路由参数总是字符串，我们需要用 Number 构造函数来转换类型
const props = defineProps({
  AInt: {
    type: Number, // 将接收到的字符串参数转换为数字
    required: true
  },
  AString: {
    type: String,
    required: true
  }
});

// 在模板中，你可以直接使用 myInt 和 myString
</script>

<style scoped>
.test-container {
  padding: 20px;
}
.text {
  font-size: 16px;
}
.item {
  margin-bottom: 18px;
}
.box-card {
  width: 480px;
  margin-top: 20px;
}
</style>