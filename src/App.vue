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
<!-- Poetry Games -->
<section class="games-section">
<div class="section-container">
<h2 class="section-title">诗词小游戏</h2>
<div class="game-card">
<div class="game-content">
<div class="game-info">
<h3 class="game-title">飞花令</h3>
<p class="game-description">古代文人雅士行酒令时的文字游戏，以"花"字为令，说出含有此字的诗句。</p>
<div class="game-rules">
<h4 class="rules-title">游戏规则</h4>
<ul class="rules-list">
<li>轮流说出含有"花"字的诗句</li>
<li>诗句不能重复</li>
<li>限时 30 秒作答</li>
<li>答错或超时则淘汰</li>
</ul>
</div>
<div class="game-buttons">
<button class="primary-button">开始游戏</button>
<button class="secondary-button">查看排行榜</button>
</div>
</div>
<div class="game-display">
<div class="game-token">
<div class="token-label">令字</div>
<div class="token-character">花</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Footer -->
<footer class="footer-section">
<div class="footer-container">
<div class="footer-grid">
<div class="footer-info">
<h3 class="footer-title">诗韵雅集</h3>
<p class="footer-description">
传承中华文化，弘扬诗词艺术。我们致力于为广大诗词爱好者提供一个交流学习的平台。
</p>
</div>
<div class="footer-links">
<h4 class="footer-subtitle">快速链接</h4>
<ul class="footer-menu">
<li><a href="#" class="footer-link">关于我们</a></li>
<li><a href="#" class="footer-link">联系我们</a></li>
<li><a href="#" class="footer-link">版权声明</a></li>
<li><a href="#" class="footer-link">友情链接</a></li>
</ul>
</div>
<div class="footer-contact">
<h4 class="footer-subtitle">联系我们</h4>
<ul class="footer-menu">
<li class="footer-text">
<i class="fas fa-map-marker-alt"></i>
<span>北京市朝阳区诗词文化中心</span>
</li>
<li class="footer-text">
<i class="fas fa-envelope"></i>
<span>contact@shiyunyaji.com</span>
</li>
<li class="footer-text">
<i class="fas fa-phone"></i>
<span>+86 10 1234 5678</span>
</li>
</ul>
</div>
<div class="footer-social">
<h4 class="footer-subtitle">关注我们</h4>
<div class="social-icons">
<a href="#" class="social-icon"><i class="fab fa-weixin"></i></a>
<a href="#" class="social-icon"><i class="fab fa-weibo"></i></a>
<a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
<a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
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
@keyframes fade-in {
from { opacity: 0; transform: translateY(20px); }
to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
animation: fade-in 1s ease-out;
}
</style>