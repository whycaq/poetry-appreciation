<template>
  <div class="poetry-detail-view">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <div v-else-if="poetry" class="poetry-detail">
        <!-- 返回按钮 -->
        <div class="back-button">
          <el-button @click="goBack" type="primary" link>
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
        </div>

        <!-- 诗歌基本信息 -->
        <div class="poetry-header">
          <h1 class="poetry-title">{{ poetry.title }}</h1>
          <div class="poetry-meta">
            <span class="author">{{ poetry.author }}</span>
            <el-tag type="primary">{{ poetry.dynasty }}</el-tag>
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
          <el-tag
            v-for="tag in poetry.tags"
            :key="tag"
            type="info"
            size="small"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 翻译和赏析 -->
        <div class="poetry-sections">
          <el-collapse v-model="activeNames">
            <el-collapse-item title="诗歌翻译" name="translation">
              <div v-if="poetry.translation" class="section-content">
                {{ poetry.translation }}
              </div>
              <div v-else class="no-data">
                暂无翻译内容
              </div>
            </el-collapse-item>

            <el-collapse-item title="诗歌赏析" name="appreciation">
              <div v-if="poetry.appreciation" class="section-content">
                {{ poetry.appreciation }}
              </div>
              <div v-else class="no-data">
                暂无赏析内容
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <el-button type="primary" @click="handleLike">
            <el-icon><Star /></el-icon>
            收藏
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
        </div>
      </div>

      <div v-else class="error-state">
        <el-empty description="诗歌不存在或已被删除" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Poetry } from '@/types'

const route = useRoute()
const router = useRouter()

const poetry = ref<Poetry | null>(null)
const loading = ref(false)
const activeNames = ref(['translation', 'appreciation'])

// 格式化诗歌内容
const formattedContent = computed(() => {
  if (!poetry.value) return []
  return poetry.value.content.split('\n').filter(line => line.trim())
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 处理收藏
const handleLike = () => {
  ElMessage.success('已添加到收藏')
}

// 处理分享
const handleShare = () => {
  ElMessage.info('分享功能开发中')
}

// 获取诗歌详情
const fetchPoetryDetail = async () => {
  const poetryId = parseInt(route.params.id as string)
  
  if (isNaN(poetryId)) {
    ElMessage.error('无效的诗歌ID')
    return
  }

  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟数据
    poetry.value = {
      id: poetryId,
      title: '静夜思',
      author: '李白',
      dynasty: '唐朝',
      content: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      translation: '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的一轮明月，不由得低头沉思，想起远方的家乡。',
      appreciation: '这首诗写的是在寂静的月夜思念家乡的感受。诗的前两句，是写诗人在作客他乡的特定环境中一刹那间所产生的错觉。一个独处他乡的人，白天奔波忙碌，倒还能冲淡离愁，然而一到夜深人静的时候，心头就难免泛起阵阵思念故乡的波澜。',
      tags: ['思乡', '月亮', '夜晚'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  } catch (error) {
    ElMessage.error('获取诗歌详情失败')
    console.error('Error fetching poetry detail:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPoetryDetail()
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

.loading-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
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

.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #f0f0f0;
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
}

.author {
  font-size: 1.2rem;
  color: #666;
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
}

.poetry-sections {
  margin-bottom: 2rem;
}

.section-content {
  line-height: 1.8;
  color: #555;
  text-indent: 2em;
}

.no-data {
  text-align: center;
  color: #999;
  font-style: italic;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.error-state {
  background: white;
  border-radius: 8px;
  padding: 4rem 2rem;
  text-align: center;
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
}
</style>