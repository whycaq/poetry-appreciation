<template>
  <div class="poets-view">
    <div class="page-header">
      <h1>诗人介绍</h1>
      <p>了解历代著名诗人的生平事迹和创作风格</p>
    </div>

    <div class="poets-container">
      <div class="dynasty-filter">
        <button 
          v-for="dynasty in dynasties" 
          :key="dynasty.id"
          :class="['dynasty-btn', { active: activeDynasty === dynasty.id }]"
          @click="activeDynasty = dynasty.id"
        >
          {{ dynasty.name }}
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>

      <div v-else-if="filteredPoets.length === 0" class="empty-state">
        <p>暂无诗人数据</p>
      </div>

      <div v-else class="poets-grid">
        <div v-for="poet in filteredPoets" :key="poet.id" class="poet-card">
          <div class="poet-image">
            <img :src="poet.image_url" :alt="poet.name" />
          </div>
          <div class="poet-info">
            <h2>{{ poet.name }}</h2>
            <p class="dynasty">{{ poet.dynasty }}代</p>
            <p class="lifespan">{{ formatLifespan(poet) }}</p>
            <p class="birth-place">{{ poet.birth_place }}</p>
            <p class="description">{{ poet.biography }}</p>
            <div class="famous-works">
              <h4>作品数量</h4>
              <p class="works-count">{{ poet.works_count }} 首</p>
            </div>
            <button @click="viewPoetDetail(poet.id)" class="detail-btn">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPoets, type Poet } from '../api/poetry'

const router = useRouter()

const activeDynasty = ref('all')
const loading = ref(true)
const allPoets = ref<Poet[]>([])

const dynasties = [
  { id: 'all', name: '全部' },
  { id: '唐', name: '唐代诗人' },
  { id: '宋', name: '宋代词人' },
  { id: '元', name: '元代曲家' }
]

// 加载诗人数据
const loadPoets = async () => {
  loading.value = true
  try {
    const poets = await getPoets()
    allPoets.value = poets
  } catch (error) {
    console.error('加载诗人数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 筛选诗人
const filteredPoets = computed(() => {
  if (activeDynasty.value === 'all') {
    return allPoets.value
  }
  return allPoets.value.filter(poet => poet.dynasty === activeDynasty.value)
})

// 格式化生卒年
const formatLifespan = (poet: Poet) => {
  return `${poet.birth_year}-${poet.death_year}`
}

const viewPoetDetail = (id: string) => {
  router.push(`/poets/${id}`)
}

onMounted(() => {
  loadPoets()
})
</script>

<style scoped>
.poets-view {
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

.dynasty-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.dynasty-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;
  transition: all 0.3s;
}

.dynasty-btn.active {
  border-color: #3b82f6;
  background-color: #3b82f6;
  color: white;
}

.dynasty-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.poet-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.poet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.poet-image {
  height: 200px;
  overflow: hidden;
}

.poet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poet-info {
  padding: 1.5rem;
}

.poet-info h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dynasty {
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.lifespan {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.famous-works h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.birth-place {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-style: italic;
}

.works-count {
  color: #3b82f6;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
  font-size: 1.1rem;
}

.detail-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.detail-btn:hover {
  background-color: #2563eb;
}
</style>