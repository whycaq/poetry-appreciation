<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <img src="https://ai-public.mastergo.com/ai/img_res/ff89d1978b49aa825c5bdd36fff9d1d9.jpg" alt="Logo" class="logo">
          <span class="brand-text">诗韵雅集</span>
        </router-link>
      </div>
      
      <div class="nav-links">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/poetry" class="nav-link">诗词分类</router-link>
        <router-link to="/poets" class="nav-link">诗人介绍</router-link>
        <router-link to="/quotes" class="nav-link">名句赏析</router-link>
        <router-link to="/create" class="nav-link">诗词创作</router-link>
      </div>
      
      <div class="nav-user">
        <UserAuth />
      </div>
      
      <div class="mobile-menu">
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="isMobileMenuOpen" class="mobile-nav-links">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">首页</router-link>
      <router-link to="/poetry" class="mobile-nav-link" @click="closeMobileMenu">诗词分类</router-link>
      <router-link to="/poets" class="mobile-nav-link" @click="closeMobileMenu">诗人介绍</router-link>
      <router-link to="/quotes" class="mobile-nav-link" @click="closeMobileMenu">名句赏析</router-link>
      <router-link to="/create" class="mobile-nav-link" @click="closeMobileMenu">诗词创作</router-link>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import UserAuth from './UserAuth.vue'

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.nav-brand .brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  margin-right: 0.75rem;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background-color: #3b82f6;
  border-radius: 1px;
}

.nav-user {
  display: flex;
  align-items: center;
}

.mobile-menu {
  display: none;
}

.mobile-menu-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-nav-links {
  display: none;
  flex-direction: column;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.mobile-nav-link {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: #6b7280;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.3s;
}

.mobile-nav-link:hover {
  background-color: #f9fafb;
  color: #3b82f6;
}

.mobile-nav-link.router-link-active {
  color: #3b82f6;
  background-color: #f0f9ff;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .mobile-nav-links {
    display: flex;
  }
  
  .nav-container {
    padding: 0 1rem;
  }
}
</style>