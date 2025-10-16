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
              <div class="header-tags">
                <el-tag v-if="poetry.is_featured" type="danger" size="small">精选</el-tag>
                <el-tag type="info" size="small">{{ poetry.dynasty }}</el-tag>
              </div>
            </div>
            <p class="poetry-author">{{ poetry.author }}</p>
            <div class="poetry-content">
              {{ formatPoetryPreview(poetry.content) }}
            </div>
            
            <!-- 🌟 赏析预览（新增） -->
            <div v-if="poetry.appreciation" class="appreciation-preview">
              <span class="preview-label">💭 赏析：</span>
              <span class="preview-text">{{ formatAppreciationPreview(poetry.appreciation) }}</span>
            </div>
            
            <div class="poetry-footer">
              <div class="poetry-stats">
                <span class="poetry-likes">❤️ {{ poetry.likes }}</span>
                <span class="poetry-views">👁️ {{ poetry.views }}</span>
              </div>
              <el-button link type="primary" size="small">
                <strong>深度赏析 →</strong>
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
import { getPopularPoems, searchPoems, getPoemsByDynasty, type Poem } from '../api/poetry'

const router = useRouter()

// 响应式数据
const poetryList = ref<Poem[]>([])
const loading = ref(false)
const searchKeyword = ref('')
const selectedDynasty = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dynastyOptions = [
  { value: '唐朝', label: '唐朝' },
  { value: '宋朝', label: '宋朝' },
  { value: '元朝', label: '元朝' },
  { value: '明朝', label: '明朝' },
  { value: '清朝', label: '清朝' },
  { value: '汉朝', label: '汉朝' },
  { value: '魏晋', label: '魏晋' }
]

// 格式化诗歌预览
const formatPoetryPreview = (content: string): string => {
  const lines = content.split('\n').slice(0, 2)
  return lines.join('，') + '...'
}

// 格式化赏析预览（新增）
const formatAppreciationPreview = (appreciation: string): string => {
  if (!appreciation) return ''
  const firstSentence = appreciation.split('。')[0]
  return firstSentence.length > 60 ? firstSentence.substring(0, 60) + '...' : firstSentence + '。'
}

// 格式化日期
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 查看诗歌详情
const viewPoetryDetail = (id: string) => {
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
    const offset = (currentPage.value - 1) * pageSize.value
    let result: { data: Poem[], count: number }
    
    if (searchKeyword.value) {
      // 搜索诗词
      result = await searchPoems(searchKeyword.value, pageSize.value, offset)
    } else if (selectedDynasty.value) {
      // 按朝代筛选
      result = await getPoemsByDynasty(selectedDynasty.value, pageSize.value, offset)
    } else {
      // 获取热门诗词
      result = await getPopularPoems(pageSize.value, offset)
    }
    
    poetryList.value = result.data
    total.value = result.count
    
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

.header-tags {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.poetry-title {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
  line-height: 1.4;
  flex: 1;
}

.poetry-author {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

/* 🌟 赏析预览区域 */
.appreciation-preview {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  border-left: 3px solid #f59e0b;
}

.preview-label {
  font-weight: 600;
  color: #d97706;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.preview-text {
  color: #92400e;
  font-size: 0.85rem;
  line-height: 1.6;
  font-style: italic;
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

.poetry-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #999;
}

.poetry-likes, .poetry-views {
  display: flex;
  align-items: center;
  gap: 0.25rem;
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