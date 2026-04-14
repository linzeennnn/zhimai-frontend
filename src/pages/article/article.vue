<template>
  <view class="container">
    <!-- 1. 加载中的提示（加载完成后会自动消失） -->
    <view v-if="loading" class="loading-mask">
      <text>文章加载中...</text>
    </view>

    <!-- 2. 核心组件：web-view -->
    <web-view
      :src="articleUrl"
      @load="onPageLoad"
      @error="onPageError"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 响应式数据
const loading = ref(true)
const articleUrl = ref('')

/*
 小程序页面生命周期：onLoad
  专门用来接收上个页面传来的参数 (options)
 */
function onLoad(options: { url?: string }) {
  // 1. 检查有没有传 url
  if (options.url) {
    // 多次解码，直到完全还原
    let decodedUrl = options.url
    while (decodedUrl.includes('%')) {
      try {
        decodedUrl = decodeURIComponent(decodedUrl)
      } catch (e) {
        break
      }
    }
    articleUrl.value = decodedUrl
  } else {
    // 如果没有传链接，给个提示（调试用）
    console.error('没有接收到文章链接！')
    uni.showToast({ title: '缺少链接参数', icon: 'none' })
    loading.value = false
  }
}

/*
  网页加载成功的回调
 */
function onPageLoad() {
  console.log('文章页面加载成功')
  loading.value = false // 隐藏“加载中”
}

/*
  网页加载失败的回调
 */
function onPageError(err: any) {
  console.error('文章加载失败', err)
  loading.value = false
  uni.showToast({ title: '文章加载失败', icon: 'none' })
}
</script>

<style scoped>
/*简单的样式，让“加载中”居中 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
