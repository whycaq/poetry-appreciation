<template>
  <div class="poetry-list-view">
    <div class="container">
      <!-- 搜索和筛选区域 -->
      <div class="filter-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索诗歌标题、作者或内容..."
          clearable
          @input="handleSearch"
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="filter-actions">
          <el-select
            v-model="selectedDynasty"
            placeholder="选择朝代"
            clearable
            @change="handleFilterChange"
          >
            <el-option
              v-for="dynasty in dynastyOptions"
              :key="dynasty.value"
              :label="dynasty.label"
              :value="dynasty.value"
            />
          </el-select>

          <el-button type="primary" @click="refreshList">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </div>

      <!-- 诗歌列表 -->
      <div class="poetry-list">
        <div v-if="loading" class="loading-container">
          <el-skeleton :rows="6" animated />
        </div>

        <div v-else-if="poetryList.length === 0" class="empty-state">
          <el-empty description="暂无诗歌数据" />
        </div>

        <div v-else class="poetry-grid">
          <div
            v-for="poetry in poetryList"
            :key="poetry.id"
            class="poetry-card"
            @click="viewPoetryDetail(poetry.id)"
          >
            <div class="poetry-header">
              <h3 class="poetry-title">{{ poetry.title }}</h3>
              <el-tag type="info" size="small">{{ poetry.dynasty }}</el-tag>
            </div>
            <p class="poetry-author">{{ poetry.author }}</p>
            <div class="poetry-content">
              {{ formatPoetryPreview(poetry.content) }}
            </div>
            <div class="poetry-footer">
              <span class="poetry-date">{{ formatDate(poetry.createdAt) }}</span>
              <el-button link type="primary" size="small">
                查看详情
              </el-button>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div v-if="poetryList.length > 0" class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { Poetry, PoetryQueryParams } from '@/types'
import { formatDate, getDynastyOptions } from '@/utils'

const router = useRouter()

// 响应式数据
const poetryList = ref<Poetry[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedDynasty = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dynastyOptions = getDynastyOptions()

// 格式化诗歌预览
const formatPoetryPreview = (content: string): string => {
  const lines = content.split('\n').slice(0, 2)
  return lines.join('，') + '...'
}

// 查看诗歌详情
const viewPoetryDetail = (id: number) => {
  router.push(`/poetry/${id}`)
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  fetchPoetryList()
}

// 筛选处理
const handleFilterChange = () => {
  currentPage.value = 1
  fetchPoetryList()
}

// 分页大小变化
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  currentPage.value = 1
  fetchPoetryList()
}

// 当前页变化
const handleCurrentChange = (newPage: number) => {
  currentPage.value = newPage
  fetchPoetryList()
}

// 刷新列表
const refreshList = () => {
  fetchPoetryList()
}

// 获取诗歌列表
const fetchPoetryList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    poetryList.value = [
      {
        id: 1,
        title: '静夜思',
        author: '李白',
        dynasty: '唐朝',
        content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
        tags: ['思乡', '月亮'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: '春晓',
        author: '孟浩然',
        dynasty: '唐朝',
        content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
        tags: ['春天', '自然'],
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z'
      }
    ]
    total.value = 2
  } catch (error) {
    ElMessage.error('获取诗歌列表失败')
    console.error('Error fetching poetry list:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPoetryList()
})
</script>

<style scoped>
.poetry-list-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 筛选区域样式 */
.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-input {
  flex: 1;
  max-width: 400px;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

/* 诗歌列表样式 */
.poetry-list {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
  padding: 2rem 0;
}

.empty-state {
  padding: 4rem 0;
  text-align: center;
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.poetry-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.poetry-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.poetry-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.poetry-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  line-height: 1.4;
}

.poetry-author {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.poetry-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.poetry-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.poetry-date {
  font-size: 0.8rem;
  color: #999;
}

/* 分页样式 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
  }
}
</style>