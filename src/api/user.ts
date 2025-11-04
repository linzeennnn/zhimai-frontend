import type { LoginParams, SelfInfo } from '@/types/user'
import { get, post, put } from '@/utils/request'

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function loginApi(params: LoginParams) {
  return post<any>('/user/wx-login', params)
}

/**
 * 获取当前用户详细信息
 * @param params 登录参数
 * @returns 登录响应
 */
export function getUserDetailApi() {
  return get<any>('/user/profile', undefined, true)
}

/**
 * 更新当前用户详细信息
 * @param params 登录参数
 * @returns 登录响应
 */
export function setUserDetailApi(params: SelfInfo) {
  return put<any>('/user/profile', params, true)
}

/**
 * 用户登出
 * @returns 登出结果
 */
export function logout() {
  return post<{ success: boolean }>('/user/logout')
}
