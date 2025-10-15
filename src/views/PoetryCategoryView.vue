<template>
  <div class="poetry-category-view">
    <div class="page-header">
      <h1>诗词分类</h1>
      <p>探索不同朝代和风格的经典诗词作品</p>
    </div>

    <div class="categories-container">
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['tab-button', { active: activeCategory === category.id }]"
          @click="activeCategory = category.id"
        >
          {{ category.name }}
        </button>
      </div>

      <div class="category-content">
        <div v-if="activeCategory === 'tang'" class="category-detail">
          <h2>唐诗</h2>
          <p>唐代是中国古典诗歌的黄金时代，涌现出李白、杜甫、白居易等众多杰出诗人。</p>
          <div class="poems-grid">
            <div v-for="poem in tangPoems" :key="poem.id" class="poem-card">
              <h3>{{ poem.title }}</h3>
              <p class="author">{{ poem.author }}</p>
              <p class="excerpt">{{ poem.excerpt }}</p>
              <button @click="viewPoemDetail(poem.id)" class="read-btn">阅读全文</button>
            </div>
          </div>
        </div>

        <div v-if="activeCategory === 'song'" class="category-detail">
          <h2>宋词</h2>
          <p>宋代词作婉约与豪放并存，苏轼、李清照、辛弃疾等词人各领风骚。</p>
          <div class="poems-grid">
            <div v-for="poem in songPoems" :key="poem.id" class="poem-card">
              <h3>{{ poem.title }}</h3>
              <p class="author">{{ poem.author }}</p>
              <p class="excerpt">{{ poem.excerpt }}</p>
              <button @click="viewPoemDetail(poem.id)" class="read-btn">阅读全文</button>
            </div>
          </div>
        </div>

        <div v-if="activeCategory === 'yuan'" class="category-detail">
          <h2>元曲</h2>
          <p>元代戏曲文学的代表，语言通俗，情感真挚，贴近民间生活。</p>
          <div class="poems-grid">
            <div v-for="poem in yuanPoems" :key="poem.id" class="poem-card">
              <h3>{{ poem.title }}</h3>
              <p class="author">{{ poem.author }}</p>
              <p class="excerpt">{{ poem.excerpt }}</p>
              <button @click="viewPoemDetail(poem.id)" class="read-btn">阅读全文</button>
            </div>
          </div>
        </div>

        <div v-if="activeCategory === 'modern'" class="category-detail">
          <h2>现代诗</h2>
          <p>现当代诗人的创新之作，形式自由，意境深远。</p>
          <div class="poems-grid">
            <div v-for="poem in modernPoems" :key="poem.id" class="poem-card">
              <h3>{{ poem.title }}</h3>
              <p class="author">{{ poem.author }}</p>
              <p class="excerpt">{{ poem.excerpt }}</p>
              <button @click="viewPoemDetail(poem.id)" class="read-btn">阅读全文</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const activeCategory = ref('tang')

const categories = [
  { id: 'tang', name: '唐诗' },
  { id: 'song', name: '宋词' },
  { id: 'yuan', name: '元曲' },
  { id: 'modern', name: '现代诗' }
]

const tangPoems = [
  { id: 1, title: '静夜思', author: '李白', excerpt: '床前明月光，疑是地上霜。' },
  { id: 2, title: '春晓', author: '孟浩然', excerpt: '春眠不觉晓，处处闻啼鸟。' },
  { id: 3, title: '登鹳雀楼', author: '王之涣', excerpt: '白日依山尽，黄河入海流。' }
]

const songPoems = [
  { id: 4, title: '水调歌头', author: '苏轼', excerpt: '明月几时有，把酒问青天。' },
  { id: 5, title: '声声慢', author: '李清照', excerpt: '寻寻觅觅，冷冷清清，凄凄惨惨戚戚。' }
]

const yuanPoems = [
  { id: 6, title: '天净沙·秋思', author: '马致远', excerpt: '枯藤老树昏鸦，小桥流水人家。' }
]

const modernPoems = [
  { id: 7, title: '再别康桥', author: '徐志摩', excerpt: '轻轻的我走了，正如我轻轻的来。' }
]

const viewPoemDetail = (id: number) => {
  console.log('查看诗词详情:', id)
}
</script>

<style scoped>
.poetry-category-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.page-header p {
  font-size: 1.2rem;
  color: #6b7280;
}

.category-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.tab-button {
  padding: 1rem 2rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-button:hover {
  color: #3b82f6;
}

.category-detail {
  animation: fadeIn 0.5s ease-in;
}

.category-detail h2 {
  font-size: 2rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.category-detail > p {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.poem-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.poem-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.poem-card h3 {
  font-size: 1.3rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.poem-card .author {
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 1rem;
}

.poem-card .excerpt {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.read-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.read-btn:hover {
  background-color: #2563eb;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>