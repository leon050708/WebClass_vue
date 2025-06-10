<template>
  <div class="favorites-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ pageTitle }}</span>
        </div>
      </template>

      <el-table v-if="totalItems > 0" :data="pagedFavoritedCourses" v-loading="loading" style="width: 100%" border>
        <template v-if="courseType === 'humanities'">
          <el-table-column prop="class_num" label="课程号" width="120" />
          <el-table-column prop="class_code" label="课程代码" width="150" />
          <el-table-column prop="class_name" label="课程名称" width="250" />
          <el-table-column prop="class_place" label="上课地点" width="120" />
          <el-table-column prop="class_type" label="课程类型" />
        </template>
        <template v-if="courseType === 'planned'">
          <el-table-column prop="class_code"   label="课程代码" width="150" />
          <el-table-column prop="class_name"   label="课程名称" width="250" />
          <el-table-column prop="class_time"  label="学时" width="50" />
          <el-table-column prop="class_score" label="学分" width="50" />
          <el-table-column prop="class_begin" label="课程时间" width="100" />
          <el-table-column prop="class_type" label="类型" />
          <el-table-column prop="class_info" label="备注" />
        </template>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" :icon="Delete" @click="removeFromFavorites(row)" circle />
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!loading && totalItems === 0" description="您还没有收藏任何课程"></el-empty>

      <div v-if="totalItems > 0" style="display: flex; justify-content: flex-end; padding-top: 20px;">
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 15, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, defineProps, watch } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useFavorites } from '@/stores/favoritesStore';

const props = defineProps({
  courseType: {
    type: String,
    required: true,
  },
});

// --- State ---
const loading = ref(false);
const allCourses = ref([]);
const userId = ref(null);
const router = useRouter();
const { favoriteIds, fetchFavorites, updateFavorites } = useFavorites();

// --- 分页状态 ---
const currentPage = ref(1);
const pageSize = ref(10);

// --- 计算属性 ---
const pageTitle = computed(() => {
  return props.courseType === 'humanities' ? '我的人文选修收藏' : '我的计划内课程收藏';
});

const favoritedCourses = computed(() => {
  const idKey = props.courseType === 'humanities' ? 'class_num' : 'class_code';
  return allCourses.value.filter(course => favoriteIds.value.includes(course[idKey]));
});

const totalItems = computed(() => favoritedCourses.value.length);

const pagedFavoritedCourses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return favoritedCourses.value.slice(start, end);
});

const apiUrl = computed(() => {
  return props.courseType === 'humanities'
      ? 'http://127.0.0.1:8080/api/searchClasses'
      : 'http://127.0.0.1:8080/api/searchscClasses';
});

// --- 侦听器，防止删除最后一页数据时页面空白 ---
watch(totalItems, (newTotal) => {
  const maxPage = Math.ceil(newTotal / pageSize.value) || 1;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});

// --- 方法 ---
const fetchData = async () => {
  loading.value = true;
  try {
    const coursesResponse = await axios.post(apiUrl.value, {});
    allCourses.value = coursesResponse.data;
    await fetchFavorites();
  } catch (error) {
    console.error("加载数据失败:", error);
    ElMessage.error('加载收藏失败，请稍后再试。');
  } finally {
    loading.value = false;
  }
};

const removeFromFavorites = async (course) => {
  const idKey = props.courseType === 'humanities' ? 'class_num' : 'class_code';
  const courseId = course[idKey];

  ElMessageBox.confirm(
      `您确定要取消收藏课程《${course.class_name}》吗?`, '提示',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(async () => {
    const newFavorites = favoriteIds.value.filter(id => id !== courseId);
    try {
      await updateFavorites(newFavorites);
      ElMessage.success('已取消收藏');
    } catch (error) {
      ElMessage.error('操作失败，请重试。');
    }
  }).catch(() => { /* User cancelled */ });
};

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
  if (userId.value) {
    fetchData();
  } else {
    ElMessage.warning('请先登录以查看收藏');
    router.push('/login');
  }
});
</script>

<style scoped>
.card-header {
  font-weight: bold;
  font-size: 1.2em;
}
</style>