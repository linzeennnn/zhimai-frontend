<template>
  <div class="flex flex-col items-center">
    <div class="px-5 pt-2" style="width: calc(100% - 80rpx)">
      <div class="flex items-center justify-between">
        <div class="flex items-center" @click="judgeLogin('login')">
          <div class="mr-2 h-120rpx w-120rpx overflow-hidden border-rounded-full">
            <image class="h-full w-full" :src="userStore.userProfile.avatarUrl" />
          </div>
          <div v-if="userStore.isLogin === false">
            点击登陆
          </div>
          <div v-else>
            {{ userStore.userProfile.nickname }}
          </div>
        </div>
        <wd-button size="small" type="info" @click="judgeLogin('edit-self')">
          编辑资料
        </wd-button>
      </div>
    </div>
    <!-- 活动提示 -->
    <div class="mt-4 h-160rpx w-600rpx flex items-center rounded-3 bg-#EBEBEB px-4">
      <div class="w-10" @click="judgeLogin('notice')">
        <image class="max-h-14 w-10" src="/static/self-center/notice.png" mode="aspectFit" />
      </div>
      <wd-popover placement="bottom" use-content-slot>
        <template #content>
          <div class="p-3">
            {{ notice }}
          </div>
        </template>
        <div class="ml-3 h-140rpx w-456rpx flex flex-grow items-center">
          <div class="text-ellipsis text-#f46f17" :style="`opacity: ${noticeOpacity}`">
            {{ notice }}
          </div>
        </div>
      </wd-popover>
    </div>
    <div class="mt-3 w-650rpx">
      <div class="font-bold">
        服务中心
      </div>
      <div class="mt-3 flex flex-wrap rounded-3 bg-#EBEBEB">
        <div
          v-for="(service, index) in services" :key="index" class="h-15 w-15 flex flex-col items-center p-2"
          @click="judgeLogin('service-center', service.path)"
        >
          <image class="max-h-10 w-60rpx" mode="aspectFit" :src="service.img" />
          <div class="text-27rpx font-bold">
            {{ service.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="mt-5 w-650rpx">
      <div class="font-bold">
        更多服务
      </div>
      <div class="mt-3 rounded-3 bg-#EBEBEB">
        <div
          v-for="(service, index) in moreServices" :key="index" class="flex items-center justify-between p-3"
          @click="judgeLogin('service-center', service.path)"
        >
          <div class="flex items-center">
            <image class="max-h-6 w-6" :src="service.img" mode="aspectFit" />
            <div class="ml-2 text-4 font-bold">
              {{ service.title }}
            </div>
          </div>
          <wd-icon class="w-4" name="arrow-right" />
        </div>
      </div>
    </div>
  </div>

  <!-- 授权微信操作操作 -->
  <wd-action-sheet v-model="showLogin" :actions="actions" @close="showLogin = false" @select="confirmLogin" />
  <!-- 选择登陆 -->
  <!-- <wd-overlay :show="showLogin" @click="showLogin = false" />
  <div class="login-modal" v-if="showLogin">
    <button class="avatar-button" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
      <div class="avatar-box">
        <image class="avatar" :src="userInfo.avatarUrl" />
        <div class="text-27rpx">选择头像</div>
      </div>
    </button>

    <wd-cell title="昵称">
      <input type="nickname" placeholder="请输入昵称" @change="onInputNickname" />
    </wd-cell>

    <div class="flex justify-around">
      <wd-button type="primary" @click="confirmLogin">确认登录</wd-button>
      <wd-button type="info" @click="cancelLogin">取消</wd-button>
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { useGlobalToast } from '../../hooks/useGlobalToast'
import { login } from '../../hooks/useLogin'
import { useUserStore } from '../../pinia/store/user'
import { moreServices, services } from './config'

const userStore = useUserStore()
const globalToast = useGlobalToast()
const showLogin = ref<boolean>(false)
const noticeIndex = ref<number>(0)
const actions = [
  {
    name: '授权微信登陆'
  }
]
// const userInfo = ref<any>({
//   nickname: userStore.userProfile.nickname || '知脉用户007',
//   avatarUrl: userStore.userProfile.avatarUrl || '/static/self-center/user-avatar.png'
// })

function judgeLogin(type: string, url?: string) {
  if (userStore.isLogin === false) {
    showLogin.value = true
  } else {
    switch (type) {
      case 'edit-self':
        navigateTo('/subPackage/edit-info/index')
        break
      case 'notice':
        setNotice(noticeIndex.value + 1)
        break
      case 'service-center':
        if (url)
          navigateTo(url)
        break
    }
  }
}

async function confirmLogin() {
  await login()
  globalToast.success('登录成功')
  // userInfo.value = {
  //   nickname: userStore.userProfile.nickname || '知脉用户',
  //   avatarUrl: userStore.userProfile.avatarUrl || '/static/self-center/user-avatar.png'
  // }
  // console.log('ssss', userInfo.value)
  userStore.setLoginStatus(true)
  setNotice(0)
}

// // 选择头像
// function onChooseAvatar(e: any) {
//   console.log('选择头像', e)
//   const { avatarUrl } = e.detail
//   userInfo.value = { avatarUrl }
//   // userStore.setUserProfile({ ...userStore.userProfile, avatarUrl })
// }
// // 选择昵称
// function onInputNickname(e: any) {
//   console.log('输入昵称', e)
//   const { value } = e.detail
//   userInfo.value = { ...userInfo.value, nickname: value }
// }
// // 取消登陆
// function cancelLogin() {
//   userInfo.value = { ...userStore.userProfile }
//   showLogin.value = false
// }
// // 确认登陆
// async function confirmLogin() {
//   userStore.setUserProfile({ ...userStore.userProfile, ...userInfo.value })
//   await login()
//   globalToast.success('登录成功')
//   userStore.setLoginStatus(true)
//   showLogin.value = false
// }

// 路由跳转
function navigateTo(url: string) {
  console.log('navigateTo', url)
  uni.navigateTo({ url })
}

// 轮播-活动提醒
const notice = ref<string>('')
const noticeOpacity = ref<number>(1)
const noticeList = ref<Array<string>>([
  'tsetest',
  '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
  '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
  '桃之夭夭，灼灼其华。之子于归，宜其室家。桃之夭夭，有蕡其实。之子于归，宜其家室。桃之夭夭，其叶蓁蓁。之子于归，宜其家人。',
  '青青子衿，悠悠我心。纵我不往，子宁不嗣音？青青子佩，悠悠我思。纵我不往，子宁不来？挑兮达兮，在城阙兮。一日不见，如三月兮！'
])

const interval = ref<NodeJS.Timeout | null>(null)

// 设置定时器-显示提示
function setNotice(index: number) {
  if (!userStore.isLogin || noticeList.value.length === 0) {
    notice.value = '暂无通知'
    return
  }
  if (noticeList.value.length === 1) {
    notice.value = noticeList.value[0] || ''
    return
  }
  if (index > noticeList.value.length - 1)
    index = 0
  // 初始化提示文字
  notice.value = noticeList.value[index] || ''
  noticeIndex.value = index
  // 清除定时器
  clearInterval(interval.value as NodeJS.Timeout)
  // 切换提示文字
  interval.value = setInterval(() => {
    noticeOpacity.value = 0
    setTimeout(() => {
      noticeIndex.value++
      if (noticeIndex.value === noticeList.value.length)
        noticeIndex.value = 0
      notice.value = noticeList.value[noticeIndex.value]
      noticeOpacity.value = 1
    }, 500)
  }, 3000)
}

onMounted(() => {
  setNotice(0)
})
</script>

<style lang="scss" scoped>
.text-ellipsis {
  transition: opacity 0.5s ease;
  overflow: hidden;
  /* 超出部分隐藏 */
  text-overflow: ellipsis;
  /* 显示省略号 */
  display: -webkit-box;
  /* 将对象作为弹性伸缩盒子模型显示 */
  -webkit-box-orient: vertical;
  /* 设置伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 3;
  /* 限制文本行数，设为3行 */
  word-break: break-all;
  /* 允许在单词内换行:cite[1]:cite[7] */
}

::v-deep .wd-popover__pos {
  width: 500rpx;
}

.login-modal {
  background-color: white;
  position: absolute;
  bottom: 0;
  border-top-left-radius: 10rpx;
  border-top-right-radius: 10rpx;
  width: 100%;
  z-index: 10;

  .avatar-button {
    width: 200rpx;
    height: 200rpx;

    .avatar-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 150rpx;
      align-items: center;
      justify-content: center;
      margin: 0 auto;

      .avatar {
        border-radius: 100%;
        width: 100rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
