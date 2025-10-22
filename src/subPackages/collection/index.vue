<template>
  <div class="px-3 py-5">
    <!-- 顶部 -->
    <div class="div-top relative flex items-center justify-between text-5">
      <wd-icon v-if="!isEdit" name="search" size="35rpx" @click="navigateTo('search')" />
      <wd-checkbox v-else v-model="checkAll" size="large" @change="selectAll">
        全选
      </wd-checkbox>
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
        <!-- 待完成，用favoriteTime计算date -->
        <div v-if="index === 0 || item.date !== actList[index - 1].date" class="my-3 text-4">
          {{ formatDate(item.date) }}
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getCollectionListApi } from '../../api/activity'
import Info from './components/Info.vue'

const actList = ref<Array<any>>([])

// 跳转到搜索页
function navigateTo() {
  uni.navigateTo({
    url: '/subPackages/search-page/index',
    params: {
      type: 'collection'
    }
  })
}

// 格式化日期显示
function formatDate(d: Date | string | number) {
  const date = new Date(d)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 点击管理
const isEdit = ref<boolean>(false)
// 是否全选
const checkAll = ref<boolean>(false)
// 全选判定
function selectAll() {
  if (checkAll.value) {
    actList.value = actList.value.map((item: any) => {
      item.checked = true
      return item
    })
  } else {
    actList.value = actList.value.map((item: any) => {
      item.checked = false
      return item
    })
  }
}
// 删除
// 接口待联调（需要注意，这里是分页加载，如果点击全选，可能有未显示的数据，也应当删除，需要同后端协调）
function deleteAct() {
  actList.value = actList.value.filter((item: any) => !item.checked)
}

onMounted(async () => {
  const res = await getCollectionListApi()
  actList.value = res
  console.log('res', res)
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
