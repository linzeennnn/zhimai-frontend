<template>
  <view class="min-h-screen bg-white">
    <!-- top -->
    <view class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <view
        class="text-sm text-gray-600"
        @click="goBack"
      >
        取消
      </view>
      <view class="text-base font-semibold">
        新建活动
      </view>
      <view
        class="text-sm text-blue-500"
        @click="onSave"
      >
        保存
      </view>
    </view>

    <!-- form -->
    <view class="p-4">
      <view class="mb-3 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          链接
        </view>
        <input v-model="link" class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
      </view>
      <view class="mb-3 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          标题
        </view>
        <input v-model="title" class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
      </view>

      <view class="mb-2 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          提醒时间
        </view>
        <view class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
          <view class="grid grid-cols-10 gap-2">
            <picker class="col-span-5" mode="date" :value="beginDate" @change="onBeginDateChange">
              <view class="w-full text-center">
                {{ beginDate }}
              </view>
            </picker>
            <view class="col-span-1 text-center">
              |
            </view>
            <picker class="col-span-4" mode="time" :value="beginTime" @change="onBeginTimeChange">
              <view class="w-full text-center">
                {{ beginTime }}
              </view>
            </picker>
          </view>
        </view>
      </view>

      <view class="mb-3 flex items-center gap-3">
        <view class="w-14 text-sm text-gray-600">
          提醒类型
        </view>
        <input v-model="remindType" class="flex-1 border border-gray-200 rounded bg-gray-100 px-3 py-2">
      </view>

      <view class="mt-6">
        <view class="border border-red-100 rounded px-3 py-2 text-center text-red-500" @click="onDelete">
          删除
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const id = ref<number>(-1)
const title = ref<string>('')
const link = ref<string>('')
const remindType = ref<string>('')
const beginDate = ref<string>('')
const beginTime = ref<string>('')
// keep end fields in script for backward compatibility (UI removed)
const endDate = ref<string>('')
const endTime = ref<string>('')

function TimeFormat(num: number | string) {
  const s = String(num)
  return s.length === 1 ? `0${s}` : s
}

function DateFormatString() {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  return {
    date: `${year}-${month}-${day}`,
    time: `${TimeFormat(hour)}:${TimeFormat(minute)}`
  }
}

// 在小程序/uni-app 中通过 onLoad 获取路由参数
onLoad((params?: Record<string, any>) => {
  params = params ?? {}
  if (params.title) {
    title.value = String(params.title)
  }
  if (params.id) {
    id.value = Number(params.id)
  }
  if (params.beginDate) {
    beginDate.value = String(params.beginDate)
  }
  if (params.beginTime) {
    beginTime.value = String(params.beginTime)
  }
  if (params.link) {
    link.value = String(params.link)
  }
  if (params.remindType) {
    remindType.value = String(params.remindType)
  }

  if (!beginDate.value) {
    const t = DateFormatString()
    beginDate.value = t.date
    beginTime.value = t.time
    endDate.value = t.date
    // keep endTime aligned with beginTime for compatibility (not used when end removed)
    endTime.value = t.time
  }
})

function goBack() {
  // 使用 uni.navigateBack 保持与小程序一致
  uni.navigateBack({ delta: 1 })
}

function onBeginDateChange(e: any) {
  beginDate.value = e.detail.value
}
function onBeginTimeChange(e: any) {
  beginTime.value = e.detail.value
}
// end date/time removed; keep variables for backward compatibility where needed

function onSave() {
  if (!title.value || title.value.trim() === '') {
    uni.showModal({ title: '提示', content: '标题不能为空，请重新设置', showCancel: false })
    return
  }

  uni.showToast({ title: '保存成功', icon: 'success', duration: 700, mask: true })
  setTimeout(() => {
    // 传回上一页：和原小程序行为一致，使用 getCurrentPages 修改上一页 data
    const pages: any = getCurrentPages()
    const prev = pages[pages.length - 2]
    if (prev) {
      prev.setData({
        newRemindId: id.value,
        newRemind: {
          title: title.value,
          link: link.value,
          remindType: remindType.value,
          beginDate: beginDate.value,
          beginTime: beginTime.value,
          // keep end fields for compatibility but they mirror begin
          endDate: endDate.value,
          endTime: endTime.value
        }
      })
    }
    goBack()
  }, 800)
}

function onDelete() {
  uni.showToast({ title: '删除成功', icon: 'success', duration: 700, mask: true })
  setTimeout(() => {
    goBack()
  }, 800)
}
</script>
