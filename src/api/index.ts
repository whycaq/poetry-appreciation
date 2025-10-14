import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// API响应接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 创建axios实例
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加token到请求头
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      
      // 显示加载状态
      // 这里可以添加全局loading状态管理
      
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      
      // 业务逻辑错误处理
      if (data.code !== 200) {
        ElMessage.error(data.message || '请求失败')
        return Promise.reject(new Error(data.message || '请求失败'))
      }
      
      return data.data
    },
    (error) => {
      // HTTP错误处理
      let message = '网络错误，请稍后重试'
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            message = '未授权，请重新登录'
            // 清除token并跳转到登录页
            localStorage.removeItem('token')
            window.location.href = '/login'
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求的资源不存在'
            break
          case 500:
            message = '服务器内部错误'
            break
          default:
            message = error.response.data?.message || `请求失败: ${error.response.status}`
        }
      } else if (error.request) {
        message = '网络连接失败，请检查网络设置'
      } else {
        message = error.message
      }
      
      ElMessage.error(message)
      return Promise.reject(error)
    }
  )

  return instance
}

// 创建API实例
const api = createAxiosInstance()

// 封装通用请求方法
export const request = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.get(url, config)
  },
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return api.post(url, data, config)
  },
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return api.put(url, data, config)
  },
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return api.delete(url, config)
  }
}

export default api