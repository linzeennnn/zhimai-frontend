<template>
  <div class="px-4 py-4">
    <div
      class="fixed right-0 top-15 rounded-full p-3" style="background-color: rgba(237,237,237,0.9);"
      @click="clickFunction"
    >
      功能
    </div>
    <div class="text-bold text-6">
      {{ act?.title }}
    </div>
    <ShowImg :item="act" />
    <div v-for="(value, index) in Object.keys(act)" :key="index">
      <template v-if="value !== 'title'">
        <div class="text-bold mb-2 mt-4 text-5">
          {{ titleObj[value] }}
        </div>
        <div v-if="value === 'start_time' || value === 'end_time'">
          {{ formatTime(act[value]) }}
        </div>
        <div v-else class="text text-4">
          {{ act[value] }}
        </div>
      </template>
    </div>
  </div>
  <!-- 收藏或提醒功能 -->
  <wd-action-sheet v-model="showFunction" lazy-render :actions="functionActions" @select="selectAction" />
  <!-- 授权微信 -->
  <wd-action-sheet v-model="showLogin" lazy-render :actions="loginActions" @select="confirmLogin" />
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { addFavorite, getActivityDetail, removeFavorite } from '../../api/activities'
import { useGlobalToast } from '../../hooks/useGlobalToast'
import { login } from '../../hooks/useLogin'

import { useUserStore } from '../../pinia/store/user'
import { formatTime } from '../../utils/date'
import ShowImg from '../components/ShowImg.vue'

const globalToast = useGlobalToast()
const userStore = useUserStore()

const showFunction = ref<boolean>(false)
const showLogin = ref<boolean>(false)
function clickFunction() {
  if (!judgeLogin())
    return
  showFunction.value = true
}
function judgeLogin() {
  if (userStore.isLogin === false) {
    showLogin.value = true
    return false
  }
  return true
}
const functionActions = ref([
  {
    name: '加入收藏'
  },
  {
    name: '设置定时提醒'
  }
])
const loginActions = [
  {
    name: '授权微信登陆'
  }
]
async function confirmLogin() {
  await login()
  globalToast.success('登录成功')
  userStore.setLoginStatus(true)
}
const activity_id = ref<any>()
const act = ref<any>({})
const titleObj = {
  title: '标题',
  organizer: '主办方',
  location: '活动地点',
  activity_type: '活动类型',
  credit_type: '学分类型',
  status: '活动状态',
  start_time: '开始时间',
  end_time: '结束时间',
  link: '活动链接',
  participation_channel: '参与渠道',
  target_audience: '参与人员'
}
async function selectAction(obj: { item: any, index: number }) {
  const { index } = obj
  if (index === 0) {
    if (act.value.isFavorited) {
      console.log('取消收藏')
      const res = await removeFavorite(activity_id.value)
      console.log('取消收藏结果', res)
      functionActions.value[0].name = '加入收藏'
    } else {
      console.log('加入收藏')
      const res = await addFavorite(activity_id.value)
      console.log('收藏结果', res)
      functionActions.value[0].name = '取消收藏'
    }
  } else if (index === 1) {
    console.log('设置定时提醒')
  }
}

onLoad(async (options: any) => {
  console.log('收到参数:', options)
  if (options.activity_id) {
    activity_id.value = JSON.parse(decodeURIComponent(options.activity_id))
  }
  const res = await getActivityDetail(activity_id.value!)
  act.value = {
    title: res.title,
    organizer: res.organizer,
    location: res.location,
    activity_type: res.activity_type,
    credit_type: res.credit_type,
    status: res.status,
    start_time: res.start_time,
    end_time: res.end_time,
    link: res.link,
    participation_channel: res.participation_channel,
    target_audience: res.target_audience,
    isFavorited: res.isFavorited
  }
  if (act.value.isFavorited) {
    functionActions.value[0].name = '取消收藏'
  }
  console.log('res', res, act.value)
})
</script>

<style lang="scss" scoped>
.text {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}
</style>
