<!-- 活动图片 -->
<template>
  <template v-if="item.activity_type">
    <div class="my-2 h-38 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-50rpx text-blue-400 font-bold">
      <image class="h-20 w-20" src="/static/activity-type/headIcon.png" />
      <div>
        <div v-if="item.activity_type === '二课'">
          <div v-if="item.credit_type" class="ml-1">
            {{ item.credit_type.length > 4 ? '二课学分' : `${item.credit_type}学分` }}
          </div>
          <div v-else>
            学分活动
          </div>
        </div>
        <div v-else-if="item.activity_type === '综测'" class="ml-1">
          综测活动
        </div>
        <div v-else-if="item.activity_type === '二课综测'">
          <div v-if="item.credit_type" class="ml-1">
            {{ item.credit_type.length > 4 ? '二课学分' : `${item.credit_type}学分` }}
          </div>
          <div v-else>
            学分活动
          </div>
          <div class="h-2 w-110% bg-#d9eaf0" />
          <div class="ml-1">
            综测活动
          </div>
        </div>
      </div>
    </div>
    <!-- <template v-if="item.isImgError">
      <div
        class="my-2 h-38 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold"
        @click="reloadImg"
      >
        <wd-icon name="refresh" />
        <div class="ml-3">
          图片加载失败，请点击重试
        </div>
      </div>
    </template>
    <template v-else>
      <image
        class="h-38 w-full" :src="setImg(item)" mode="aspectFit" lazy-load show-menu-by-longpress
        @error="imageError"
      />
    </template> -->
  </template>
  <template v-else>
    <div
      class="my-4 h-38 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold"
    >
      暂无图片
    </div>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object as any
  },
  // 替换的图片类型
  type: {
    type: String,
    default: ''
  }
})

// 图片加载失败
// function imageError() {
//   item.value.isImgError = true
// }

// 重新加载图片
// function reloadImg() {
//   item.value.isImgError = false
// }

// 设置活动图片
// function setImg(act: any) {
//   switch (act.activity_type) {
//     case '二课':
//       switch (act.credit_type) {
//         case '菁英成长':
//           return '/static/activity-type/jingying.png'
//         case '实践实习':
//           return '/static/activity-type/shijian.png'
//         case '创新创业':
//           return '/static/activity-type/chuangxin.png'
//         case '技能特长':
//           return '/static/activity-type/jineng.png'
//         case '思想成长':
//           return '/static/activity-type/sixiang.png'
//         case '志愿公益':
//           return '/static/activity-type/zhiyuan.png'
//         case '文体活动':
//           return '/static/activity-type/wenti.png'
//         default:
//           return '/static/activity-type/xuefen.jpg'
//       }
//     case '综测':
//       return '/static/activity-type/zongce.jpg'
//     case '二课综测':
//       switch (act.credit_type) {
//         case '菁英成长':
//           return '/static/activity-type/jingyingzongce.png'
//         case '实践实习':
//           return '/static/activity-type/shijianzongce.png'
//         case '创新创业':
//           return '/static/activity-type/chuangxinzongce.png'
//         case '技能特长':
//           return '/static/activity-type/jinengzongce.png'
//         case '思想成长':
//           return '/static/activity-type/sixiangzongce.png'
//         case '志愿公益':
//           return '/static/activity-type/zhiyuanzongce.png'
//         case '文体活动':
//           return '/static/activity-type/wentizongce.png'
//         default:
//           return '/static/activity-type/xuefenzongce.jpg'
//       }
//   }
// }
</script>
