/**
 * 用户信息接口返回类型
 */
export interface UserInfo {
  id: string
  username: string
  avatar: string
  [key: string]: any
}

/**
 * 用户个人信息类型
 */
export interface SelfInfo {
  avatarUrl: string | undefined // 头像
  nickname: string | undefined // 昵称
  email: string | undefined // 邮箱
  phone: string | undefined // 电话
  campus: string | undefined // 校区
  grade: number | string // 年级
  major: string | undefined // 专业
  college: string | undefined // 学院
}

/**
 * 登录参数类型
 */
export interface LoginParams {
  code: string
  nickname: string
  avatarUrl: string
}

/**
 * 登录响应类型
 */
export interface LoginResponse {
  token: string
  user: UserInfo
}
