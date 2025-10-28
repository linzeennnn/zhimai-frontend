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
