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
              <el-form-item label="课程号">
                <el-input v-model="searchCriteria.classNum" placeholder="输入课程号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="课程代码">
                <el-input v-model="searchCriteria.classCode" placeholder="输入课程代码" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="上课地点">
                <el-input v-model="searchCriteria.classPlace" placeholder="输入上课地点" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="课程类型">
                <el-input v-model="searchCriteria.classType" placeholder="输入课程类型" clearable />
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
        <el-table :data="pagedTableData" v-loading="loading" style="width: 100%" border>
          <el-table-column v-if="userId" label="收藏" width="65" align="center">
            <template #default="{ row }">
              <el-button
                  link
                  type="warning"
                  :icon="isFavorite(row.class_num) ? StarFilled : Star"
                  @click="toggleFavorite(row.class_num)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="class_num" label="课程号" width="120" />
          <el-table-column prop="class_code" label="课程代码" width="150" />
          <el-table-column prop="class_name" label="课程名称" width="250" />
          <el-table-column prop="class_place" label="上课地点" width="120" />
          <el-table-column prop="class_type" label="课程类型" />
        </el-table>
      </el-main>

      <el-footer style="display: flex; justify-content: flex-end; padding-top: 20px;">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 15, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue';
import { useFavorites } from '@/stores/favoritesStore';

// --- 响应式状态 ---
// 恢复了所有搜索条件
const searchCriteria = reactive({
  className: '',
  classNum: '',
  classCode: '',
  classPlace: '',
  classType: ''
});
const tableData = ref([]);
const loading = ref(false);
const userId = ref(null);

// --- 分页状态 ---
const currentPage = ref(1);
const pageSize = ref(15);
const totalItems = computed(() => tableData.value.length);

// --- 计算属性，用于获取当前页的数据 ---
const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// --- Store 和收藏逻辑 ---
const { favoriteIds, fetchFavorites, updateFavorites } = useFavorites();

const isFavorite = (classNum) => favoriteIds.value.includes(classNum);

const toggleFavorite = async (classNum) => {
  if (!userId.value) {
    ElMessage.warning('请先登录才能收藏课程');
    return;
  }
  const newFavorites = [...favoriteIds.value];
  const index = newFavorites.indexOf(classNum);
  if (index > -1) {
    newFavorites.splice(index, 1);
  } else {
    newFavorites.push(classNum);
  }
  try {
    await updateFavorites(newFavorites);
    ElMessage.success(index > -1 ? '已取消收藏' : '已收藏');
  } catch (error) {
    ElMessage.error('操作失败，请重试');
  }
};

// --- 方法定义 ---
const handleSearch = async () => {
  loading.value = true;
  currentPage.value = 1;
  try {
    const response = await axios.post('http://127.0.0.1:8080/api/searchClasses', searchCriteria);
    tableData.value = response.data;
    const isInitialLoad = Object.values(searchCriteria).every(val => val === '');
    if (!isInitialLoad) {
      ElMessage.success('查询成功!');
    }
  } catch (error) {
    console.error("搜索请求失败:", error);
    ElMessage.error('查询失败，请检查网络或联系管理员。');
  } finally {
    loading.value = false;
  }
};

const resetSearch = () => {
  for (const key in searchCriteria) {
    searchCriteria[key] = '';
  }
  handleSearch();
};

// --- 分页事件处理 ---
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// --- 生命周期钩子 ---
onMounted(() => {
  userId.value = localStorage.getItem('userId');
  handleSearch();
  if (userId.value) {
    fetchFavorites();
  }
});
</script>

<style>
.el-header {
  padding-top: 20px;
  height: auto;
  border-bottom: 1px solid #dcdfe6;
}
.el-main {
  padding-top: 20px;
}
.el-form-item {
  margin-bottom: 1rem; /* 增加一点间距以容纳多行 */
}
.el-button.is-link {
  font-size: 20px;
}
</style>