<template>
  <div class="home-view">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container">
        <div class="logo">
          <h1>AI诗歌鉴赏</h1>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/poetry" class="nav-link">诗歌鉴赏</router-link>
          <router-link to="/create" class="nav-link">AI创作</router-link>
        </nav>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="main">
      <div class="hero-section">
        <div class="container">
          <h2 class="hero-title">探索诗歌的无限可能</h2>
          <p class="hero-description">
            基于人工智能的诗歌鉴赏与创作平台，让您感受古典诗词的魅力，体验现代科技的创新。
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="goToPoetryList">
              开始鉴赏
            </el-button>
            <el-button size="large" @click="goToCreate">
              AI创作
            </el-button>
          </div>
        </div>
      </div>

      <!-- 功能特色 -->
      <section class="features-section">
        <div class="container">
          <h3 class="section-title">平台特色</h3>
          <div class="features-grid">
            <div class="feature-card">
              <el-icon class="feature-icon"><Reading /></el-icon>
              <h4>诗歌鉴赏</h4>
              <p>丰富的古典诗歌库，包含详细的注释和赏析</p>
            </div>
            <div class="feature-card">
              <el-icon class="feature-icon"><Edit /></el-icon>
              <h4>AI创作</h4>
              <p>智能生成符合格律的诗歌，支持多种风格选择</p>
            </div>
            <div class="feature-card">
              <el-icon class="feature-icon"><Search /></el-icon>
              <h4>智能搜索</h4>
              <p>快速找到您感兴趣的诗歌和作者</p>
            </div>
            <div class="feature-card">
              <el-icon class="feature-icon"><Collection /></el-icon>
              <h4>个人收藏</h4>
              <p>收藏喜欢的诗歌，创建个人诗集</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 AI诗歌鉴赏平台. 保留所有权利.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPoetryList = () => {
  router.push('/poetry')
}

const goToCreate = () => {
  router.push('/create')
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 头部样式 */
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 20px;
}

.logo h1 {
  color: #409eff;
  font-size: 1.5rem;
  margin: 0;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #409eff;
}

/* 英雄区域样式 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* 功能特色样式 */
.features-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  color: #409eff;
  margin-bottom: 1rem;
}

.feature-card h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 页脚样式 */
.footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 2rem 0;
  margin-top: auto;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .nav {
    gap: 1rem;
  }
}
</style>