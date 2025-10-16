<template>
  <div id="app">
    <NavBar @show-login="showLogin = true" @show-signup="showSignup = true" />
    <main class="main-content">
      <router-view />
    </main>

    <!-- 登录模态框 -->
    <div v-if="showLogin" class="modal-overlay" @click="showLogin = false">
      <div class="modal-content" @click.stop>
        <h3>用户登录</h3>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="loginForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginForm.password" type="password" required />
          </div>
          <button type="submit" :disabled="isLoading" class="submit-button">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>
        <button @click="showLogin = false" class="close-button">关闭</button>
      </div>
    </div>

    <!-- 注册模态框 -->
    <div v-if="showSignup" class="modal-overlay" @click="showSignup = false">
      <div class="modal-content" @click.stop>
        <h3>用户注册</h3>
        <form @submit.prevent="handleSignUp">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="signupForm.username" type="text" required />
          </div>
          <div class="form-group">
            <label>邮箱</label>
            <input v-model="signupForm.email" type="email" required />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="signupForm.password" type="password" required />
          </div>
          <button type="submit" :disabled="isLoading" class="submit-button">
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </form>
        <button @click="showSignup = false" class="close-button">关闭</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'
import { signIn, signUp } from './api/user'

const showLogin = ref(false)
const showSignup = ref(false)
const isLoading = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  username: '',
  email: '',
  password: ''
})

// 处理登录
const handleLogin = async () => {
  isLoading.value = true
  try {
    await signIn(loginForm.value.email, loginForm.value.password)
    showLogin.value = false
    loginForm.value = { email: '', password: '' }
    // 刷新页面以更新用户状态
    window.location.reload()
  } catch (error: any) {
    alert('登录失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

// 处理注册
const handleSignUp = async () => {
  isLoading.value = true
  try {
    await signUp(signupForm.value.email, signupForm.value.password, signupForm.value.username)
    alert('注册成功！请检查邮箱验证邮件。')
    showSignup.value = false
    signupForm.value = { username: '', email: '', password: '' }
  } catch (error: any) {
    alert('注册失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* 为固定导航栏留出空间 */
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(0);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.close-button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.5rem;
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
</style>