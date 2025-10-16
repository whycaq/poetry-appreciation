<template>
  <div class="appreciation-section">
    <!-- 赏析精华（一句话总结） -->
    <div v-if="summary" class="appreciation-highlight">
      <div class="highlight-icon">✨</div>
      <div class="highlight-content">
        <h4>赏析精华</h4>
        <p class="highlight-text">{{ summary }}</p>
      </div>
    </div>

    <!-- 主要赏析内容 -->
    <div class="main-appreciation">
      <div class="section-title">
        <h3>
          <span class="title-icon">🎨</span>
          深度赏析
        </h3>
        <span class="reading-time">阅读时长：约{{ readingTime }}分钟</span>
      </div>

      <div class="appreciation-content">
        <!-- 创作背景 -->
        <div v-if="background" class="appreciation-block">
          <h4 class="block-title">
            <span class="block-icon">📜</span>
            创作背景
          </h4>
          <p class="block-content">{{ background }}</p>
        </div>

        <!-- 主要赏析 -->
        <div class="appreciation-block main">
          <h4 class="block-title">
            <span class="block-icon">💭</span>
            诗词解读
          </h4>
          <div class="block-content rich-text">
            <p v-for="(paragraph, index) in appreciationParagraphs" :key="index">
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- 名句赏析 -->
        <div v-if="famousLines && famousLines.length > 0" class="appreciation-block highlight-box">
          <h4 class="block-title">
            <span class="block-icon">⭐</span>
            名句赏析
          </h4>
          <div class="famous-lines-grid">
            <div v-for="(line, index) in famousLines" :key="index" class="famous-line-card">
              <div class="line-text">「 {{ line }} 」</div>
              <div class="line-analysis">
                这是本诗的点睛之笔，历来为人称道...
              </div>
            </div>
          </div>
        </div>

        <!-- 艺术手法 -->
        <div v-if="techniques" class="appreciation-block">
          <h4 class="block-title">
            <span class="block-icon">🎭</span>
            艺术手法
          </h4>
          <div class="techniques-tags">
            <span v-for="(technique, index) in techniquesList" :key="index" class="technique-tag">
              {{ technique }}
            </span>
          </div>
          <p class="block-content">{{ techniques }}</p>
        </div>

        <!-- 情感基调 -->
        <div v-if="emotionalTone" class="appreciation-block emotion">
          <h4 class="block-title">
            <span class="block-icon">💫</span>
            情感基调
          </h4>
          <div class="emotion-indicator">
            <span class="emotion-badge">{{ emotionalTone }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户互动区 -->
    <div class="user-interaction">
      <div class="interaction-header">
        <h4>💬 读者赏析</h4>
        <span class="note-count">{{ userNotes.length }} 条笔记</span>
      </div>
      
      <!-- 写笔记区域 -->
      <div v-if="canWriteNote" class="write-note">
        <textarea 
          v-model="newNote"
          placeholder="写下你的赏析理解..."
          class="note-textarea"
          rows="3"
        ></textarea>
        <div class="note-actions">
          <label class="public-checkbox">
            <input type="checkbox" v-model="notePublic">
            公开分享
          </label>
          <button @click="submitNote" class="submit-btn" :disabled="!newNote.trim()">
            发布笔记
          </button>
        </div>
      </div>

      <!-- 用户笔记列表 -->
      <div class="notes-list">
        <div v-for="note in userNotes" :key="note.id" class="note-card">
          <div class="note-header">
            <span class="note-author">{{ note.username }}</span>
            <span class="note-date">{{ formatDate(note.created_at) }}</span>
          </div>
          <p class="note-content">{{ note.content }}</p>
          <div class="note-footer">
            <button class="note-like-btn">
              ❤️ {{ note.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  appreciation: string
  summary?: string
  background?: string
  famousLines?: string[]
  techniques?: string
  emotionalTone?: string
  canWriteNote?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canWriteNote: false
})

const newNote = ref('')
const notePublic = ref(false)
const userNotes = ref<any[]>([])

// 计算阅读时长
const readingTime = computed(() => {
  const text = props.appreciation + (props.background || '')
  const wordsPerMinute = 300
  const minutes = Math.ceil(text.length / wordsPerMinute)
  return Math.max(1, minutes)
})

// 分段显示赏析内容
const appreciationParagraphs = computed(() => {
  return props.appreciation.split('\n').filter(p => p.trim())
})

// 提取艺术手法标签
const techniquesList = computed(() => {
  if (!props.techniques) return []
  // 简单提取关键词
  const keywords = ['比喻', '夸张', '拟人', '对偶', '排比', '借景抒情', '托物言志']
  return keywords.filter(k => props.techniques?.includes(k))
})

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 提交笔记
const submitNote = () => {
  if (!newNote.value.trim()) return
  
  // TODO: 调用API保存笔记
  console.log('提交笔记:', newNote.value, '公开:', notePublic.value)
  newNote.value = ''
}
</script>

<style scoped>
.appreciation-section {
  max-width: 800px;
  margin: 0 auto;
}

/* 赏析精华高亮区 */
.appreciation-highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.highlight-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.highlight-content h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.highlight-text {
  margin: 0;
  font-size: 1.2rem;
  line-height: 1.8;
  font-weight: 500;
}

/* 主要赏析区 */
.main-appreciation {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #f0f0f0;
}

.section-title h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1.8rem;
}

.reading-time {
  color: #999;
  font-size: 0.85rem;
}

/* 赏析内容块 */
.appreciation-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.appreciation-block {
  position: relative;
}

.appreciation-block.main {
  background: #fafafa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.appreciation-block.highlight-box {
  background: #fff7ed;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px dashed #f59e0b;
}

.appreciation-block.emotion {
  background: #fef2f2;
  padding: 1.5rem;
  border-radius: 12px;
}

.block-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.block-icon {
  font-size: 1.3rem;
}

.block-content {
  color: #555;
  line-height: 2;
  text-indent: 2em;
  font-size: 1rem;
}

.rich-text p {
  margin: 0 0 1rem 0;
  text-indent: 2em;
  line-height: 2;
}

/* 名句卡片 */
.famous-lines-grid {
  display: grid;
  gap: 1rem;
}

.famous-line-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.line-text {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-family: '楷体', 'KaiTi', serif;
  line-height: 1.8;
}

.line-analysis {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* 艺术手法标签 */
.techniques-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.technique-tag {
  padding: 0.5rem 1rem;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* 情感基调 */
.emotion-indicator {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.emotion-badge {
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #fecaca 0%, #ef4444 100%);
  color: white;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* 用户互动区 */
.user-interaction {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.interaction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.interaction-header h4 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.note-count {
  color: #999;
  font-size: 0.85rem;
}

.write-note {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.note-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s;
}

.note-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.public-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.submit-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

/* 笔记列表 */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-card {
  padding: 1.5rem;
  background: #fafafa;
  border-radius: 12px;
  border-left: 3px solid #10b981;
}

.note-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.note-author {
  font-weight: 600;
  color: #333;
}

.note-date {
  color: #999;
  font-size: 0.85rem;
}

.note-content {
  color: #555;
  line-height: 1.8;
  margin: 0 0 1rem 0;
}

.note-footer {
  display: flex;
  gap: 1rem;
}

.note-like-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.note-like-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

@media (max-width: 768px) {
  .appreciation-highlight {
    flex-direction: column;
    text-align: center;
  }
  
  .highlight-icon {
    font-size: 2.5rem;
  }

  .section-title {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>

