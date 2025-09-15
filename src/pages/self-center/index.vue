<template>
  <div class="flex flex-col items-center">
    <div class="px-5 pt-2" style="width: calc(100% - 80rpx)">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <image
            class="mr-2 h-120rpx w-120rpx border-rounded"
            src="/src/static/self-center/user.png"
          />
          <text>点击登陆</text>
        </div>
        <div>
          <wd-button size="small" type="info">
            编辑资料
          </wd-button>
        </div>
      </div>
    </div>
    <!-- 活动提示 -->
    <wd-popover placement="bottom" use-content-slot>
      <template #content>
        <div class="p-3">
          {{ notice }}
        </div>
      </template>
      <div class="mt-4 h-160rpx w-600rpx flex items-center rounded-3 bg-#EBEBEB px-4">
        <div class="w-10">
          <image
            class="max-h-14 w-10"
            src="/static/self-center/notice.png"
            mode="aspectFit"
          />
        </div>
        <div class="ml-3 flex-grow text-ellipsis text-#f46f17" :style="`opacity: ${noticeOpacity}`">
          {{ notice }}
        </div>
      </div>
    </wd-popover>
    <div class="mt-3 w-650rpx">
      <div class="font-bold">
        服务中心
      </div>
      <div class="mt-3 flex flex-wrap rounded-3 bg-#EBEBEB">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="h-15 w-15 flex flex-col items-center p-2"
          @click="navigateTo(service.path)"
        >
          <image
            class="max-h-10 w-60rpx"
            mode="aspectFit"
            :src="service.img"
          />
          <div class="text-27rpx font-bold">
            {{ service.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 w-650rpx">
      <div class="font-bold">
        更多服务
      </div>
      <div class="mt-3 rounded-3 bg-#EBEBEB">
        <div
          v-for="(service, index) in moreServices"
          :key="index"
          class="flex items-center justify-between p-3"
          @click="navigateTo(service.path)"
        >
          <div class="flex items-center">
            <image
              class="max-h-6 w-6"
              :src="service.img"
              mode="aspectFit"
            />
            <div class="ml-2 text-4 font-bold">
              {{ service.title }}
            </div>
          </div>
          <wd-icon class="w-4" name="arrow-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const globalStore = useGlobalStore()

// 路由跳转
function navigateTo(path: string) {
  console.log('navigateTo', path)
  router.push({ path })
}

// 轮播-活动提醒
const notice = ref<string>('')
const noticeIndex = ref<number>(0)
const noticeOpacity = ref<number>(1)
const noticeList = ref<Array<string>>([
  'tsetest',
  '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
  '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
  '桃之夭夭，灼灼其华。之子于归，宜其室家。桃之夭夭，有蕡其实。之子于归，宜其家室。桃之夭夭，其叶蓁蓁。之子于归，宜其家人。',
  '青青子衿，悠悠我心。纵我不往，子宁不嗣音？青青子佩，悠悠我思。纵我不往，子宁不来？挑兮达兮，在城阙兮。一日不见，如三月兮！'
])

// 服务中心
const services = [
  {
    img: '/static/self-center/history.png',
    title: '浏览历史',
    path: '/subPackage/history/index'
  },
  {
    img: '/static/self-center/collection.png',
    title: '我的收藏',
    path: '/subPackage/collection/index'
  },
  {
    img: '/static/self-center/alarm.png',
    title: '定时提醒',
    path: '/subPackage/remind/index'
  }
]

// 更多服务
const moreServices = [
  {
    img: '/static/self-center/aboutus.png',
    title: '关于我们',
    path: '/subPackage/aboutus/index'
  },
  {
    img: '/static/self-center/help-center.png',
    title: '帮助中心',
    path: '/subPackage/help-center/index'
  },
  {
    img: '/static/self-center/cooperation.png',
    title: '商务合作',
    path: '/subPackage/cooperation/index'
  },
  {
    img: '/static/self-center/account.png',
    title: '账号与安全',
    path: '/subPackage/account/index'
  }
]

onMounted(() => {
  // 初始化提示文字
  notice.value = noticeList.value?.[0] || ''
  // 提示文字
  setInterval(() => {
    noticeOpacity.value = 0
    setTimeout(() => {
      noticeIndex.value++
      if (noticeIndex.value === noticeList.value.length)
        noticeIndex.value = 0
      notice.value = noticeList.value[noticeIndex.value]
      noticeOpacity.value = 1
    }, 500)
  }, 3000)
})
</script>

<style lang="scss" scoped>
.text-ellipsis {
  transition: opacity 0.5s ease;
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  display: -webkit-box;
  /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical;
  /* 设置伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 3;
  /* 限制文本行数，设为3行 */
  word-break: break-all;
  /* 允许在单词内换行:cite[1]:cite[7] */
}
::v-deep .wd-popover__pos {
  width: 500rpx;
}
</style>
