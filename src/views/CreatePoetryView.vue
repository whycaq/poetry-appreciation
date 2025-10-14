<template>
  <div class="create-poetry-view">
    <div class="container">
      <div class="create-header">
        <h1>AI诗歌创作</h1>
        <p>选择创作参数，让AI为您生成优美的诗歌</p>
      </div>

      <div class="create-content">
        <!-- 创作表单 -->
        <el-form
          :model="createForm"
          :rules="formRules"
          ref="formRef"
          label-width="100px"
          class="create-form"
        >
          <el-form-item label="诗歌主题" prop="theme">
            <el-input
              v-model="createForm.theme"
              placeholder="请输入诗歌主题，如：春天、思乡、爱情等"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="诗歌风格" prop="style">
            <el-select
              v-model="createForm.style"
              placeholder="请选择诗歌风格"
              style="width: 100%"
            >
              <el-option
                v-for="style in styleOptions"
                :key="style.value"
                :label="style.label"
                :value="style.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="诗歌长度" prop="length">
            <el-slider
              v-model="createForm.length"
              :min="4"
              :max="20"
              :step="2"
              show-stops
              show-input
            />
            <div class="length-hint">
              {{ getLengthHint(createForm.length) }}
            </div>
          </el-form-item>

          <el-form-item label="关键词" prop="keywords">
            <el-tag
              v-for="keyword in createForm.keywords"
              :key="keyword"
              closable
              @close="removeKeyword(keyword)"
              class="keyword-tag"
            >
              {{ keyword }}
            </el-tag>
            <el-input
              v-model="keywordInput"
              placeholder="输入关键词后按回车添加"
              size="small"
              style="width: 200px; margin-left: 10px"
              @keyup.enter="addKeyword"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              :loading="generating"
              @click="handleGenerate"
              size="large"
            >
              <template #icon>
                <el-icon><Magic /></el-icon>
              </template>
              生成诗歌
            </el-button>
            <el-button @click="resetForm" size="large">
              重置
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 生成结果 -->
        <div v-if="generatedPoetry" class="result-section">
          <h3>生成结果</h3>
          <div class="poetry-result">
            <div class="result-header">
              <h4>{{ generatedPoetry.title }}</h4>
              <el-button type="success" @click="handleSave" size="small">
                <el-icon><Download /></el-icon>
                保存诗歌
              </el-button>
            </div>
            <div class="result-content">
              <div
                v-for="(line, index) in generatedPoetry.content.split('\n')"
                :key="index"
                class="result-line"
              >
                {{ line }}
              </div>
            </div>
            <div class="result-meta">
              <span>风格：{{ getStyleLabel(generatedPoetry.style) }}</span>
              <span>生成时间：{{ formatTime(generatedPoetry.createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- 创作提示 -->
        <div class="tips-section">
          <el-alert
            title="创作提示"
            type="info"
            description="1. 主题描述越具体，生成效果越好\n2. 可以尝试不同的风格组合\n3. 关键词可以帮助AI更好地理解您的需求"
            :closable="false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { CreatePoetryRequest } from '@/types'
import { formatDate } from '@/utils'

const formRef = ref<FormInstance>()
const generating = ref(false)
const keywordInput = ref('')
const generatedPoetry = ref<any>(null)

// 表单数据
const createForm = reactive<CreatePoetryRequest>({
  theme: '',
  style: 'classical',
  length: 8,
  keywords: []
})

// 表单验证规则
const formRules: FormRules = {
  theme: [
    { required: true, message: '请输入诗歌主题', trigger: 'blur' },
    { min: 2, max: 50, message: '主题长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  style: [
    { required: true, message: '请选择诗歌风格', trigger: 'change' }
  ]
}

// 风格选项
const styleOptions = [
  { label: '古典风格', value: 'classical' },
  { label: '现代风格', value: 'modern' },
  { label: '浪漫风格', value: 'romantic' },
  { label: '豪放风格', value: 'bold' },
  { label: '婉约风格', value: 'graceful' }
]

// 获取长度提示
const getLengthHint = (length: number): string => {
  if (length <= 8) return '短诗（4-8句）'
  if (length <= 16) return '中诗（10-16句）'
  return '长诗（18-20句）'
}

// 获取风格标签
const getStyleLabel = (style: string): string => {
  const option = styleOptions.find(opt => opt.value === style)
  return option ? option.label : style
}

// 添加关键词
const addKeyword = () => {
  const keyword = keywordInput.value.trim()
  if (keyword && !createForm.keywords.includes(keyword)) {
    createForm.keywords.push(keyword)
    keywordInput.value = ''
  }
}

// 移除关键词
const removeKeyword = (keyword: string) => {
  const index = createForm.keywords.indexOf(keyword)
  if (index > -1) {
    createForm.keywords.splice(index, 1)
  }
}

// 生成诗歌
const handleGenerate = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    generating.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 模拟生成结果
    generatedPoetry.value = {
      title: `${createForm.theme}·AI创作`,
      content: `春风拂面花开放，\n万物复苏生机旺。\n鸟儿枝头唱欢歌，\n大地披上新绿装。\n阳光温暖照人间，\n心中充满希望光。\n美好时光莫辜负，\n珍惜当下乐无边。`,
      style: createForm.style,
      createdAt: new Date().toISOString()
    }
    
    ElMessage.success('诗歌生成成功！')
  } catch (error) {
    ElMessage.error('请完善表单信息')
  } finally {
    generating.value = false
  }
}

// 保存诗歌
const handleSave = () => {
  ElMessage.success('诗歌已保存到个人中心')
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    createForm.keywords = []
    generatedPoetry.value = null
  }
}

// 格式化时间
const formatTime = (time: string) => {
  return formatDate(time, 'YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped>
.create-poetry-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.create-header {
  text-align: center;
  margin-bottom: 2rem;
}

.create-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.create-header p {
  color: #666;
  font-size: 1.1rem;
}

.create-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-form {
  margin-bottom: 2rem;
}

.length-hint {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.keyword-tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.result-section {
  border-top: 1px solid #f0f0f0;
  padding-top: 2rem;
  margin-top: 2rem;
}

.result-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.poetry-result {
  background: #fafafa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e4e7ed;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.result-content {
  text-align: center;
  margin-bottom: 1rem;
}

.result-line {
  font-size: 1.2rem;
  line-height: 2;
  color: #555;
  font-family: '楷体', 'KaiTi', serif;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
}

.tips-section {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .create-header h1 {
    font-size: 2rem;
  }
  
  .result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .result-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>