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
          :class="['tab-button', { active: activeCategory === category.name }]"
          @click="activeCategory = category.name"
        >
          <span class="category-icon">{{ category.icon_url }}</span> {{ category.name }}
        </button>
      </div>

      <div class="category-content">
        <div v-if="activeCategory" class="category-detail">
          <h2>{{ activeCategory }}</h2>
          <p>{{ categories.find(c => c.name === activeCategory)?.description || '探索经典诗词之美' }}</p>
          
          <div v-if="loading" class="loading-state">
            <p>加载中...</p>
          </div>

          <div v-else-if="poems.length === 0" class="empty-state">
            <p>暂无诗词数据</p>
          </div>

          <div v-else class="poems-grid">
            <div v-for="poem in poems" :key="poem.id" class="poem-card">
              <h3>{{ poem.title }}</h3>
              <p class="author">{{ poem.author }} · {{ poem.dynasty }}</p>
              <p class="excerpt">{{ poem.excerpt }}</p>
              <div class="poem-stats">
                <span>❤️ {{ poem.likes }}</span>
                <span>👁️ {{ poem.views }}</span>
              </div>
              <button @click="viewPoemDetail(poem.id)" class="read-btn">阅读全文</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories, getPoemsByCategory, type Poem } from '../api/poetry'

const router = useRouter()
const activeCategory = ref('')
const categories = ref<any[]>([])
const poems = ref<Poem[]>([])
const loading = ref(true)

// 加载分类数据
const loadCategories = async () => {
  try {
    const categoryData = await getCategories()
    categories.value = categoryData
    if (categoryData.length > 0) {
      activeCategory.value = categoryData[0].name
    }
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 加载诗词数据
const loadPoems = async (category: string) => {
  loading.value = true
  try {
    const result = await getPoemsByCategory(category, 20, 0)
    poems.value = result.data
  } catch (error) {
    console.error('加载诗词失败:', error)
  } finally {
    loading.value = false
  }
}

// 当分类变化时加载诗词
watch(activeCategory, (newCategory) => {
  if (newCategory) {
    loadPoems(newCategory)
  }
})

const viewPoemDetail = (id: string) => {
  router.push(`/poetry/${id}`)
}

onMounted(async () => {
  await loadCategories()
})
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.2rem;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.poem-stats {
  display: flex;
  gap: 1rem;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.read-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.read-btn:hover {
  background-color: #2563eb;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>