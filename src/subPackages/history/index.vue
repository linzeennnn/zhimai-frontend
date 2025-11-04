<template>
  <div class="px-3 py-5">
    <!-- 顶部 -->
    <div class="div-top relative h-7 flex items-center justify-between text-5">
      <template v-if="isSearch">
        <wd-search
          v-if="isSearch" v-model="searchContent" class="w-full" placeholder="请输入" placeholder-left light
          :maxlength="30" @search="handleSearch" @cancel="cancelSearch"
        />
      </template>
      <template v-else>
        <template v-if="isEdit">
          <div class="text-red" @click="confirmClear">
            清空所有
          </div>
          <div class="flex">
            <div class="mr-5 text-red" @click="deleteAct">
              删除
            </div>
            <div @click="isEdit = false">
              取消
            </div>
          </div>
        </template>
        <template v-else>
          <wd-icon v-if="!isEdit" name="search" size="35rpx" @click="isSearch = true" />
          <div @click="showAction = true">
            管理
          </div>
        </template>
      </template>
    </div>
    <!-- 列表 -->
    <div class="mt-5">
      <div v-for="(item, index) in actList" :key="index" class="act-item mb-5">
        <div v-if="index === 0 || item.date !== actList[index - 1].date" class="my-3 text-4">
          {{ item.date }}
        </div>
        <wd-checkbox v-if="isEdit" v-model="item.checked" size="large">
          <Info :item="item" :index="index" :is-function="false" />
        </wd-checkbox>
        <template v-else>
          <Info :item="item" :index="index" :is-function="false" />
        </template>
      </div>
    </div>
  </div>
  <wd-loadmore :state="state" finished-text="触碰到我的底线啦~" error-text="加载失败" @reload="loadmore" />
  <wd-message-box />
  <wd-action-sheet v-model="showAction" :actions="actions" @close="showAction = false" @select="selectAction" />
</template>

<script setup lang="ts">
import type { LoadMoreState } from 'wot-design-uni/components/wd-loadmore/types'
import { onMounted } from 'vue'
import { debounce } from 'wot-design-uni/components/common/util'
import AppConfig from '@/config'
import { clearHistoryApi, closeHistoryApi, deleteHistoryApi, getHistoryListApi } from '../../api/activity'
import { formatDate } from '../../utils/date'
import Info from '../components/Info.vue'

const pageSize = AppConfig.pageSize || 10

const message = useMessage()
const showAction = ref<boolean>(false)
const actions = ref<any[]>([
  {
    name: '批量管理历史浏览'
  },
  {
    name: '关闭历史浏览'
  }
])
const actList = ref<any>([])
const isEdit = ref<boolean>(false)
const state = ref<LoadMoreState | undefined>('loading')
const page = ref<number>(1)
const searchContent = ref<string>('')
const isSearch = ref<boolean>(false)

function selectAction(obj: { item: any, index: number }) {
  const { index } = obj
  console.log('selectAction', index)
  if (index === 0) {
    isEdit.value = true
  } else if (index === 1) {
    message
      .confirm({
        msg: '确认关闭历史浏览'
      })
      .then(async () => {
        await closeHistoryApi()
        actList.value = []
        state.value = 'finished'
        console.log('关闭历史浏览')
      })
      .catch(() => {
        console.log('取消')
      })
  }
}

// 点击搜索
const handleSearch = debounce(() => {
  searchContent.value = searchContent.value.trim()
  if (!searchContent.value)
    return
  console.log('test Search')
  page.value = 1
  getHistory('search', searchContent.value)
}, 500)

// 取消搜索
async function cancelSearch() {
  isSearch.value = false
  searchContent.value = ''
  page.value = 1
  actList.value = []
  state.value = 'loading'
  await getHistory()
}

// 到达底部
onReachBottom(() => {
  console.log('reachBottom')
  if (state.value === 'finished')
    return
  loadmore()
})
// 加载更多
async function loadmore() {
  if (state.value === 'finished')
    return
  state.value = 'loading'
  await getHistory()
}
// 清空历史浏览
function confirmClear() {
  if (actList.value && actList.value.length) {
    message
      .confirm({
        msg: '确认清空历史浏览'
      })
      .then(async () => {
        await clearHistoryApi()
        actList.value = []
        isEdit.value = false
        state.value = 'finished'
        console.log('清空历史浏览')
      })
      .catch(() => {
        console.log('取消清空')
      })
  }
}

// 批量删除
async function deleteAct() {
  const ids = actList.value
    .filter((item: any) => item.checked)
    .map((item: any) => item.activity_id)
  if (ids.length)
    await deleteHistoryApi(ids)
  actList.value = actList.value.filter((item: any) => !item.checked)
}

// 设置日期格式
function resetDateFormat(list: any[]) {
  return list.map((item) => {
    item.date = formatDate(item.hisotryTime)
    return item
  })
}
// 获取历史列表
async function getHistory(type = 'default', content = '') {
  try {
    let res = null
    if (type === 'search') {
      res = await getHistoryListApi({ page: page.value, content })
      actList.value = res
    } else {
      res = await getHistoryListApi({ page: page.value })
      actList.value = actList.value.concat(res)
    }
    page.value++
    actList.value = resetDateFormat(actList.value)
    // 处理加载状态
    const acts: any = res
    if (!acts || !acts.length) {
      state.value = 'finished'
      return
    }
    if (acts.length < pageSize) {
      state.value = 'finished'
    }
    console.log('res', res, actList.value)
  } catch {
    state.value = 'error'
  }
}

onMounted(async () => {
  await getHistory()
})
</script>

<style lang="scss" scoped>
.div-top ::v-deep .wd-checkbox__txt {
  font-size: 40rpx;
}

::v-deep .wd-search.data-v-4ebafd4c {
  padding: 0;
  width: 100%;
}

.act-item ::v-deep .wd-checkbox {
  display: flex;
  align-items: center;

  .wd-checkbox__label {
    flex-grow: 1;

    .wd-checkbox__txt {
      width: 100%;
    }
  }
}
</style>
