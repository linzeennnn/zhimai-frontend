<template>
  <!-- 动态适配自定义顶部导航栏 -->
  <div :style="`height:${navBarHeight}px`" class="relative flex items-end border-b border-gray-200 bg-#2785FF">
    <div class="absolute w-full flex flex-1 items-center justify-center" :style="`height:${capsuleHeight}px;`">
      <div class="text-white">
        编辑个人资料
      </div>
    </div>
    <div
      :style="`height:${capsuleHeight}px;width:${capsuleHeight}px;`"
      class="absolute flex items-center justify-center" @click="onCustomBack"
    >
      <wd-icon name="arrow-left" color="white" />
    </div>
  </div>
  <div class="mt-2">
    <wd-cell-group border>
      <wd-cell title="头像">
        <div class="mr-2 h-90rpx w-full overflow-hidden">
          <image class="h-full w-90rpx border-rounded-full" :src="selfInfo.avatarUrl" @click="openAction" />
        </div>
      </wd-cell>
      <wd-cell title="用户名">
        <wd-input v-model="selfInfo.nickname" align-right placeholder="请输入用户名" no-border />
      </wd-cell>
      <wd-picker v-model="selfInfo.campus" label="校区" placeholder="请选择校区" align-right :columns="campusColumns" />
      <wd-cell title="年级" class="flex">
        <div class="flex">
          <wd-input
            v-model="selfInfo.grade" placeholder="请输入4位入学年份" :maxlength="4" align-right no-border
            @input="onInputGrade"
          />
          <span style="font-size: 30rpx" class="ml-3">级</span>
        </div>
      </wd-cell>
      <wd-picker
        v-model="selfInfo.institute" label="学院" placeholder="请选择学院" align-right :columns="instituteColumns"
        @confirm="(value) => chooseInstitute(value)"
      />
      <wd-picker
        v-model="selfInfo.major" label="专业" align-right
        :placeholder="selfInfo.institute ? '请选择专业' : '请先选择学院'" :disabled="!selfInfo.institute" :columns="majorColumns"
      />
      <wd-cell title="手机号">
        <wd-input
          v-model="selfInfo.phone" placeholder="请输入手机号" :maxlength="11" align-right no-border
          @input="onInputPhone"
        />
      </wd-cell>
      <wd-cell title="邮箱">
        <wd-input v-model="selfInfo.email" :maxlength="30" align-right placeholder="请输入邮箱" no-border />
      </wd-cell>
    </wd-cell-group>
  </div>

  <!-- 动作面板 -->
  <wd-action-sheet
    v-model:model-value="actionVisible"
    :actions="actionList"
    @close="closeAction"
    @select="onActionSelect"
  />
  <div class="mt-4 w-full flex justify-center">
    <wd-button size="large" @click="saveUserInfo">
      保存
    </wd-button>
  </div>
</template>

<script setup lang="ts">
import type { SelfInfo } from '@/types/user'
import { debounce } from 'wot-design-uni/components/common/util'
import { getUserProfile } from '@/hooks/useLogin'
import { useUserStore } from '@/pinia/store/user'
import { campusColumns, instituteColumns, majorOptions } from './schoolInfo'

const userStore = useUserStore()
// 自定义导航栏高度
const navBarHeight = ref(44) // 默认导航栏高度
const capsuleHeight = ref(32) // 默认胶囊高度
// #ifdef MP-WEIXIN
onMounted(() => {
  const system = wx.getWindowInfo()
  const menu = wx.getMenuButtonBoundingClientRect()
  navBarHeight.value = system.statusBarHeight + menu.height + (menu.top - system.statusBarHeight) * 2
  capsuleHeight.value = menu.height
})
// 自定义返回按钮逻辑
function onCustomBack() {
  uni.showModal({
    title: '提示',
    content: '离开前请确认已保存修改，是否返回？',
    showCancel: true,
    confirmText: '返回',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    }
  })
}

// #endif
const value = ref('')
const selfInfo = ref<SelfInfo>({
  avatarUrl: '/static/self-center/user-avatar.png',
  nickname: '',
  email: '',
  phone: '',
  campus: '',
  grade: '',
  major: '',
  institute: ''
})

// 修改头像
// const avatarUrl = ref<string>()

const actionVisible = ref<boolean>(false)
const actionList = ref<{ name: string, value: string }[]>([
  { name: '使用微信头像', value: 'wechat' },
  { name: '相册选择', value: 'album' },
  { name: '拍照上传', value: 'camera' }
])

// 打开面板
function openAction() {
  actionVisible.value = true
}

// 关闭面板
function closeAction() {
  actionVisible.value = false
}

// 处理选项
function onActionSelect(item: any) {
  console.log('选中的 action:', item)
  const { value } = item.item
  if (value === 'wechat') {
    chooseWechatAvatar()
  } else if (value === 'album') {
    chooseImage('album')
  } else if (value === 'camera') {
    chooseImage('camera')
  }
}

// 使用微信头像
async function chooseWechatAvatar() {
  await getUserProfile()
  const avatar = userStore.userProfile?.avatarUrl
  selfInfo.value.avatarUrl = avatar
  console.log('avatar', avatar, '//')
//   wx.getUserProfile({
//     desc: "获取微信头像",
//     success: (res) => {
//       avatarUrl.value = res.userInfo.avatarUrl
//       // TODO: 上传服务器
//     }
//   })
}

// 相册/拍照
function chooseImage(source: 'album' | 'camera') {
//   wx.chooseImage({
//     count: 1,
//     sizeType: ["compressed"],
//     sourceType: [source],
//     success: (res) => {
//       avatarUrl.value = res.tempFilePaths[0]
//       // TODO: 上传服务器
//     }
//   })
  // uni.chooseMedia({
  //   count: 1,
  //   mediaType: ["image"],   // 只要图片
  //   sourceType: ["album", "camera"],
  //   sizeType: ["compressed"],
  //   success: (res) => {
  //     // res.tempFiles[0].tempFilePath 替代 tempFilePaths[0]
  //     console.log("选择的图片路径:", res.tempFiles[0])
  //     avatarUrl.value = res.tempFiles[0].tempFilePath
  //   }
  // })
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: [source],
    success: async (res) => {
      const filePath = res.tempFilePaths[0]
      selfInfo.value.avatarUrl = filePath
      console.log('选择的图片路径:', filePath)
      // 接口，待联调，图片上传
    //   await uploadToAliOSS(filePath)
    }
  })
}

// 选项数据来源，最好从数据库获取
const majorColumns = ref<string[]>()
type InstituteKey = keyof typeof majorOptions
function chooseInstitute(option: any) {
  console.log('value', option)
  const institute: string = option.value || ''
  selfInfo.value.major = ''
  majorColumns.value = institute ? majorOptions[institute as InstituteKey] : []
}

// 输入手机号：只保留数字（自动过滤空格和非数字）
const onInputPhone = debounce((val: any) => {
  const digits = String(val.value).replace(/\D+/g, '') // 只保留 0-9
  selfInfo.value.phone = digits.slice(0, 11) // 限制 11 位
}, 400)

// 输入年级：保留4位数字
const onInputGrade = debounce((val: any) => {
  const digits = String(val.value).replace(/\D+/g, '') // 只保留4位数字
  selfInfo.value.grade = digits.slice(0, 4)
}, 400)

// 保存
function saveUserInfo() {
  console.log('保存')
  // 接口，待联调，保存个人信息
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
// ::v-deep .wd-input__inner {
//     font-size: 30rpx !important;
// }

::v-deep .wd-cell__title {
  font-size: 30rpx !important;
}
</style>
