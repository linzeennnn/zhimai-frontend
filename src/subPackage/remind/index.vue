<template>
  <div class="mt-3 px-3">
    <div class="flex justify-between">
      <div>{{ curYear }} 年 {{ curMonth }} 月</div>
      <div @click="switchMonthSheet">
        选择年月
      </div>
    </div>
  </div>
  <wd-action-sheet v-model="showMonthSheet" title="选择日期">
    <wd-calendar-view v-model="curMonthValue" type="month" :min-date="minMonth" />
    <div class="w-full flex justify-center">
      <wd-button type="primary" @click="confirmMonth">
        确定
      </wd-button>
    </div>
  </wd-action-sheet>
</template>

<script setup lang="ts">
// 日期面板
const curYear = ref<number>(new Date().getFullYear())
const curMonth = ref<number>(new Date().getMonth() + 1)
const curDay = ref<number>(new Date().getDate())
const showMonthSheet = ref<boolean>(false)

// 月面板
const curMonthValue = ref<number>(curMonth.value)
const minMonth = new Date(2024, 12, 31).getTime()
function switchMonthSheet() {
  showMonthSheet.value = !showMonthSheet.value
}
function confirmMonth() {
  const date = new Date(curMonthValue.value)
  curMonth.value = date.getMonth() + 1
  curYear.value = date.getFullYear()
  switchMonthSheet()
}
</script>

<style lang="scss" scoped></style>
