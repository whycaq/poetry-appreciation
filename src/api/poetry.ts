import { request } from '@/api'
import type { Poetry, PoetryQueryParams, PaginatedResponse } from '@/types'

/**
 * 诗歌API接口
 */
export const poetryApi = {
  /**
   * 获取诗歌列表
   */
  getPoetryList: (params: PoetryQueryParams): Promise<PaginatedResponse<Poetry>> => {
    return request.get('/poetry', { params })
  },

  /**
   * 获取诗歌详情
   */
  getPoetryDetail: (id: number): Promise<Poetry> => {
    return request.get(`/poetry/${id}`)
  },

  /**
   * 创建诗歌（AI生成）
   */
  createPoetry: (data: {
    theme: string
    style: string
    length: number
    keywords: string[]
  }): Promise<Poetry> => {
    return request.post('/poetry/ai-create', data)
  },

  /**
   * 收藏诗歌
   */
  favoritePoetry: (id: number): Promise<void> => {
    return request.post(`/poetry/${id}/favorite`)
  },

  /**
   * 取消收藏
   */
  unfavoritePoetry: (id: number): Promise<void> => {
    return request.delete(`/poetry/${id}/favorite`)
  },

  /**
   * 获取收藏列表
   */
  getFavorites: (params: PoetryQueryParams): Promise<PaginatedResponse<Poetry>> => {
    return request.get('/poetry/favorites', { params })
  }
}