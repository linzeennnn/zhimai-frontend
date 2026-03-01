<template>
  <div class="mb-5 rounded-3 bg-white py-4">
    <!-- 顶部 -->
    <div class="relative mb-3 flex items-center justify-between">
      <!-- 公众号标题 -->
      <div class="flex">
        <ShowHeadImg :url="item.head_img_url" />
        <div class="ml-5 flex items-center text-base text-gray-800 font-bold">
          {{ item.organizer ?? '公众号标题' }}
        </div>
      </div>
    </div>
    <!-- 图片 -->
    <ShowImg :item="item" />
    <div class="text-base text-gray-700 font-bold">
      {{ item.title ?? '活动标题' }}
    </div>
    <div class="text-base text-gray-400">
      {{ formatTime(item.created_at) ?? '活动时间' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '../../utils/date'
import ShowHeadImg from './ShowHeadImg.vue'
import ShowImg from './ShowImg.vue'

const props = defineProps<{
  item: any
  index: number
  isFunction: boolean
}>()

const dropdownIndex = ref<number>(-1)
// 下拉菜单展开/收起
function toggleDropdown(index: number) {
  dropdownIndex.value = dropdownIndex.value === index ? -1 : index
}

// 定时提醒
function onOptionRemind() {

}
// 加入收藏
function onOptionCollection() {

}
</script>
