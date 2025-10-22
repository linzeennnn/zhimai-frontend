<template>
  <div class="mb-5 rounded-3 bg-white px-3 py-4">
    <!-- 顶部 -->
    <div class="relative mb-3 flex items-center justify-between">
      <!-- 公众号标题 -->
      <div class="flex">
        <ShowHeadImg :url="item.head_img_url" />
        <div class="ml-5 flex items-center text-base text-gray-800 font-bold">
          {{ item.organizer ?? '暂无标题' }}
        </div>
      </div>
      <!-- 功能按钮 -->
      <div v-if="isFunction" class="absolute right-3 top-1 w-22 text-gray-500">
        <div
          class="flex cursor-pointer justify-evenly rounded-md bg-gray-100 px-3 py-2"
          @click.stop="toggleDropdown(index)"
        >
          功能
          <wd-icon v-if="index === dropdownIndex" name="arrow-up" />
          <wd-icon v-else name="arrow-down" />
        </div>
        <div v-if="dropdownIndex === index" class="z-10 rounded-lg bg-gray-200">
          <div class="cursor-pointer px-3 py-2" @click="onOptionRemind">
            定时提醒
          </div>
          <div class="cursor-pointer px-3 py-2" @click="onOptionCollection">
            加入收藏
          </div>
        </div>
      </div>
    </div>
    <!-- 图片 -->
    <ShowImg :item="item" />
    <div class="text-base text-gray-700 font-bold">
      {{ item.title ?? '活动标题' }}
    </div>
    <div class="text-base text-gray-400">
      {{ item.start_time ?? '活动时间' }}
    </div>
  </div>
</template>

<script setup lang="ts">
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
