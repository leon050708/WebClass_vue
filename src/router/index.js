import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/components/HomePage.vue';
import LoginForm from '@/components/LoginForm.vue';
import Test from "@/components/test.vue";
import Welcome from "@/components/Welcome.vue";
import UserPage from "@/components/UserPage.vue";
import ClassPage from "@/components/ClassSearchPage.vue"
import scClassPage from "@/components/scClassSearchPage.vue"
import RegistPage from "@/components/RegistPage.vue";
const routes = [
    {
        path: '/',
        component: HomePage,
        children: [
            { path: '', name: 'Welcome', component: Welcome },
            { path: 'user/:id', name: 'UserPage', component: UserPage },
            { path: 'class', name: 'ClassPage', component: ClassPage },
            { path: 'scclass', name: 'scClassPage', component: scClassPage },
            { path: 'test/:AInt/:AString', name: 'Test', component: Test, props: true },
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

export default router;