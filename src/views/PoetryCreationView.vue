<template>
  <div class="poetry-creation-view">
    <div class="page-header">
      <h1>诗词创作</h1>
      <p>发挥你的创意，创作属于自己的诗词作品</p>
    </div>

    <div class="creation-container">
      <div class="creation-form">
        <div class="form-group">
          <label for="poem-title">诗词标题</label>
          <input 
            id="poem-title"
            v-model="poemData.title"
            type="text"
            placeholder="请输入诗词标题"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="poem-type">诗词类型</label>
          <select v-model="poemData.type" id="poem-type" class="form-select">
            <option value="five-char">五言绝句</option>
            <option value="seven-char">七言绝句</option>
            <option value="ci">词</option>
            <option value="modern">现代诗</option>
          </select>
        </div>

        <div class="form-group">
          <label for="poem-content">诗词内容</label>
          <textarea 
            id="poem-content"
            v-model="poemData.content"
            placeholder="请输入诗词内容..."
            rows="8"
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="poem-theme">主题标签</label>
          <div class="theme-tags">
            <button 
              v-for="theme in themes" 
              :key="theme"
              :class="['theme-tag', { active: poemData.themes.includes(theme) }]"
              @click="toggleTheme(theme)"
            >
              {{ theme }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button @click="saveDraft" class="btn-secondary">保存草稿</button>
          <button @click="publishPoem" class="btn-primary">发布作品</button>
        </div>
      </div>

      <div class="creation-preview">
        <h3>创作预览</h3>
        <div class="preview-content">
          <h4>{{ poemData.title || '未命名作品' }}</h4>
          <pre class="poem-text">{{ poemData.content || '请输入诗词内容...' }}</pre>
          <div class="preview-tags">
            <span v-for="theme in poemData.themes" :key="theme" class="preview-tag">
              {{ theme }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="ai-assistant">
      <h3>🤖 AI创作助手</h3>
      <p class="ai-desc">让AI帮助你创作和优化诗词</p>
      <div class="assistant-options">
        <button @click="generateByTheme" class="ai-btn" :disabled="aiLoading">
          {{ aiLoading ? '生成中...' : '📝 根据主题生成' }}
        </button>
        <button @click="improvePoem" class="ai-btn" :disabled="aiLoading">
          {{ aiLoading ? '优化中...' : '✨ 优化当前作品' }}
        </button>
        <button @click="suggestRhyme" class="ai-btn" :disabled="aiLoading">
          {{ aiLoading ? '分析中...' : '🎵 押韵建议' }}
        </button>
      </div>
      
      <!-- AI结果显示 -->
      <div v-if="showAIResult" class="ai-result">
        <div class="ai-result-header">
          <h4>AI分析结果</h4>
          <button @click="showAIResult = false" class="close-btn">×</button>
        </div>
        <pre class="ai-result-content">{{ aiResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const poemData = ref({
  title: '',
  type: 'five-char',
  content: '',
  themes: [] as string[]
})

const themes = ['爱情', '友情', '思乡', '爱国', '自然', '人生', '哲理', '季节', '节日']

const toggleTheme = (theme: string) => {
  const index = poemData.value.themes.indexOf(theme)
  if (index > -1) {
    poemData.value.themes.splice(index, 1)
  } else {
    poemData.value.themes.push(theme)
  }
}

const saveDraft = () => {
  console.log('保存草稿:', poemData.value)
  // 这里可以添加保存草稿的逻辑
}

const publishPoem = () => {
  console.log('发布作品:', poemData.value)
  // 这里可以添加发布作品的逻辑
}

// AI功能状态
const aiLoading = ref(false)
const showAIResult = ref(false)
const aiResult = ref('')

// 根据主题生成诗词
const generateByTheme = async () => {
  if (!poemData.value.themes.length) {
    alert('请先选择至少一个主题标签')
    return
  }
  
  aiLoading.value = true
  try {
    const { generatePoem } = await import('../api/ai')
    const theme = poemData.value.themes.join('、')
    const result = await generatePoem(theme, 'classical', [], 8)
    
    // 将生成的内容填入表单
    if (!poemData.value.title) {
      poemData.value.title = result.title
    }
    poemData.value.content = result.content
    
    alert('AI生成成功！已填入编辑区')
  } catch (error: any) {
    console.error('AI生成失败:', error)
    alert('生成失败：' + (error.message || '请稍后重试'))
  } finally {
    aiLoading.value = false
  }
}

// 优化当前作品
const improvePoem = async () => {
  if (!poemData.value.content.trim()) {
    alert('请先输入诗词内容')
    return
  }
  
  aiLoading.value = true
  try {
    const { improvePoem: improvePoemAPI } = await import('../api/ai')
    const result = await improvePoemAPI(poemData.value.content, 'overall')
    
    // 显示优化结果
    aiResult.value = `优化后的诗词：\n\n${result.improved}\n\n改进建议：\n${result.suggestions}`
    showAIResult.value = true
    
    // 询问是否替换
    if (confirm('是否用优化后的版本替换当前内容？')) {
      poemData.value.content = result.improved
    }
  } catch (error: any) {
    console.error('AI优化失败:', error)
    alert('优化失败：' + (error.message || '请稍后重试'))
  } finally {
    aiLoading.value = false
  }
}

// 提供押韵建议
const suggestRhyme = async () => {
  if (!poemData.value.content.trim()) {
    alert('请先输入诗词内容')
    return
  }
  
  // 获取最后一句的最后一个字
  const lines = poemData.value.content.trim().split('\n')
  const lastLine = lines[lines.length - 1]
  const lastChar = lastLine.trim().slice(-1)
  
  if (!lastChar) {
    alert('无法获取押韵字')
    return
  }
  
  aiLoading.value = true
  try {
    const { getRhymeSuggestions } = await import('../api/ai')
    const suggestions = await getRhymeSuggestions(lastLine, lastChar)
    
    aiResult.value = `押韵建议（与"${lastChar}"押韵）：\n\n${suggestions.join('\n')}`
    showAIResult.value = true
  } catch (error: any) {
    console.error('获取押韵建议失败:', error)
    alert('获取建议失败：' + (error.message || '请稍后重试'))
  } finally {
    aiLoading.value = false
  }
}
</script>

<style scoped>
.poetry-creation-view {
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

.creation-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.theme-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.theme-tag {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-tag.active {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.creation-preview {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
}

.creation-preview h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.preview-content {
  background: white;
  padding: 1.5rem;
  border-radius: 6px;
}

.preview-content h4 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.poem-text {
  white-space: pre-wrap;
  line-height: 1.8;
  color: #374151;
  margin-bottom: 1rem;
}

.preview-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-tag {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.ai-assistant {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
}

.ai-assistant h3 {
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.ai-desc {
  margin-bottom: 1.5rem;
  opacity: 0.9;
  font-size: 0.95rem;
}

.assistant-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.ai-btn {
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
}

.ai-btn:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ai-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-result {
  margin-top: 1.5rem;
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  color: #1f2937;
}

.ai-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ai-result-header h4 {
  margin: 0;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.ai-result-content {
  white-space: pre-wrap;
  line-height: 1.8;
  color: #374151;
  margin: 0;
  font-family: inherit;
}
</style>