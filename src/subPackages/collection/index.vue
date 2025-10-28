<template>
  <div class="px-3 py-5">
    <!-- 顶部 -->
    <div class="div-top relative flex items-center justify-between text-5">
      <wd-icon v-if="!isEdit" name="search" size="35rpx" @click="navigateTo('search')" />
      <div v-else class="text-red" @click="confirmClear">
        清空所有
      </div>
      <!-- <wd-checkbox v-else v-model="checkAll" size="large" @change="selectAll">
        全选
      </wd-checkbox> -->
      <div v-if="!isEdit" @click="isEdit = true">
        管理
      </div>
      <div v-else class="flex">
        <div class="mr-5 text-red" @click="deleteAct">
          删除
        </div>
        <div @click="isEdit = false">
          取消
        </div>
      </div>
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
  <wd-loadmore :state="state" finished-text="触碰到我的底线啦~" @reload="loadmore" />
  <wd-message-box />
</template>

<script setup lang="ts">
import type { LoadMoreState } from 'wot-design-uni/components/wd-loadmore/types'
import { onMounted } from 'vue'
import { clearCollectionsApi, deleteCollectionsApi, getCollectionListApi } from '../../api/activity'
import { formatDate } from '../../utils/date'
import Info from './components/Info.vue'

const message = useMessage()

const actList = ref<any>([])

// 跳转到搜索页
function navigateTo() {
  uni.navigateTo({
    url: '/subPackages/search-page/index',
    params: {
      type: 'collection'
    }
  })
}

// 列表加载状态
const state = ref<LoadMoreState | undefined>('loading')
const page = ref<number>(1)
const pageSize = 3
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
  await getCollections()
}

// 点击管理
const isEdit = ref<boolean>(false)
// 清空收藏记录
function confirmClear() {
  if (actList.value && actList.value.length) {
    message
      .confirm({
        msg: '确认清空收藏记录'
      })
      .then(async () => {
        await clearCollectionsApi()
        actList.value = []
        isEdit.value = false
        console.log('清空收藏列表')
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
    await deleteCollectionsApi(ids)
  actList.value = actList.value.filter((item: any) => !item.checked)
}

// 设置日期格式
function resetDateFormat(list: any[]) {
  return list.map((item) => {
    item.date = formatDate(item.favoriteTime)
    return item
  })
}
// 获取收藏列表
async function getCollections() {
  const res = await getCollectionListApi({ page: page.value++, size: pageSize })
  const acts: any = res
  if (!acts || !acts.length) {
    state.value = 'finished'
    return
  }
  actList.value = actList.value.concat(res)
  actList.value = resetDateFormat(actList.value)
  if (acts.length < pageSize) {
    state.value = 'finished'
  }
  console.log('res', res, actList.value)
}

onMounted(async () => {
  await getCollections()
})
</script>

<style lang="scss" scoped>
.div-top ::v-deep .wd-checkbox__txt {
  font-size: 40rpx;
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
