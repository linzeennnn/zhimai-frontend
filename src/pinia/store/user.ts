export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  function setLoginStatus(val: boolean) {
    isLogin.value = val
  }

  const userProfile = ref<any>({
    nickname: '知脉用户007',
    avatarUrl: '/static/self-center/user-avatar.png'
  })

  function setUserProfile(profile: any) {
    userProfile.value.nickname = profile.nickname
    userProfile.value.avatarUrl = profile.avatarUrl
    userProfile.value.id = profile.id
  }

  return { isLogin, setLoginStatus, userProfile, setUserProfile }
}, {
  persist: true
})
