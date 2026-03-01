import { createSSRApp } from 'vue'
import App from './App.vue'
import { initNetwork } from './hooks/useNetwork'
import pinia from './pinia'
import initStore from './pinia/init'
import router from './router'
import 'core-js/actual/array/iterator'
import 'core-js/actual/promise'
import 'core-js/actual/object/assign'
import 'core-js/actual/promise/finally'
import 'uno.css'

// 全局使用pinia
export function createApp() {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia).use(router)
  // 初始化仓库
  initStore()
  // 检查网络状态
  initNetwork()
  return {
    app,
    pinia
  }
}
