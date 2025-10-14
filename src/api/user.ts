import { request } from '@/api'
import type { User, LoginRequest, LoginResponse } from '@/types'

/**
 * 用户API接口
 */
export const userApi = {
  /**
   * 用户登录
   */
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return request.post('/auth/login', data)
  },

  /**
   * 用户注册
   */
  register: (data: {
    username: string
    email: string
    password: string
  }): Promise<LoginResponse> => {
    return request.post('/auth/register', data)
  },

  /**
   * 获取用户信息
   */
  getUserInfo: (): Promise<User> => {
    return request.get('/user/info')
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: (data: Partial<User>): Promise<User> => {
    return request.put('/user/info', data)
  },

  /**
   * 刷新token
   */
  refreshToken: (): Promise<{ token: string }> => {
    return request.post('/auth/refresh')
  },

  /**
   * 用户登出
   */
  logout: (): Promise<void> => {
    return request.post('/auth/logout')
  }
}