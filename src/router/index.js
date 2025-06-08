import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/components/HomePage.vue'
import Test from "@/components/test.vue";

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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;