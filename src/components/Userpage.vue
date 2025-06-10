<template>
  <div style="padding: 20px;">
    <h1>个人中心</h1>
    <p v-if="userId">当前登录的用户ID是: <strong>{{ userId }}</strong></p>
    <p>这里可以展示该用户的详细信息、设置等。</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = ref('');

onMounted(() => {
  // 从URL参数中获取用户ID
  userId.value = route.params.id;
});
</script>