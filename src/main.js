import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'


const app = createApp(App)

app.use(ElementPlus, { size: 'small', zIndex: 3000})
app.use(router); // 使用路由
app.mount('#app')