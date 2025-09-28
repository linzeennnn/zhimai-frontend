import type { LoginParams, UserInfo } from '@/types/user'
import { get, post } from '@/utils/request'

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function getUserInfo() {
  return get<UserInfo>('/user/info')
}

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function loginApi(params: LoginParams) {
  return post<any>('/user/wx-login', params)
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
  return post<{ success: boolean }>('/user/logout')
}

/**
 * 获取用户列表
 * @param params 查询参数
 * @returns 用户列表
 */
export function getUserList(params?: { page?: number, pageSize?: number }) {
  return get<{ list: UserInfo[], total: number }>('/user/list', params)
}
