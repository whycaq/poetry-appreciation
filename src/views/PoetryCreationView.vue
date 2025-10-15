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
      <h3>AI创作助手</h3>
      <div class="assistant-options">
        <button @click="generateByTheme" class="ai-btn">根据主题生成</button>
        <button @click="improvePoem" class="ai-btn">优化当前作品</button>
        <button @click="suggestRhyme" class="ai-btn">押韵建议</button>
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
  themes: []
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

const generateByTheme = () => {
  console.log('根据主题生成诗词')
  // AI生成诗词的逻辑
}

const improvePoem = () => {
  console.log('优化当前作品')
  // AI优化诗词的逻辑
}

const suggestRhyme = () => {
  console.log('提供押韵建议')
  // AI押韵建议的逻辑
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
  background: #f0f9ff;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.ai-assistant h3 {
  margin-bottom: 1rem;
  color: #0369a1;
}

.assistant-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.ai-btn {
  padding: 0.75rem 1.5rem;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.ai-btn:hover {
  background-color: #0284c7;
}
</style>