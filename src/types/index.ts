// 诗歌相关类型定义
export interface Poetry {
  id: number
  title: string
  author: string
  dynasty: string
  content: string
  translation?: string
  appreciation?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// 诗歌列表查询参数
export interface PoetryQueryParams {
  page?: number
  pageSize?: number
  keyword?: string
  dynasty?: string
  author?: string
  tags?: string[]
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  createdAt: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  user: User
}

// AI创作请求
export interface CreatePoetryRequest {
  theme: string
  style: string
  length: number
  keywords: string[]
}

// API响应基础类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}