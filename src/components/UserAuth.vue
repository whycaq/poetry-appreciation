<template>
  <div class="auth-container">
    <div v-if="!user" class="auth-buttons">
      <button @click="$emit('showLogin')" class="auth-button login-button">
        登录
      </button>
      <button @click="$emit('showSignup')" class="auth-button signup-button">
        注册
      </button>
    </div>
    
    <div v-else class="user-info">
      <div class="user-avatar">
        <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="头像" />
        <div v-else class="avatar-placeholder">
          {{ userProfile?.username?.charAt(0) || 'U' }}
        </div>
      </div>
      <span class="username">{{ userProfile?.username || '用户' }}</span>
      <button @click="handleSignOut" class="logout-button">退出</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, signOut, type User } from '../api/user'

const emit = defineEmits<{
  showLogin: []
  showSignup: []
}>()

const user = ref<User | null>(null)
const userProfile = ref<any>(null)

// 检查用户登录状态
const checkAuthStatus = async () => {
  try {
    const currentUser = await getCurrentUser()
    user.value = currentUser
    if (currentUser) {
      userProfile.value = {
        username: currentUser.user_metadata?.username || '用户',
        avatar_url: currentUser.user_metadata?.avatar_url
      }
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
  }
}

// 处理退出
const handleSignOut = async () => {
  try {
    await signOut()
    user.value = null
    userProfile.value = null
  } catch (error: any) {
    alert('退出失败: ' + error.message)
  }
}

onMounted(() => {
  checkAuthStatus()
})
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.auth-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.login-button {
  background-color: #3b82f6;
  color: white;
}

.signup-button {
  background-color: #10b981;
  color: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background-color: #6b7280;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.username {
  font-size: 0.875rem;
}

.logout-button {
  padding: 0.25rem 0.5rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}
</style>