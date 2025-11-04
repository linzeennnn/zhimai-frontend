import type { PageParams } from '@/types/activity'
import { del, get, post } from '@/utils/request'
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
 */
export function getCollectionListApi(params: PageParams) {
  return get<any>('/activities/user/favorites', params, true)
}

/**
 * 删除用户收藏列表
 */
export function deleteCollectionsApi(params: Array<number>) {
  return post<any>('/activities/user/deleteFavorites', params, true)
}

/**
 * 清空用户收藏列表
 */
export function clearCollectionsApi() {
  return del<any>('/activities/user/clearFavorites', undefined, true)
}

/**
 * 获取用户历史浏览
 */
export function getHistoryListApi(params: PageParams) {
  return get<any>('/activities/user/history', params, true)
}

/**
 * 删除用户历史浏览
 */
export function deleteHistoryApi(params: Array<number>) {
  return post<any>('/activities/user/deleteHistory', params, true)
}

/**
 * 清空用户历史浏览
 */
export function clearHistoryApi() {
  return del<any>('/activities/user/clearHisotry', undefined, true)
}

/**
 * 关闭用户历史浏览
 */
export function closeHistoryApi() {
  return del<any>('/activities/user/closeHisotry', undefined, true)
}
