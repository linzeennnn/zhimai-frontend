<template>
  <scroll-view style="height: 100vh;" class="bg-gray-50 pb-safe" scroll-y @scroll="onScroll">
    <!-- 顶部 -->
    <view class="mb-2 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow">
      <!-- 分类筛选自定义下拉 -->
      <view class="relative">
        <view class="classify-btn" @click="toggleClassifyDropdown">
          <text class="text-base text-primary font-bold">
            分类筛选
          </text>
          <text class="text-xs text-gray-400">
            ﹀
          </text>
        </view>
        <view v-if="showClassifyDropdown" class="absolute left-0 z-10 mt-2 w-32 rounded-lg bg-white shadow">
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'all' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('all')"
          >
            全部
          </view>
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'info' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('信息资讯')"
          >
            信息资讯
          </view>
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'activity' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('二课综测')"
          >
            二课综测
          </view>
          <view
            class="flex cursor-pointer items-center gap-1 rounded px-4 py-2 text-left text-base text-gray-600 transition hover:underline"
            @click="onClassifyMore"
          >
            更多
          </view>
        </view>
      </view>
      <!-- 跳转"搜索页面" -->
      <wd-icon name="search" size="35rpx" @click="navigateTo('/pages/search-page/index')" />
    </view>
    <!-- 置顶通知 -->
    <view class="mb-2">
      <view class="mb-2 rounded-lg bg-gray-200 py-4 text-center text-lg text-gray-700 font-bold">
        重要常驻通知
      </view>
      <swiper class="mt-4 rounded-lg" indicator-dots>
        <swiper-item v-for="outIndex in Math.ceil(swiper.length / 3)" :key="outIndex">
          <view class="grid grid-cols-3 gap-2">
            <view
              v-for="inIndex in 3" :key="inIndex"
              class="rounded-lg bg-gray-200 py-4 text-center text-base text-gray-600 shadow"
            >
              {{ swiper[(outIndex - 1) * 3 + (inIndex - 1)] }}
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="info-list">
      <view class="space-y-4">
        <view
          v-for="(item, index) in activities"
          :key="item.activity_id"
          class="rounded-lg bg-white p-4 shadow"
          @click="navigateTo('/pages/act-detail/index', { activity_id: item.activity_id })"
        >
          <view class="mb-2 flex items-center justify-between">
            <view class="flex items-center gap-2">
              <ShowHeadImg />
              <text class="text-base text-gray-800 font-bold">
                {{ item.organizer ?? '公众号标题' }}
              </text>
            </view>
            <view class="relative">
              <view
                class="cursor-pointer rounded bg-gray-100 px-2 py-1 text-gray-500 hover:bg-gray-300"
                @click.stop="toggleDropdown(index)"
              >
                功能 ﹀
              </view>
              <view v-if="dropdownIndex === index" class="absolute right-0 z-10 mt-2 w-24 rounded-lg bg-white shadow">
                <view
                  class="cursor-pointer rounded px-3 py-2 hover:bg-gray-300"
                  @click.stop="setReminder(item)"
                >
                  定时提醒
                </view>
                <view
                  class="cursor-pointer rounded px-3 py-2 hover:bg-gray-300"
                  @click.stop="onOptionCollect(item.activity_id)"
                >
                  {{ item.isFavorited ? '取消收藏' : '加入收藏' }}
                </view>
              </view>
            </view>
          </view>
          <ShowImg :item="item" />
          <view class="mb-1 text-base text-gray-700 font-bold">
            {{ item.title ?? '活动标题' }}
          </view>
          <view class="text-xs text-gray-400">
            {{ formatTime(item.created_at) ?? '活动时间' }}
          </view>
        </view>
      </view>
      <!-- 到达底部 -->
      <view v-if="activitiesLoading" hover-class="none">
        加载中...
      </view>
      <view v-else class="py-6 text-center text-gray-400">
        触碰到我的底线了~
      </view>
    </view>
    <!-- 回到顶部按钮 -->
    <!-- <view id="to-top" class="fixed bottom-16 right-4 z-50" bindtap="backTop" wx:if="{{isTop}}">
      <view class="h-10 w-10 flex cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/80">
        ↑
      </view>
    </view> -->
  </scroll-view>
  <!-- 授权微信操作操作 -->
  <wd-action-sheet v-model="showLogin" :actions="actions" @close="showLogin = false" @select="confirmLogin" />

  <!-- 自定义提醒弹窗 -->
  <wd-popup v-model="showNoticePopup" position="center" round closeable custom-style="width: 85%; max-width: 600rpx; padding: 0; overflow: hidden;">
    <view class="custom-notice-box">
      <view class="notice-header flex items-center rounded-t-lg bg-orange-50 p-4">
        <wd-icon name="warn" size="24px" color="#ed7b2f" custom-class="mr-2" />
        <text class="text-base text-gray-800 font-bold">
          您有事项即将截止
        </text>
      </view>
      <view class="notice-content max-h-60 overflow-y-auto p-4 text-sm text-gray-600">
        <text class="mb-2 block">
          您已订阅提醒的事项，剩余时长不足24小时，请尽快处理：
        </text>
        <view v-for="(item, index) in urgentList" :key="index" class="mb-2 flex items-start">
          <wd-icon name="check-circle-fill" size="18px" color="#ed7b2f" custom-class="mt-1 mr-2" />
          <view class="flex-1">
            <text class="text-gray-800 font-medium">
              {{ item.title }}
            </text>
            <text class="ml-2 text-gray-500">
              截止：{{ item.endTime }}
            </text>
          </view>
        </view>
        <view v-if="urgentList.length === 0" class="text-center text-gray-400">
          暂无即将截止的事项
        </view>
      </view>
      <view class="flex border-t border-gray-100">
        <view class="flex-1 bg-gray-50 py-3 text-center text-gray-600 active:bg-gray-100" @click="showNoticePopup = false">
          稍后提醒
        </view>
        <view class="flex-1 bg-blue-500 py-3 text-center text-white active:bg-blue-600" @click="goToRemindPage">
          查看详情
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
// 快到底部提前加载
import type { ActivityDetail } from '@/api/activities'
import { debounce } from 'wot-design-uni/components/common/util'
import { addFavorite, getActivities } from '@/api/activities'
import Appconfig from '@/config'
import { useGlobalToast } from '@/hooks/useGlobalToast'
import { login } from '@/hooks/useLogin'
// import { onPageScroll } from '@dcloudio/uni-app'
// import { onMounted, ref } from 'vue'
import ShowHeadImg from '@/pages/components/ShowHeadImg.vue'
import ShowImg from '@/pages/components/ShowImg.vue'
import { useCategoryStore } from '@/pinia/store/category'
import { useUserStore } from '@/pinia/store/user'
import { formatTime } from '@/utils/date'

const categoryStore = useCategoryStore()
const classify = ref<any>({})

const userStore = useUserStore()
const pageSize = Appconfig.pageSize
const globalToast = useGlobalToast()

// 登陆抽屉显示
const showLogin = ref<boolean>(false)
// 弹窗相关
const showNoticePopup = ref(false)
const urgentList = ref([
  { title: '互联网+大赛报名', endTime: '今日 23:59' },
  { title: '奖学金申请提交', endTime: '明日 12:00' }
])
const actions = [
  {
    name: '授权微信登陆'
  }
]
async function confirmLogin() {
  await login()
  globalToast.success('登录成功')
  userStore.setLoginStatus(true)
}
function judgeLogin() {
  if (userStore.isLogin === false) {
    showLogin.value = true
    return false
  }
  return true
}

const showClassifyDropdown = ref(false)
const classifyType = ref('all')

const swiper = ref(['校园跑通知', '四六级考试', '装修通知', '放假通知', '停水通知', '停电通知'])
const activities = ref<ActivityDetail[]>([])
const activitiesPage = ref(1)
const activitiesPageSize = ref(pageSize)
const totalActivities = ref(0)
const activitiesLoading = ref(false)
const dropdownIndex = ref(-1)

// 分类筛选下拉显示/隐藏
function toggleClassifyDropdown() {
  showClassifyDropdown.value = !showClassifyDropdown.value
}

// 分类选项点击，前三项重新查询
function onClassifySelect(type: string) {
  classifyType.value = type
  showClassifyDropdown.value = false
  uni.showToast({
    title: `筛选${type}`,
    icon: 'success',
    duration: 800
  })
  // 这里可根据 type 重新请求 activities 数据
}

// 点击“更多”跳转
function onClassifyMore() {
  showClassifyDropdown.value = false
  uni.navigateTo({
    url: '/subPackages/category/index'
  })
}

// 下拉菜单展开/收起
function toggleDropdown(index: number) {
  dropdownIndex.value = dropdownIndex.value === index ? -1 : index
}

function onOptionRemind(item: any) {
  console.log('onOptionRemind 被调用了', item)
  if (!judgeLogin())
    return

  // 保存提醒时间到本地存储
  const remindTime = new Date(item.end_time).getTime()
  uni.setStorageSync('noticeTime', remindTime)

  // 弹出提示框
  uni.showModal({
    title: '定时提醒',
    content: '已设置提醒，将在活动开始前通知您',
    showCancel: false,
    success: () => {
      console.log('提醒已设置')
    }
  })

  // 可选：仍然跳转到日历页面
  // const info = {
  //   activity_id: item.activity_id,
  //   start_time: item.start_time,
  //   end_time: item.end_time,
  //   title: item.title
  // }
  // navigateTo('/subPackages/remind/index', info)
}

async function onOptionCollect(activity_id: number) {
  if (!judgeLogin())
    return
  const res = await addFavorite(activity_id)
  console.log('收藏结果', res)
  dropdownIndex.value = -1
}
// 设置提醒
function setReminder(item: any) {
  if (!judgeLogin())
    return
  // 临时：改成 1 分钟后提醒
  const remindTime = Date.now() + 60 * 1000 // 1分钟 = 60000 毫秒
  uni.setStorageSync('noticeTime', remindTime)

  uni.showModal({
    title: '定时提醒',
    content: '已设置提醒，将在活动开始前通知您',
    showCancel: false
  })
}
// 检查提醒弹窗
function checkUrgentNotices() {
  try {
    const noticeTime = uni.getStorageSync('noticeTime')

    if (!noticeTime) {
      if (urgentList.value.length === 0) {
        urgentList.value = [
          { title: '互联网+大赛报名', endTime: '今日 23:59' },
          { title: '奖学金申请提交', endTime: '明日 12:00' }
        ]
      }
      return
    }

    const currentTime = Date.now()
    const timeDiff = noticeTime - currentTime
    const ONE_DAY = 24 * 60 * 60 * 1000

    if (timeDiff > 0 && timeDiff <= ONE_DAY) {
      const remainingHours = Math.ceil(timeDiff / (60 * 60 * 1000))
      urgentList.value = [{
        title: '您设置的活动提醒',
        endTime: `${remainingHours}小时后`
      }]
      showNoticePopup.value = true
      return
    }

    if (timeDiff <= 0) {
      uni.removeStorageSync('noticeTime')
      urgentList.value = [
        { title: '互联网+大赛报名', endTime: '今日 23:59' },
        { title: '奖学金申请提交', endTime: '明日 12:00' }
      ]
    }
  } catch (error) {
    console.error('检查提醒失败', error)
  }
}

// 跳转到提醒页面
function goToRemindPage() {
  showNoticePopup.value = false
  uni.navigateTo({
    url: '/subPackages/remind/index'
  })
}
const onScroll = debounce((e: any) => {
  // 兼容微信小程序 scrollHeight/clientHeight 获取不到的问题
  // 只用 scrollTop 判断，快到底部时触发
  const threshold = 200
  const scrollTop = e.detail.scrollTop
  // 理论最大高度（页面内容高度），可用 activities.length * 单卡片高度 + 其它区域高度
  // 这里假设每个活动卡片高度约 160px，顶部+通知区约 200px
  const estimateHeight = activities.value.length * 160 + 200
  // 如果 scrollTop + 可视区高度（100vh=windowHeight）接近内容总高度，则加载
  const windowHeight = uni.getWindowInfo().windowHeight
  if (scrollTop + windowHeight + threshold >= estimateHeight) {
    loadMoreActivities()
  }
  // 调试输出
  // console.log('scrollTop:', scrollTop, 'windowHeight:', windowHeight, 'estimateHeight:', estimateHeight)
}, 500)

// 生命周期
async function fetchActivities(page = 1) {
  if (activitiesLoading.value)
    return
  activitiesLoading.value = true
  try {
    const res = await getActivities({ page, ...classify.value })
    if (page === 1) {
      activities.value = res.data as any
    } else {
      activities.value = activities.value.concat(res.data as any)
    }
    totalActivities.value = res.total
    activitiesPage.value = page
  } catch (err) {
    uni.showToast({ title: '活动获取失败', icon: 'none' })
  } finally {
    activitiesLoading.value = false
  }
}

onShow(() => {
  checkUrgentNotices()
  if (categoryStore.menu.length) {
    classify.value = {}
    categoryStore.menu.forEach((item: any) => {
      if (item.choosenum === 0)
        return
      const list: any[] = []
      item.choose.forEach((isChoose: boolean, index: number) => {
        if (!isChoose)
          return
        list.push(item.list[index])
      })
      classify.value[item.type] = list
    })
    console.log('test', classify.value)
  }
  fetchActivities(1)
})

function loadMoreActivities() {
  console.log('load more activities')
  if (activitiesLoading.value)
    return
  if (activitiesPage.value * activitiesPageSize.value < totalActivities.value) {
    fetchActivities(activitiesPage.value + 1)
  }
}
// 路由跳转
function navigateTo(url: string, params?: any) {
  console.log('navigateTo', url, params)
  if (!params) {
    uni.navigateTo({ url })
  } else {
    const keys = Object.keys(params).map((key) => {
      return `${key}=${encodeURIComponent(JSON.stringify(params[key]))}`
    }).join('&')
    uni.navigateTo({
      url: `${url}?${keys}`
    })
  }
}
/*
接收参数页面：
onLoad(options) {
  if (options.user) {
    const user = JSON.parse(decodeURIComponent(options.user));
    console.log("接收到对象：", user);
  }
}
*/
</script>

<style lang="scss" scoped>
::v-deep swiper {
  height: 180rpx;
}
</style>
