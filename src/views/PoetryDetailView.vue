<template>
  <div class="poetry-detail-view">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="skeleton">
          <div class="skeleton-line" v-for="n in 10" :key="n"></div>
        </div>
      </div>

      <div v-else-if="poetry" class="poetry-detail">
        <!-- 返回按钮 -->
        <div class="back-button">
          <button @click="goBack" class="back-btn">
            ← 返回列表
          </button>
        </div>

        <!-- 诗歌基本信息 -->
        <div class="poetry-header">
          <div class="header-badges">
            <span v-if="poetry.is_featured" class="badge featured">精选</span>
            <span class="badge difficulty">{{ difficultyText }}</span>
          </div>
          <h1 class="poetry-title">{{ poetry.title }}</h1>
          <div class="poetry-meta">
            <span class="author">{{ poetry.author }}</span>
            <span class="dynasty-badge">{{ poetry.dynasty }}</span>
          </div>
          <div class="poetry-stats">
            <span class="stat-item">
              👁️ {{ poetry.views || 0 }} 浏览
            </span>
            <span class="stat-item">
              ⭐ {{ poetry.likes || 0 }} 点赞
            </span>
          </div>
        </div>

        <!-- 诗歌内容 -->
        <div class="poetry-content">
          <div
            v-for="(line, index) in formattedContent"
            :key="index"
            class="poetry-line"
          >
            {{ line }}
          </div>
        </div>

        <!-- 标签 -->
        <div class="poetry-tags">
          <span
            v-for="tag in poetry.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 🌟 赏析精华（醒目展示） -->
        <div v-if="appreciationSummary" class="appreciation-highlight">
          <div class="highlight-icon">✨</div>
          <div class="highlight-content">
            <h4>赏析精华</h4>
            <p class="highlight-text">{{ appreciationSummary }}</p>
          </div>
        </div>

        <!-- 🎨 深度赏析（核心内容，默认展开） -->
        <div v-if="poetry.appreciation" class="main-appreciation">
          <div class="section-title">
            <h3>
              <span class="title-icon">🎨</span>
              深度赏析
            </h3>
            <span class="reading-badge">精品阅读</span>
          </div>
          <div class="appreciation-content">
            <p v-for="(paragraph, index) in appreciationParagraphs" :key="index" class="appreciation-paragraph">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- 📖 诗词翻译（辅助内容，可折叠） -->
        <div class="translation-section">
          <div class="section-header" @click="showTranslation = !showTranslation">
            <span>📖 现代翻译</span>
            <span class="toggle-icon">{{ showTranslation ? '−' : '+' }}</span>
          </div>
          <div v-if="showTranslation" class="section-content">
            <div v-if="poetry.translation">
              {{ poetry.translation }}
            </div>
            <div v-else class="no-data">
              暂无翻译内容
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button 
            :class="['like-btn', isLiked ? 'liked' : '']" 
            @click="handleLike"
          >
            {{ isLiked ? '❤️ 已点赞' : '🤍 点赞' }}
          </button>
          <button @click="handleShare" class="share-btn">
            📤 分享
          </button>
        </div>
      </div>

      <div v-else class="error-state">
        <div class="empty-state">
          <p>诗歌不存在或已被删除</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPoemById, recordPoemView, toggleLike, checkUserLike, type Poem } from '../api/poetry'
import { getCurrentUser } from '../api/user'

const route = useRoute()
const router = useRouter()

const poetry = ref<any>(null)
const loading = ref(false)
const isLiked = ref(false)
const currentUserId = ref<string | null>(null)
const showTranslation = ref(false) // 翻译默认折叠

// 格式化诗歌内容
const formattedContent = computed(() => {
  if (!poetry.value) return []
  return poetry.value.content.split('\n').filter(line => line.trim())
})

// 获取难度等级文本
const difficultyText = computed(() => {
  const level = poetry.value?.difficulty_level || 1
  const texts = ['', '入门', '初级', '中级', '高级', '专家']
  return texts[level] || '入门'
})

// 赏析精华（从赏析中提取第一句或生成）
const appreciationSummary = computed(() => {
  if (!poetry.value?.appreciation) return ''
  const text = poetry.value.appreciation
  const firstSentence = text.split('。')[0]
  return firstSentence.length > 50 ? firstSentence.substring(0, 50) + '...' : firstSentence + '。'
})

// 分段显示赏析内容
const appreciationParagraphs = computed(() => {
  if (!poetry.value?.appreciation) return []
  return poetry.value.appreciation.split('。').filter(p => p.trim()).map(p => p + '。')
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换章节显示
const toggleSection = (section: keyof typeof activeSections) => {
  activeSections[section] = !activeSections[section]
}

// 智能点赞/取消点赞
const handleLike = async () => {
  if (!currentUserId.value) {
    alert('请先登录')
    return
  }
  
  if (!poetry.value?.id) return
  
  try {
    const newStatus = await toggleLike(currentUserId.value, poetry.value.id)
    isLiked.value = newStatus
    
    // 更新点赞数
    if (newStatus) {
      poetry.value.likes += 1
      alert('点赞成功')
    } else {
      poetry.value.likes -= 1
      alert('已取消点赞')
    }
  } catch (error) {
    console.error('点赞失败:', error)
    alert('点赞失败，请重试')
  }
}

// 处理分享
const handleShare = () => {
  alert('分享功能开发中')
}

// 检查用户登录状态
const checkUserAuth = async () => {
  try {
    const user = await getCurrentUser()
    if (user) {
      currentUserId.value = user.id
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取诗歌详情
const fetchPoetryDetail = async () => {
  const poetryId = route.params.id as string
  
  if (!poetryId) {
    alert('无效的诗歌ID')
    return
  }

  loading.value = true
  try {
    // 获取诗词详情
    const poem = await getPoemById(poetryId)
    
    if (poem) {
      poetry.value = poem
      
      // 使用新的浏览记录函数（支持登录用户）
      await recordPoemView(poetryId, currentUserId.value || undefined)
      
      // 检查用户是否已点赞
      if (currentUserId.value) {
        isLiked.value = await checkUserLike(currentUserId.value, poetryId)
      }
    } else {
      alert('诗歌不存在')
    }
  } catch (error) {
    alert('获取诗歌详情失败')
    console.error('Error fetching poetry detail:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await checkUserAuth()
  await fetchPoetryDetail()
})
</script>

<style scoped>
.poetry-detail-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 加载状态样式 */
.loading-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
}

.skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-line {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.poetry-detail {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button {
  margin-bottom: 2rem;
}

.back-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #2563eb;
}

.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.header-badges {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.badge.featured {
  background: #ef4444;
  color: white;
}

.badge.difficulty {
  background: #f59e0b;
  color: white;
}

.poetry-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: 700;
}

.poetry-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author {
  font-size: 1.2rem;
  color: #666;
}

.dynasty-badge {
  background: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.poetry-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  color: #999;
  font-size: 0.9rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.poetry-content {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 8px;
}

.poetry-line {
  font-size: 1.3rem;
  line-height: 2.5;
  color: #333;
  font-family: '楷体', 'KaiTi', serif;
}

.poetry-tags {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tag {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

/* 🌟 赏析精华高亮区 */
.appreciation-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: fadeInUp 0.6s ease-out;
}

.highlight-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.highlight-content h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
}

.highlight-text {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.8;
  font-weight: 500;
}

/* 🎨 主要赏析区域 */
.main-appreciation {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 3px solid #e0e7ff;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #3b82f6;
}

.section-title h3 {
  margin: 0;
  font-size: 1.6rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
}

.title-icon {
  font-size: 2rem;
}

.reading-badge {
  padding: 0.5rem 1rem;
  background: #fef3c7;
  color: #d97706;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.appreciation-content {
  background: #fafafa;
  padding: 2rem;
  border-radius: 12px;
}

.appreciation-paragraph {
  color: #333;
  line-height: 2.2;
  font-size: 1.05rem;
  margin: 0 0 1.5rem 0;
  text-indent: 2em;
  letter-spacing: 0.5px;
}

.appreciation-paragraph:last-child {
  margin-bottom: 0;
}

/* 📖 翻译区域（次要，可折叠） */
.translation-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  padding: 0.5rem 0;
  transition: color 0.3s;
}

.section-header:hover {
  color: #3b82f6;
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: bold;
  color: #999;
}

.section-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  color: #555;
  line-height: 1.8;
}

.no-data {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 1rem 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.like-btn, .share-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.like-btn {
  background: #3b82f6;
  color: white;
}

.like-btn.liked {
  background: #ef4444;
}

.like-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.share-btn {
  background: #10b981;
  color: white;
}

.share-btn:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.error-state {
  background: white;
  border-radius: 8px;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state {
  color: #6b7280;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .poetry-title {
    font-size: 2rem;
  }
  
  .poetry-line {
    font-size: 1.1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .poetry-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>