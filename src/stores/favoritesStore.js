import { reactive, toRefs } from 'vue';
import axios from 'axios';

// 定义一个响应式的状态对象
const state = reactive({
    favoriteIds: [],
});

/**
 * 从后端获取最新的收藏列表并更新到全局状态
 */
const fetchFavorites = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        state.favoriteIds = []; // 未登录，清空列表
        return;
    }
    try {
        const response = await axios.get(`http://127.0.0.1:8080/api/user/${userId}/stars`);
        state.favoriteIds = response.data || [];
    } catch (error) {
        console.error("从Store获取收藏夹失败:", error);
        state.favoriteIds = []; // 出错时清空，避免脏数据
    }
};

/**
 * 更新收藏列表到后端
 * @param {string[]} newFavoriteIds - 最新的收藏课程ID数组
 */
const updateFavorites = async (newFavoriteIds) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const oldFavoriteIds = [...state.favoriteIds];
    state.favoriteIds = [...newFavoriteIds]; // 立即更新UI（乐观更新）

    try {
        const newStars = newFavoriteIds.join(',');
        await axios.post(`http://127.0.0.1:8080/api/user/${userId}/stars`, { stars: newStars });
    } catch (error) {
        console.error("从Store更新收藏夹失败:", error);
        state.favoriteIds = oldFavoriteIds; // 如果后端更新失败，则回滚UI
        throw error; // 将错误抛出，以便组件可以提示用户
    }
};

/**
 * 清空本地收藏夹状态（用于退出登录）
 */
const clearFavorites = () => {
    state.favoriteIds = [];
};

// 导出一个组合式函数，供所有组件使用
export function useFavorites() {
    return {
        ...toRefs(state),
        fetchFavorites,
        updateFavorites,
        clearFavorites,
    };
}