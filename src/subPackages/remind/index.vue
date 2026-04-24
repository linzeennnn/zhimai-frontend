<template>
  <view class="min-h-screen bg-white pb-16">
    <view class="flex items-center justify-between border-b border-gray-200 px-4 py-3">
      <view class="text-lg font-semibold">
        {{ curYear }}年{{ curMonth }}月
      </view>
      <view class="flex items-center gap-2">
        <picker mode="date" :value="pickerValue" fields="month" @change="onPickerChange">
          <view class="rounded-md bg-slate-100 px-2 py-1 text-sm">
            选择年月
          </view>
        </picker>
        <view class="rounded-md bg-blue-500 px-3 py-1 text-sm text-white" @click="onCreate">
          新建
        </view>
      </view>
    </view>

    <view class="flex items-start gap-2 p-3">
      <view class="w-9 select-none text-center text-xl text-gray-600" @click="prevMonth">
        ‹
      </view>
      <view class="flex-1">
        <view class="flex">
          <view v-for="(w, i) in weeks" :key="i" class="flex-1 py-1 text-center text-xs text-gray-500">
            {{ w }}
          </view>
        </view>
        <view
          v-for="(week, wIdx) in calendarGrid"
          :key="wIdx" class="flex"
        >
          <view
            v-for="(day, idx) in week"
            :key="`${wIdx}-${idx}`"
            class="flex-1 p-1 text-center"
          >
            <view
              class="mx-auto h-9 w-9 flex items-center justify-center rounded-full"
              :class="{
                'text-gray-300': !day,
                'bg-blue-500 text-white': isToday(day),
                'ring-2 ring-blue-200': day === curDay,
              }"
              @click="onDayClick(day)"
            >
              <text v-if="day">
                {{ day }}
              </text>
            </view>
            <view
              v-if="day && hasEventOn(day)"
              class="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-blue-500"
            />
          </view>
        </view>
      </view>
      <view
        class="w-9 select-none text-center text-xl text-gray-600"
        @click="nextMonth"
      >
        ›
      </view>
    </view>

    <view class="px-4">
      <view v-if="filteredList.length === 0" class="py-6 text-center text-gray-500">
        今天没有日程
      </view>
      <view
        v-for="(item, index) in filteredList"
        :key="item.id"
        class="mb-3 flex rounded-lg bg-white p-3 shadow-sm"
      >
        <view class="w-14 text-center text-gray-600">
          <view class="font-bold">
            {{ shortMonthDay(item.beginDate) }}
          </view>
          <view class="text-xs">
            {{ item.beginTime }}
          </view>
        </view>
        <view class="flex-1 pl-3">
          <view class="flex items-center justify-between">
            <view class="font-bold" :class="{ 'line-through text-gray-400': item.finish }">
              {{ item.title }}
            </view>
            <view class="text-sm text-gray-600" @click="toggleFinish(index)">
              {{ item.finish ? '已完成' : '标记完成' }}
            </view>
          </view>
          <view class="mt-1 text-xs text-gray-500">
            {{ compareDateRange(item.beginDate, item.endDate) }}
          </view>
          <navigator :url="detailUrl(item)">
            <view class="mt-2 text-sm text-blue-500">
              查看 / 编辑
            </view>
          </navigator>
        </view>
      </view>
    </view>

    <view
      v-if="showBackTop"
      class="fixed bottom-20 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white"
      @click="backTop"
    >
      ↑
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const today = new Date()
const curYear = ref<number>(today.getFullYear())
const curMonth = ref<number>(today.getMonth() + 1)
const curDay = ref<number>(today.getDate())
const selectedTimestamp = ref<number | null>(null)

const weeks = ['一', '二', '三', '四', '五', '六', '日']

const calendarGrid = ref<any>([])

function buildCalendar(year: number, month: number) {
  calendarGrid.value = []
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const days = last.getDate()
  const startWeek = first.getDay()

  let grid: number[] = []
  let count = 1
  for (let i = 1; i < startWeek; i++) grid.push(0)
  while (count <= days) {
    grid.push(count)
    count++
    if (grid.length % 7 === 0) {
      calendarGrid.value.push(grid)
      grid = []
    }
  }
  while (grid.length > 0 && grid.length < 7) grid.push(0)
  if (grid.length > 0)
    calendarGrid.value.push(grid)
}

buildCalendar(curYear.value, curMonth.value)

function prevMonth() {
  if (curMonth.value === 1) {
    curYear.value--
    curMonth.value = 12
  } else {
    curMonth.value--
  }
  buildCalendar(curYear.value, curMonth.value)
}
function nextMonth() {
  if (curMonth.value === 12) {
    curYear.value++
    curMonth.value = 1
  } else {
    curMonth.value++
  }
  buildCalendar(curYear.value, curMonth.value)
}

const pickerValue = computed(() => `${curYear.value}-${String(curMonth.value).padStart(2, '0')}`)
function onPickerChange(e: any) {
  const v = e.detail.value
  if (!v) {
    return
  }
  const [y, m] = v.split('-').map((s: string) => Number(s))
  curYear.value = y
  curMonth.value = m
  buildCalendar(y, m)
}

const events = ref<any[]>([])
function loadSample() {
  const y = curYear.value
  const m = String(curMonth.value).padStart(2, '0')
  events.value = [
    { id: 1, title: '测试提醒 A', beginDate: `${y}-${m}-07`, endDate: `${y}-${m}-07`, beginTime: '10:00', endTime: '12:00', finish: false },
    { id: 2, title: '测试提醒 B', beginDate: `${y}-${m}-08`, endDate: `${y}-${m}-08`, beginTime: '14:00', endTime: '15:00', finish: true }
  ]
}

onMounted(() => {
  loadSample()
})

function hasEventOn(day: number) {
  if (!day) {
    return false
  }
  const mm = String(curMonth.value).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  const date = `${curYear.value}-${mm}-${dd}`
  return events.value.some((it: any) => it.beginDate === date || it.endDate === date)
}

function isToday(d: number) {
  return d === today.getDate() && curMonth.value === (today.getMonth() + 1) && curYear.value === today.getFullYear()
}

function onDayClick(day: number) {
  if (!day) {
    return
  }
  curDay.value = day
  // 保存选中的时间戳
  const selectedDate = new Date(curYear.value, curMonth.value - 1, day)
  selectedTimestamp.value = selectedDate.getTime()
}

const filteredList = computed(() => {
  const mm = String(curMonth.value).padStart(2, '0')
  const dd = String(curDay.value).padStart(2, '0')
  const date = `${curYear.value}-${mm}-${dd}`
  return events.value.filter((it: any) => it.beginDate === date || it.endDate === date)
})

function toggleFinish(index: number) {
  const id = filteredList.value[index].id
  const idx = events.value.findIndex((e: any) => e.id === id)
  if (idx !== -1) {
    events.value[idx].finish = !events.value[idx].finish
  }
}

function detailUrl(item: any) {
  return `/subPackages/pages/remind-create/remind-create?title=${encodeURIComponent(item.title)}&beginDate=${item.beginDate}&beginTime=${item.beginTime}&endDate=${item.endDate}&endTime=${item.endTime}&id=${item.id}`
}

function compareDateRange(b: string, e: string) {
  if (!b || !e) {
    return '-'
  }
  return `${b} - ${e}`
}

function shortMonthDay(d: string) {
  if (!d) {
    return ''
  }
  const parts = d.split('-')
  return `${Number(parts[1])}.${Number(parts[2])}`
}

function onCreate() {
  if (selectedTimestamp.value) {
    // 保存到本地存储
    uni.setStorageSync('noticeTime', selectedTimestamp.value)
    uni.showToast({ title: '提醒已设置', icon: 'success' })

    // 添加到 events 数组，让日历显示小蓝点
    const year = curYear.value
    const month = String(curMonth.value).padStart(2, '0')
    const day = String(curDay.value).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    // 检查是否已经存在该日期的提醒
    const alreadyExists = events.value.some((e: any) => e.beginDate === dateStr)
    if (!alreadyExists) {
      const newEvent = {
        id: Date.now(),
        title: '提醒事项',
        beginDate: dateStr,
        endDate: dateStr,
        beginTime: '00:00',
        endTime: '23:59',
        finish: false
      }
      events.value.push(newEvent)
      // 刷新日历视图
      buildCalendar(curYear.value, curMonth.value)
    }

    // 可选：跳转或停留
    // uni.navigateTo({ url: '/subPackages/remind-create/index' })
  } else {
    uni.showToast({ title: '请先选择日期', icon: 'none' })
  }
}

const showBackTop = ref(false)
function backTop() {
  uni.pageScrollTo({ scrollTop: 0, duration: 200 })
}
</script>
