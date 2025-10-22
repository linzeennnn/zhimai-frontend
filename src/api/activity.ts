import { get } from '@/utils/request'

/**
 * 获取用户提醒列表
 * @param params 请求参数
 * @returns 响应
 */
export function getRemindListApi() {
  return get<any>('/reminders', undefined, true)
}

/**
 * 获取用户收藏列表
 * @param params 请求参数
 * @returns 响应
 */
export function getCollectionListApi() {
  return get<any>('/activities/user/favorites', undefined, true)
}
