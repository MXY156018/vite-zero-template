import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style/element_visiable.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入封装的router
import router from '@/router/index'
import auth from '@/directive/auth'
import '@/permission'
import { store } from '@/store/index'

import App from './App.vue'
const app = createApp(App)
app.use(auth)
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn }).mount('#app')
