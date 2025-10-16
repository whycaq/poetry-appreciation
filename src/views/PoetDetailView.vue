<template>
  <div class="poet-detail-view">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <p>加载中...</p>
      </div>

      <div v-else-if="poet" class="poet-detail">
        <!-- 返回按钮 -->
        <div class="back-button">
          <button @click="goBack" class="back-btn">
            ← 返回列表
          </button>
        </div>

        <!-- 诗人信息卡片 -->
        <div class="poet-card">
          <div class="poet-header">
            <div class="poet-image">
              <img :src="poet.image_url" :alt="poet.name" />
            </div>
            <div class="poet-info">
              <h1 class="poet-name">{{ poet.name }}</h1>
              <div class="poet-meta">
                <span class="dynasty-tag">{{ poet.dynasty }}代</span>
                <span class="lifespan">{{ poet.birth_year }} - {{ poet.death_year }}</span>
              </div>
              <p class="birth-place">
                📍 {{ poet.birth_place }}
              </p>
              <div class="poet-stats">
                <div class="stat-box">
                  <span class="stat-number">{{ poet.works_count }}</span>
                  <span class="stat-label">作品数</span>
                </div>
                <div class="stat-box">
                  <span class="stat-number">{{ totalLikes }}</span>
                  <span class="stat-label">总点赞</span>
                </div>
                <div class="stat-box">
                  <span class="stat-number">{{ totalViews }}</span>
                  <span class="stat-label">总浏览</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 诗人简介 -->
          <div class="poet-biography">
            <h3>📚 诗人简介</h3>
            <p>{{ poet.biography }}</p>
          </div>
        </div>

        <!-- 代表作品 -->
        <div class="works-section">
          <div class="section-header">
            <h2>代表作品</h2>
            <span class="works-count">共 {{ worksTotal }} 首</span>
          </div>

          <div v-if="loadingWorks" class="loading-state">
            <p>加载作品中...</p>
          </div>

          <div v-else-if="poetWorks.length === 0" class="empty-state">
            <p>暂无作品</p>
          </div>

          <div v-else class="works-grid">
            <div
              v-for="poem in poetWorks"
              :key="poem.id"
              class="poem-card"
              @click="viewPoem(poem.id)"
            >
              <div class="poem-header">
                <h3 class="poem-title">{{ poem.title }}</h3>
                <span v-if="poem.is_featured" class="featured-badge">精选</span>
              </div>
              <div class="poem-content">
                {{ formatPoemPreview(poem.content) }}
              </div>
              <div class="poem-footer">
                <span class="poem-stats">
                  👁️ {{ poem.views }}
                </span>
                <span class="poem-stats">
                  ❤️ {{ poem.likes }}
                </span>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="worksTotal > pageSize" class="pagination">
            <button 
              @click="prevPage" 
              :disabled="currentPage === 1"
              class="page-btn"
            >
              上一页
            </button>
            <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <p>诗人信息不存在</p>
        <button @click="goBack" class="back-btn">返回</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPoetById, getPoemsByPoetId, type Poet, type Poem } from '../api/poetry'

const route = useRoute()
const router = useRouter()

const poet = ref<Poet | null>(null)
const poetWorks = ref<Poem[]>([])
const loading = ref(true)
const loadingWorks = ref(false)
const currentPage = ref(1)
const pageSize = ref(9)
const worksTotal = ref(0)
const totalLikes = ref(0)
const totalViews = ref(0)

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(worksTotal.value / pageSize.value)
})

// 返回上一页
const goBack = () => {
  router.push('/poets')
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadPoetWorks()
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadPoetWorks()
  }
}

// 格式化诗词预览
const formatPoemPreview = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim())
  return lines.slice(0, 2).join('，') + (lines.length > 2 ? '...' : '')
}

// 查看诗词详情
const viewPoem = (poemId: string) => {
  router.push(`/poetry/${poemId}`)
}

// 加载诗人信息
const loadPoetInfo = async () => {
  const poetId = route.params.id as string
  
  if (!poetId) {
    alert('无效的诗人ID')
    return
  }

  loading.value = true
  try {
    const poetData = await getPoetById(poetId)
    if (poetData) {
      poet.value = poetData
      await loadPoetWorks()
    } else {
      alert('诗人不存在')
    }
  } catch (error) {
    alert('获取诗人信息失败')
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
}

// 加载诗人作品
const loadPoetWorks = async () => {
  if (!poet.value?.id) return

  loadingWorks.value = true
  try {
    const offset = (currentPage.value - 1) * pageSize.value
    const result = await getPoemsByPoetId(poet.value.id, pageSize.value, offset)
    
    poetWorks.value = result.data
    worksTotal.value = result.count
    
    // 计算总点赞和总浏览（从当前页）
    if (currentPage.value === 1 && result.data.length > 0) {
      totalLikes.value = result.data.reduce((sum, poem) => sum + (poem.likes || 0), 0)
      totalViews.value = result.data.reduce((sum, poem) => sum + (poem.views || 0), 0)
    }
  } catch (error) {
    alert('获取作品列表失败')
    console.error('Error:', error)
  } finally {
    loadingWorks.value = false
  }
}

onMounted(() => {
  loadPoetInfo()
})
</script>

<style scoped>
.poet-detail-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.loading-container {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  color: #999;
}

.back-button {
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #2563eb;
}

.back-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* 诗人卡片 */
.poet-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.poet-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.poet-image img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.poet-info {
  flex: 1;
}

.poet-name {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  color: #333;
  font-weight: bold;
}

.poet-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dynasty-tag {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.lifespan {
  font-size: 1.1rem;
  color: #666;
}

.birth-place {
  color: #999;
  margin-bottom: 1.5rem;
}

.poet-stats {
  display: flex;
  gap: 2rem;
}

.stat-box {
  text-align: center;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
}

/* 诗人简介 */
.poet-biography h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.poet-biography p {
  line-height: 1.8;
  color: #555;
  font-size: 1rem;
}

/* 作品列表 */
.works-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.works-count {
  color: #999;
  font-size: 0.9rem;
}

.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #999;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.poem-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.poem-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.poem-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.poem-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  flex: 1;
}

.featured-badge {
  padding: 0.25rem 0.75rem;
  background: #ef4444;
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
}

.poem-content {
  color: #555;
  line-height: 1.8;
  margin-bottom: 1rem;
  min-height: 60px;
}

.poem-footer {
  display: flex;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.85rem;
  color: #999;
}

.poem-stats {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #2563eb;
}

.page-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.error-state {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .poet-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .poet-image img {
    width: 150px;
    height: 150px;
  }

  .poet-name {
    font-size: 2rem;
  }

  .poet-stats {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .stat-box {
    width: 100%;
  }

  .works-grid {
    grid-template-columns: 1fr;
  }
}
</style>
