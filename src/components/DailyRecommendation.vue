<template>
  <div class="daily-recommendation">
    <div class="recommendation-header">
      <h3>
        ✨ 每日赏析
      </h3>
      <span class="date">{{ formattedDate }}</span>
    </div>

    <div v-if="loading" class="loading-state">
      <el-skeleton :rows="3" animated />
    </div>

    <div v-else-if="recommendedPoem" class="poem-card" @click="viewPoem">
      <div class="poem-content">
        <h4 class="poem-title">{{ recommendedPoem.title }}</h4>
        <p class="poem-author">{{ recommendedPoem.author }} · {{ recommendedPoem.dynasty }}</p>
        <div class="poem-excerpt">
          {{ recommendedPoem.excerpt }}
        </div>
      </div>
      
      <!-- 🌟 赏析精华展示 -->
      <div v-if="appreciationPreview" class="appreciation-highlight">
        <div class="highlight-header">
          <span class="highlight-icon">💭</span>
          <span class="highlight-title">赏析精华</span>
        </div>
        <p class="highlight-content">{{ appreciationPreview }}</p>
      </div>
      
      <div v-if="reason" class="recommendation-reason">
        💡 {{ reason }}
      </div>

      <div class="poem-actions">
        <button class="primary-action-btn" @click.stop="viewPoem">
          深度赏析 →
        </button>
        <button class="secondary-action-btn" @click.stop="refreshRecommendation">
          🔄 换一首
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>暂无推荐</p>
      <el-button size="small" @click="refreshRecommendation">刷新</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getFeaturedPoems, type Poem } from '../api/poetry'

const router = useRouter()
const loading = ref(true)
const recommendedPoem = ref<Poem | null>(null)
const reason = ref('')

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
})

// 赏析预览（从数据库获取）
const appreciationPreview = computed(() => {
  if (!recommendedPoem.value || !(recommendedPoem.value as any).appreciation) return ''
  const appreciation = (recommendedPoem.value as any).appreciation
  const firstSentence = appreciation.split('。')[0]
  return firstSentence.length > 80 ? firstSentence.substring(0, 80) + '...' : firstSentence + '。'
})

// 获取推荐诗词
const loadRecommendation = async () => {
  loading.value = true
  try {
    const poems = await getFeaturedPoems(10)
    if (poems && poems.length > 0) {
      // 随机选择一首
      const randomIndex = Math.floor(Math.random() * poems.length)
      recommendedPoem.value = poems[randomIndex]
      
      // 生成推荐理由
      generateReason()
    }
  } catch (error) {
    console.error('加载推荐失败:', error)
  } finally {
    loading.value = false
  }
}

// 生成推荐理由
const generateReason = () => {
  if (!recommendedPoem.value) return
  
  const reasons = [
    '这首诗意境优美，适合今日品读',
    '经典之作，值得反复品味',
    `${recommendedPoem.value.author}的代表作之一`,
    '今日精选，不容错过',
    '最受欢迎的诗词之一'
  ]
  
  reason.value = reasons[Math.floor(Math.random() * reasons.length)]
}

// 查看诗词详情
const viewPoem = () => {
  if (recommendedPoem.value) {
    router.push(`/poetry/${recommendedPoem.value.id}`)
  }
}

// 刷新推荐
const refreshRecommendation = () => {
  loadRecommendation()
}

onMounted(() => {
  loadRecommendation()
})
</script>

<style scoped>
.daily-recommendation {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.recommendation-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.date {
  color: #999;
  font-size: 0.9rem;
}

.poem-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.poem-card:hover {
  transform: translateY(-2px);
}

.poem-content {
  margin-bottom: 1rem;
}

.poem-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  color: #333;
  font-weight: 600;
}

.poem-author {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
}

.poem-excerpt {
  color: #555;
  line-height: 1.8;
  font-size: 0.95rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

/* 🌟 赏析精华高亮 */
.appreciation-highlight {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 4px solid #7c3aed;
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #6b21a8;
  font-size: 0.9rem;
}

.highlight-icon {
  font-size: 1.2rem;
}

.highlight-content {
  color: #581c87;
  line-height: 1.8;
  font-size: 0.95rem;
  margin: 0;
  font-style: italic;
}

.recommendation-reason {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #fff7ed;
  border-radius: 8px;
  color: #ea580c;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.poem-actions {
  display: flex;
  gap: 0.5rem;
}

.primary-action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
}

.primary-action-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.secondary-action-btn {
  padding: 0.75rem 1rem;
  background: white;
  color: #666;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.secondary-action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.loading-state,
.empty-state {
  padding: 2rem;
  text-align: center;
  color: #999;
}

@media (max-width: 768px) {
  .poem-actions {
    flex-direction: column;
  }
  
  .poem-actions .el-button {
    width: 100%;
  }
}
</style>


