<!-- 活动/信息列表 -->
<!-- 使用wd-loadmore编译会出现app.wxss报错问题，直接删除报错部分即可正常运行 -->
<template>
  <scroll-view>
    <div v-for="(item, index) in activities" :key="item.activity_id" class="mb-5 rounded-3 bg-white px-3 py-4">
      <!-- 顶部 -->
      <div class="relative mb-3 flex items-center justify-between">
        <!-- 公众号标题 -->
        <div class="flex">
          <ShowHeadImg />
          <div class="ml-5 flex items-center text-base text-gray-800 font-bold">
            {{ item.organizer ?? '暂无标题' }}
          </div>
        </div>
        <!-- 功能按钮 -->
        <div class="relative">
          <div
            class="cursor-pointer rounded bg-gray-100 px-2 py-1 text-gray-500 hover:bg-gray-300"
            @click.stop="toggleDropdown(index)"
          >
            功能 ﹀
          </div>
          <div v-if="dropdownIndex === index" class="absolute right-0 z-10 mt-2 w-24 rounded-lg bg-white shadow">
            <div class="cursor-pointer rounded px-3 py-2 hover:bg-gray-300" @click="onOptionRemind(item)">
              定时提醒
            </div>
            <div class="cursor-pointer rounded px-3 py-2 hover:bg-gray-300" @click="onOptionCollect(item.activity_id)">
              加入收藏
            </div>
          </div>
        </div>
      </div>
      <!-- 图片 -->
      <ShowImg :item="item" />
      <div class="mb-1 text-base text-gray-700 font-bold">
        {{ item.title ?? '活动标题' }}
      </div>
      <div class="text-base text-gray-400">
        {{ formatTime(item.created_at) ?? '活动时间' }}
      </div>
    </div>
  </scroll-view>
  <wd-loadmore :state="state" finished-text="触碰到我的底线啦~" @reload="loadmore" />
</template>

<script setup lang="ts">
import type { LoadMoreState } from 'wot-design-uni/components/wd-loadmore/types'
import { onReachBottom } from '@dcloudio/uni-app'
import { getActivities } from '@/api/activities'
import { formatTime } from '@/utils/date'
import ShowHeadImg from '../../components/ShowHeadImg.vue'
import ShowImg from '../../components/ShowImg.vue'

const keyword = ref<string>('')
const dropdownIndex = ref(-1)
const activities = ref<Array<any>>([])
// 下拉菜单展开/收起
function toggleDropdown(index: number) {
  dropdownIndex.value = dropdownIndex.value === index ? -1 : index
}
// 定时提醒
function onOptionRemind() {

}
// 加入收藏
function onOptionCollect() {

}

// 列表加载状态
const state = ref<LoadMoreState | undefined>('loading')
// 列表最大数量（接口联调，可能会没有最大数量，通过请求返回的列表数量判断）
const max = ref<number>(16)

onReachBottom(() => {
  console.log('onReachBottom')
  if (activities.value.length < max.value) {
    loadmore()
  } else if (activities.value.length === max.value) {
    state.value = 'finished'
  }
})
const page = ref<number>(1)
async function loadmore() {
  state.value = 'loading'
  getSearchActs(++page.value)
}

async function getSearchActs(page = 1) {
  const res = await getActivities({ page, keyword: keyword.value })
  console.log('res', res)
  if (page === 1) {
    activities.value = res.data as any
  } else {
    activities.value = activities.value.concat(res.data as any)
  }
  max.value = res.total as number
  if (activities.value.length >= max.value) {
    state.value = 'finished'
  }
}

function resetSearch(content = '') {
  keyword.value = content
  page.value = 1
  getSearchActs()
}

defineExpose({
  resetSearch
})
</script>
