<!-- 代码已包含 CSS：使用 TailwindCSS , 安装 TailwindCSS 后方可看到布局样式效果 -->
<template>
<div class="app-container">
<!-- Navigation Bar -->
<nav>
<div class="nav-container">
<div class="nav-brand">
<img src="https://ai-public.mastergo.com/ai/img_res/ff89d1978b49aa825c5bdd36fff9d1d9.jpg" alt="Logo" class="logo">
<span class="brand-text">诗韵雅集</span>
</div>
<div class="nav-links">
<a href="#" class="nav-link">首页</a>
<a href="#" class="nav-link">诗词分类</a>
<a href="#" class="nav-link">诗人介绍</a>
<a href="#" class="nav-link">名句赏析</a>
<a href="#" class="nav-link">诗词创作</a>
</div>
<div class="mobile-menu">
<button class="mobile-menu-btn">
<i class="fas fa-bars"></i>
</button>
</div>
</div>
</nav>
<!-- Hero Section -->
<section class="hero-section"
style="background-image: url('https://ai-public.mastergo.com/ai/img_res/df5b4ab55badfbd2d7311d233ab8f975.jpg');">
<div class="hero-overlay"></div>
<div class="hero-content">
<h1 class="hero-title">
山重水复疑无路，柳暗花明又一村
</h1>
<p class="hero-description">
探索千年诗词之美，感受古人情怀之深。在这里，每一首诗都是一个故事，每一个词都承载着历史的记忆。
</p>
<button class="hero-button">
开始探索
</button>
</div>
</section>
<!-- Poetry Categories -->
<section class="categories-section">
<div class="section-container">
<h2 class="section-title">诗词分类</h2>
<div class="categories-grid">
<div class="category-card">
<div class="category-image">
<img src="https://ai-public.mastergo.com/ai/img_res/6cef988e86519aeee312b949c3c77f80.jpg"
alt="唐诗" class="category-img">
</div>
<div class="category-content">
<h3 class="category-title">唐诗</h3>
<p class="category-description">盛唐气象，诗中有画，画中有诗</p>
</div>
</div>
<div class="category-card">
<div class="category-image">
<img src="https://ai-public.mastergo.com/ai/img_res/366643f2817681373d9f22ee88d7d419.jpg"
alt="宋词" class="category-img">
</div>
<div class="category-content">
<h3 class="category-title">宋词</h3>
<p class="category-description">婉约豪放并存，情致深远</p>
</div>
</div>
<div class="category-card">
<div class="category-image">
<img src="https://ai-public.mastergo.com/ai/img_res/2e7425258b29069ccb11441db8c4f5ec.jpg"
alt="元曲" class="category-img">
</div>
<div class="category-content">
<h3 class="category-title">元曲</h3>
<p class="category-description">民间艺术精华，通俗而深刻</p>
</div>
</div>
<div class="category-card">
<div class="category-image">
<img src="https://ai-public.mastergo.com/ai/img_res/b79358797d23ee092612a1aea57b353b.jpg"
alt="古风" class="category-img">
</div>
<div class="category-content">
<h3 class="category-title">古风</h3>
<p class="category-description">承古韵之雅，创新意之妙</p>
</div>
</div>
</div>
</div>
</section>
<!-- Popular Poems -->
<section class="popular-section">
<div class="section-container">
<div class="section-header">
<h2 class="section-title">热门诗词推荐</h2>
<a href="#" class="view-more-link">查看更多</a>
</div>
<Swiper
:modules="swiperModules"
:slides-per-view="1"
:space-between="20"
:breakpoints="{
640: { slidesPerView: 2 },
1024: { slidesPerView: 3 }
}"
:pagination="{ clickable: true }"
:autoplay="{ delay: 5000 }"
class="popular-swiper"
>
<SwiperSlide v-for="poem in popularPoems" :key="poem.id">
<div class="poem-card">
<div class="poem-header">
<h3 class="poem-title">{{ poem.title }}</h3>
<span class="poem-dynasty">{{ poem.dynasty }}</span>
</div>
<p class="poem-author">{{ poem.author }}</p>
<p class="poem-excerpt">"{{ poem.excerpt }}"</p>
<div class="poem-footer">
<span class="poem-likes">{{ poem.likes }} 赞</span>
<button class="view-details-btn">查看详情</button>
</div>
</div>
</SwiperSlide>
</Swiper>
</div>
</section>
<!-- Poetry Creation -->
<section class="creation-section">
<div class="section-container">
<div class="creation-banner">
<div class="creation-content">
<h2 class="creation-title">诗词创作互动</h2>
<p class="creation-description">
今日诗题：<span class="poem-topic">秋思</span><br>
秋风萧瑟天气凉，草木摇落露为霜。请以"秋思"为主题创作一首诗词。
</p>
<div class="creation-buttons">
<button class="primary-button">
我要写诗
</button>
<button class="secondary-button">
查看作品
</button>
</div>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="site-footer">
<div class="footer-container">
<div class="footer-grid">
<div class="footer-column">
<h3 class="footer-title">诗韵雅集</h3>
<p class="footer-description">
传承中华文化，弘扬诗词艺术。我们致力于为广大诗词爱好者提供一个交流学习的平台。
</p>
</div>
<div class="footer-column">
<h4 class="footer-subtitle">快速链接</h4>
<ul class="footer-links">
<li><a href="#" class="footer-link">关于我们</a></li>
<li><a href="#" class="footer-link">联系我们</a></li>
<li><a href="#" class="footer-link">版权声明</a></li>
<li><a href="#" class="footer-link">友情链接</a></li>
</ul>
</div>
<div class="footer-column">
<h4 class="footer-subtitle">联系我们</h4>
<ul class="contact-info">
<li class="contact-item">
<i class="fas fa-map-marker-alt"></i>
<span>北京市朝阳区诗词文化中心</span>
</li>
<li class="contact-item">
<i class="fas fa-envelope"></i>
<span>contact@shiyunyaji.com</span>
</li>
<li class="contact-item">
<i class="fas fa-phone"></i>
<span>+86 10 1234 5678</span>
</li>
</ul>
</div>
<div class="footer-column">
<h4 class="footer-subtitle">关注我们</h4>
<div class="social-links">
<a href="#" class="social-link"><i class="fab fa-weixin"></i></a>
<a href="#" class="social-link"><i class="fab fa-weibo"></i></a>
<a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
<a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
</div>
</div>
</div>
<div class="footer-bottom">
<p>&copy; 2023 诗韵雅集. 保留所有权利. | 京ICP备12345678号</p>
</div>
</div>
</footer>
</div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const swiperModules = [Pagination, Autoplay];
// Popular poems data
const popularPoems = ref([
{
id: 1,
title: "静夜思",
author: "李白",
dynasty: "唐",
excerpt: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
likes: 1245
},
{
id: 2,
title: "水调歌头",
author: "苏轼",
dynasty: "宋",
excerpt: "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。",
likes: 987
},
{
id: 3,
title: "春晓",
author: "孟浩然",
dynasty: "唐",
excerpt: "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
likes: 876
},
{
id: 4,
title: "念奴娇·赤壁怀古",
author: "苏轼",
dynasty: "宋",
excerpt: "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。",
likes: 765
},
{
id: 5,
title: "登鹳雀楼",
author: "王之涣",
dynasty: "唐",
excerpt: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
likes: 654
}
]);
onMounted(() => {
// Add any initialization code here
});
</script>
<style scoped>
/* 基础样式 */
.app-container {
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 全局图片控制 */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* 导航栏样式 */
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
}

.brand-text {
  font-size: 1.25rem;
  font-family: serif;
  color: #374151;
}

.nav-links {
  display: none;
  gap: 2rem;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
}

.mobile-menu {
  display: block;
}

.mobile-menu-btn {
  color: #374151;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn i {
  font-size: 1.25rem;
}

/* Hero 区域样式 */
.hero-section {
  position: relative;
  padding-top: 6rem;
  padding-bottom: 5rem;
  background-size: cover;
  background-position: center;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero-title {
  font-size: 2.25rem;
  font-family: serif;
  color: white;
  margin-bottom: 1.5rem;
  animation: fade-in 1s ease-out;
}

.hero-description {
  font-size: 1.125rem;
  color: white;
  max-width: 42rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-button {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  transform: translateY(0);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-button:hover {
  background: linear-gradient(to right, #2563eb, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

/* 通用区域样式 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 1.875rem;
  font-family: serif;
  text-align: center;
  color: #374151;
  margin-bottom: 3rem;
}

/* 分类区域样式 */
.categories-section {
  padding: 4rem 0;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.category-card {
  background: #f9fafb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-image {
  height: 12rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
}

.category-content {
  padding: 1.5rem;
}

.category-title {
  font-size: 1.25rem;
  font-family: serif;
  color: #374151;
  margin-bottom: 0.5rem;
}

.category-description {
  color: #6b7280;
  line-height: 1.5;
}

/* 热门诗词样式 */
.popular-section {
  padding: 4rem 0;
  background: #f9fafb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-more-link {
  color: #3b82f6;
  text-decoration: none;
}

.view-more-link:hover {
  text-decoration: underline;
}

.poem-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: 100%;
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.poem-title {
  font-size: 1.25rem;
  font-family: serif;
  color: #374151;
}

.poem-dynasty {
  font-size: 0.875rem;
  color: #6b7280;
}

.poem-author {
  color: #6b7280;
  margin-bottom: 1rem;
}

.poem-excerpt {
  color: #374151;
  font-style: italic;
  line-height: 1.5;
}

.poem-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-likes {
  font-size: 0.875rem;
  color: #6b7280;
}

.view-details-btn {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
}

.view-details-btn:hover {
  text-decoration: underline;
}

/* 创作区域样式 */
.creation-section {
  padding: 4rem 0;
  background: white;
}

.creation-banner {
  background: linear-gradient(to right, #eff6ff, #e0e7ff);
  border-radius: 1rem;
  padding: 2rem;
}

.creation-content {
  max-width: 48rem;
  margin: 0 auto;
  text-align: center;
}

.creation-title {
  font-size: 1.875rem;
  font-family: serif;
  color: #374151;
  margin-bottom: 1rem;
}

.creation-description {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.poem-topic {
  font-weight: 600;
  color: #3b82f6;
}

.creation-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
}

.primary-button {
  background: linear-gradient(to right, #3b82f6, #6366f1);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.primary-button:hover {
  background: linear-gradient(to right, #2563eb, #4f46e5);
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.secondary-button {
  border: 1px solid #3b82f6;
  color: #3b82f6;
  background: transparent;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.secondary-button:hover {
  background: linear-gradient(to right, #eff6ff, #e0e7ff);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 页脚样式 */
.site-footer {
  background: #1f2937;
  color: white;
  padding-top: 4rem;
  padding-bottom: 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-column {
  margin-bottom: 1rem;
}

.footer-title {
  font-size: 1.25rem;
  font-family: serif;
  margin-bottom: 1rem;
}

.footer-description {
  color: #9ca3af;
  line-height: 1.5;
}

.footer-subtitle {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: white;
}

.contact-info {
  list-style: none;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  color: #9ca3af;
}

.contact-item i {
  margin-top: 0.25rem;
  margin-right: 0.5rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #9ca3af;
  font-size: 1.25rem;
  transition: color 0.2s;
}

.social-link:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 2rem;
  text-align: center;
  color: #9ca3af;
}

/* Swiper 样式 */
.popular-swiper {
  padding-bottom: 40px;
}

.popular-swiper ::v-deep(.swiper-pagination-bullet) {
  background-color: #3b82f6;
  opacity: 1;
}

.popular-swiper ::v-deep(.swiper-pagination-bullet-active) {
  background-color: #2563eb;
}

/* 动画 */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 响应式设计 */
@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
  
  .mobile-menu {
    display: none;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .creation-buttons {
    flex-direction: row;
  }
  
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .creation-banner {
    padding: 3rem;
  }
}
</style>