<template>
  <div class="home-view">
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
          <router-link to="/poetry" class="view-more-link">查看更多</router-link>
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
                <button class="view-details-btn" @click="handleLikePoem(poem.id)">点赞</button>
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
              <router-link to="/create" class="primary-button">
                我要写诗
              </router-link>
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
                <button class="primary-button" @click="showGameModal = true">开始游戏</button>
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
  </div>

  <!-- 诗词游戏模态框 -->
  <div v-if="showGameModal" class="modal-overlay" @click="showGameModal = false">
    <div class="modal-content large" @click.stop>
      <button class="close-modal" @click="showGameModal = false">×</button>
      <PoetryGame />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { getPopularPoems, likePoem, type Poem } from '../api/poetry';
import PoetryGame from '../components/PoetryGame.vue';

const swiperModules = [Pagination, Autoplay];

// 动态热门诗词数据
const popularPoems = ref<Poem[]>([]);
const isLoading = ref(true);
const showGameModal = ref(false);

// 加载热门诗词
const loadPopularPoems = async () => {
  isLoading.value = true;
  try {
    const poems = await getPopularPoems(8);
    popularPoems.value = poems;
  } catch (error) {
    console.error('加载热门诗词失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 点赞诗词
const handleLikePoem = async (poemId: string) => {
  try {
    await likePoem(poemId);
    // 更新本地数据
    const poem = popularPoems.value.find(p => p.id === poemId);
    if (poem) {
      poem.likes += 1;
    }
  } catch (error) {
    console.error('点赞失败:', error);
  }
};

onMounted(() => {
  loadPopularPoems();
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  position: relative;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
}

.close-modal:hover {
  color: #374151;
}

.primary-button {
  text-decoration: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #3b82f6;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.primary-button:hover {
  background-color: #2563eb;
}
</style>