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
        <el-table :data="pagedTableData" v-loading="loading" style="width: 100%" border>
          <el-table-column v-if="userId" label="收藏" width="65" align="center">
            <template #default="{ row }">
              <el-button
                link
                type="warning"
                :icon="isFavorite(row.class_code) ? StarFilled : Star"
                @click="toggleFavorite(row.class_code)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="class_code"   label="课程代码" width="150" />
          <el-table-column prop="class_name"   label="课程名称" width="300" />
          <el-table-column prop="class_time"  label="学时" width="50" />
          <el-table-column prop="class_score" label="学分" width="50" />
          <el-table-column prop="class_begin" label="课程时间" width="100" />
          <el-table-column prop="class_type" label="类型" />
          <el-table-column prop="class_info" label="备注" />
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

// --- 响应式状态定义 ---
const searchCriteria = reactive({ className: "" });
const tableData = ref([]); // 存储所有从后端获取的数据
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

const isFavorite = (classCode) => favoriteIds.value.includes(classCode);

const toggleFavorite = async (classCode) => {
  if (!userId.value) {
    ElMessage.warning('请先登录才能收藏课程');
    return;
  }
  const newFavorites = [...favoriteIds.value];
  const index = newFavorites.indexOf(classCode);
  if (index > -1) {
    newFavorites.splice(index, 1);
  } else {
    newFavorites.push(classCode);
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
  currentPage.value = 1; // 每次搜索都重置到第一页
  try {
    const response = await axios.post('http://127.0.0.1:8080/api/searchscClasses', searchCriteria);
    tableData.value = response.data;
    if (searchCriteria.className !== '') {
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
  searchCriteria.className = '';
  handleSearch();
};

// --- 分页事件处理 ---
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1; // 切换每页条数时，回到第一页
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
/* 样式保持不变 */
</style>