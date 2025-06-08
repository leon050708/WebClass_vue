import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomePage.vue'
import Test from "@/components/test.vue";
import Login from "@/components/LoginForm.vue"

const routes = [
    {
        path: '/',
        component: HomePage,
        children: []
    },
    {
        path: '/test',
        component: Test,
        children: []
    },
    {
        path: '/login',
        component: Login,
        children: []
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;