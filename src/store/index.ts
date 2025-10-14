import { defineStore } from 'pinia'

// 用户信息接口
interface UserInfo {
  id: number
  username: string
  avatar?: string
  email?: string
}

// 应用状态接口
interface AppState {
  // 用户信息
  user: UserInfo | null
  // 主题设置
  theme: 'light' | 'dark'
  // 加载状态
  loading: boolean
  // 错误信息
  error: string | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    user: null,
    theme: 'light',
    loading: false,
    error: null
  }),

  getters: {
    // 用户是否登录
    isLoggedIn: (state) => !!state.user,
    // 获取用户名
    username: (state) => state.user?.username || '游客'
  },

  actions: {
    // 设置用户信息
    setUser(user: UserInfo | null) {
      this.user = user
    },

    // 设置主题
    setTheme(theme: 'light' | 'dark') {
      this.theme = theme
      // 这里可以添加主题切换的逻辑
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    // 设置加载状态
    setLoading(loading: boolean) {
      this.loading = loading
    },

    // 设置错误信息
    setError(error: string | null) {
      this.error = error
    },

    // 清除错误信息
    clearError() {
      this.error = null
    }
  }
})