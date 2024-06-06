import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'nprogress/nprogress.css' // 这个样式必须引入
import 'element-plus/theme-chalk/dark/css-vars.css'
// import './styles/dark/css-vars.css'

import './style.css'
const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')