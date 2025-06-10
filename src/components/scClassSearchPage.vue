<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-form :model="searchCriteria" inline>
          <el-row :gutter="10" justify="start" align="middle">
            <el-col :span="4">
              <el-form-item label="课程名称">
                <el-input v-model="searchCriteria.className" placeholder="输入课程名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-button type="primary" @click="handleSearch">搜索</el-button>
                <el-button @click="resetSearch">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-header>

      <el-main>
        <el-table :data="tableData" v-loading="loading" style="width: 100%" border height="600">
          <el-table-column prop="class_code"   label="课程代码" width="150" />
          <el-table-column prop="class_name"   label="课程名称" width="250" />
          <el-table-column prop="class_time"  label="学时" width="50" />
          <el-table-column prop="class_score" label="学分" width="50" />
          <el-table-column prop="class_begin" label="课程时间" width="100" />
          <el-table-column prop="class_type" label="类型" />
          <el-table-column prop="class_info" label="备注" />
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';

// --- 响应式状态定义 ---

// 用于绑定搜索表单的数据
// 这里的字段名需要和后端 ClassSearchCriteria 类中的字段名完全一致
const searchCriteria = reactive({
  classCode: "",
  className: "",
  classTime: "",
  classScore: "",
  classBegin: "",
  classType: "",
  classInfo: "",
});

// 用于存储从后端获取的表格数据
const tableData = ref([]);

// 控制表格加载状态的显示
const loading = ref(false);

// --- 方法定义 ---

// 处理搜索按钮点击事件
const handleSearch = async () => {
  loading.value = true; // 开始搜索，显示加载状态
  try {
    // 使用 axios 发送 POST 请求
    const response = await axios.post('http://127.0.0.1:8080/api/searchscClasses', searchCriteria);
    tableData.value = response.data; // 将返回的数据赋值给表格数据源
    ElMessage({
      message: '查询成功!',
      type: 'success',
    });
  } catch (error) {
    console.error("搜索请求失败:", error);
    ElMessage({
      message: '查询失败，请检查网络或联系管理员。',
      type: 'error',
    });
  } finally {
    loading.value = false; // 搜索结束，隐藏加载状态
  }
};

// 重置搜索条件
const resetSearch = () => {
  // 遍历清空 searchCriteria 对象的所有字段
  for (const key in searchCriteria) {
    searchCriteria[key] = '';
  }
  // 重新加载所有数据
  handleSearch();
};


// --- 生命周期钩子 ---

// onMounted 会在组件挂载到页面后执行
onMounted(() => {
  // 页面初始化时，调用一次搜索方法获取所有数据
  // 因为 searchCriteria 是空的，后端会返回所有课程
  handleSearch();
});
</script>

<style>
/* 可以在这里添加或修改样式 */
.el-header {
  padding-top: 20px;
  height: auto;
  border-bottom: 1px solid #dcdfe6;
}

.el-main {
  padding-top: 20px;
}

.el-form-item {
  margin-bottom: 0; /* 移除表单项的下边距，使搜索栏更紧凑 */
}
</style>