import { createRouter, createWebHistory } from 'vue-router';
import { ElMessage } from 'element-plus';

import HomePage from '@/components/HomePage.vue';
import LoginForm from '@/components/LoginForm.vue';
import Welcome from "@/components/Welcome.vue";
import UserPage from "@/components/UserPage.vue";
import ClassPage from "@/components/ClassSearchPage.vue"
import scClassPage from "@/components/scClassSearchPage.vue"
import RegistPage from "@/components/RegistPage.vue";
import FavoritesPage from "@/components/FavoritesPage.vue"; // 导入新组件

const routes = [
    {
        path: '/',
        component: HomePage,
        children: [
            { path: '', name: 'Welcome', component: Welcome },
            { path: 'user/:id/:name', name: 'UserPage', component: UserPage, props: true },
            { path: 'class', name: 'ClassPage', component: ClassPage },
            { path: 'scclass', name: 'scClassPage', component: scClassPage },
            // 将 'test' 路由替换为新的 'favorites' 路由
            {
                path: 'favorites/humanities',
                name: 'HumanitiesFavorites',
                component: FavoritesPage,
                props: { courseType: 'humanities' }
            },
            {
                path: 'favorites/planned',
                name: 'PlannedFavorites',
                component: FavoritesPage,
                props: { courseType: 'planned' }
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginForm,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegistPage,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 添加路由守卫，保护收藏页面
router.beforeEach((to, from, next) => {
    const favoriteRoutes = ['HumanitiesFavorites', 'PlannedFavorites'];
    if (favoriteRoutes.includes(to.name) && !localStorage.getItem('userId')) {
        ElMessage.warning('请先登录再访问收藏页面');
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;