<template>
  <div class="quotes-view">
    <div class="page-header">
      <h1>名句赏析</h1>
      <p>品味千古流传的经典诗句，感受中华文化的博大精深</p>
    </div>

    <div class="quotes-container">
      <div class="search-filter">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索名句或关键词..."
            class="search-input"
          />
          <button class="search-btn">搜索</button>
        </div>
        <div class="filter-options">
          <select v-model="selectedTheme" class="filter-select">
            <option value="">所有主题</option>
            <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
          </select>
          <select v-model="selectedDynasty" class="filter-select">
            <option value="">所有朝代</option>
            <option v-for="dynasty in dynasties" :key="dynasty" :value="dynasty">{{ dynasty }}</option>
          </select>
        </div>
      </div>

      <div class="quotes-grid">
        <div v-for="quote in filteredQuotes" :key="quote.id" class="quote-card">
          <div class="quote-content">
            <p class="quote-text">"{{ quote.text }}"</p>
            <div class="quote-meta">
              <span class="author">{{ quote.author }}</span>
              <span class="source">《{{ quote.source }}》</span>
              <span class="dynasty">{{ quote.dynasty }}</span>
            </div>
          </div>
          <div class="quote-analysis">
            <h4>赏析</h4>
            <p>{{ quote.analysis }}</p>
            <div class="quote-tags">
              <span v-for="tag in quote.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="quote-actions">
            <button @click="likeQuote(quote.id)" class="like-btn">
              ❤️ {{ quote.likes }}
            </button>
            <button @click="shareQuote(quote)" class="share-btn">分享</button>
            <button @click="collectQuote(quote.id)" class="collect-btn">收藏</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedTheme = ref('')
const selectedDynasty = ref('')

const themes = ['爱情', '友情', '思乡', '爱国', '自然', '人生', '哲理', '战争']
const dynasties = ['唐代', '宋代', '元代', '明代', '清代', '现代']

const quotes = [
  {
    id: 1,
    text: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    author: '李白',
    source: '静夜思',
    dynasty: '唐代',
    analysis: '这首诗以简洁明快的语言，表达了游子思乡之情。通过月光与霜的比喻，营造出清冷孤寂的意境。',
    tags: ['思乡', '月亮', '简洁'],
    likes: 1560
  },
  {
    id: 2,
    text: '春蚕到死丝方尽，蜡炬成灰泪始干。',
    author: '李商隐',
    source: '无题',
    dynasty: '唐代',
    analysis: '以春蚕、蜡炬为喻，表达了对爱情的坚贞不渝和无私奉献的精神。',
    tags: ['爱情', '奉献', '比喻'],
    likes: 892
  }
]

const filteredQuotes = computed(() => {
  return quotes.filter(quote => {
    const matchesSearch = searchQuery.value === '' || 
      quote.text.includes(searchQuery.value) || 
      quote.author.includes(searchQuery.value) ||
      quote.source.includes(searchQuery.value)
    
    const matchesTheme = selectedTheme.value === '' || quote.tags.includes(selectedTheme.value)
    const matchesDynasty = selectedDynasty.value === '' || quote.dynasty === selectedDynasty.value

    return matchesSearch && matchesTheme && matchesDynasty
  })
})

const likeQuote = (id: number) => {
  const quote = quotes.find(q => q.id === id)
  if (quote) {
    quote.likes++
  }
}

const shareQuote = (quote: any) => {
  const text = `"${quote.text}" —— ${quote.author}《${quote.source}》`
  if (navigator.share) {
    navigator.share({
      title: '经典名句分享',
      text: text,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(text)
    alert('名句已复制到剪贴板！')
  }
}

const collectQuote = (id: number) => {
  console.log('收藏名句:', id)
}
</script>

<style scoped>
.quotes-view {
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

.search-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-box {
  display: flex;
  flex: 1;
}

.search-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px 0 0 6px;
  font-size: 1rem;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0 6px 6px 0;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

.quotes-grid {
  display: grid;
  gap: 1.5rem;
}

.quote-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.quote-text {
  font-size: 1.2rem;
  color: #1f2937;
  font-style: italic;
  margin-bottom: 1rem;
}

.quote-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #6b7280;
}

.quote-analysis h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.quote-analysis p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.quote-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.quote-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.like-btn, .share-btn, .collect-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.like-btn:hover, .share-btn:hover, .collect-btn:hover {
  background-color: #f3f4f6;
}
</style>