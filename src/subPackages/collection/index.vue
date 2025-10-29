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
          <div @click="isEdit = true">
            管理
          </div>
        </template>
      </template>

      <!-- <wd-checkbox v-else v-model="checkAll" size="large" @change="selectAll">
        全选
      </wd-checkbox> -->
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
import { debounce } from 'wot-design-uni/components/common/util'
import { clearCollectionsApi, deleteCollectionsApi, getCollectionListApi } from '../../api/activity'
import { formatDate } from '../../utils/date'
import Info from './components/Info.vue'

const message = useMessage()

const actList = ref<any>([])
const page = ref<number>(1)
// 跳转到搜索页
// function navigateTo() {
//   uni.navigateTo({
//     url: '/subPackages/search-page/index',
//     params: {
//       type: 'collection'
//     }
//   })
// }
const searchContent = ref<string>('')
const isSearch = ref<boolean>(false)
const state = ref<LoadMoreState | undefined>('loading')
// 点击搜索
const handleSearch = debounce(() => {
  searchContent.value = searchContent.value.trim()
  if (!searchContent.value)
    return
  console.log('test Search')
  getCollections('search', searchContent.value)
}, 500)

// 取消搜索
async function cancelSearch() {
  isSearch.value = false
  searchContent.value = ''
  page.value = 1
  actList.value = []
  state.value = 'loading'
  await getCollections()
}

// 列表加载状态
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
async function getCollections(type = 'default', content = '') {
  let res = null
  if (type === 'search') {
    res = await getCollectionListApi({ page: page.value++, size: pageSize, content })
    actList.value = res
  } else {
    res = await getCollectionListApi({ page: page.value++, size: pageSize })
    actList.value = actList.value.concat(res)
  }
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
}

onMounted(async () => {
  await getCollections()
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
