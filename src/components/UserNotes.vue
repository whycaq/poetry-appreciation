<template>
  <div class="user-notes-section">
    <div class="section-header">
      <h3>
        <span class="icon">💬</span>
        读者赏析笔记
      </h3>
      <span class="notes-count">{{ publicNotes.length }} 条笔记</span>
    </div>

    <!-- 写笔记区域 -->
    <div v-if="isLoggedIn" class="write-note-area">
      <div class="write-header">
        <h4>✍️ 写下你的赏析理解</h4>
        <span class="tip">分享你对这首诗的独特见解</span>
      </div>
      
      <textarea 
        v-model="newNoteContent"
        placeholder="你对这首诗有什么感悟？试着从意象、情感、艺术手法等角度来赏析..."
        class="note-textarea"
        :rows="noteRows"
        @focus="noteRows = 6"
        @blur="handleBlur"
      ></textarea>

      <div class="note-actions">
        <label class="public-toggle">
          <input type="checkbox" v-model="isPublic">
          <span class="toggle-text">
            {{ isPublic ? '🌍 公开分享' : '🔒 仅自己可见' }}
          </span>
        </label>

        <div class="action-buttons">
          <button 
            @click="clearNote" 
            class="cancel-btn"
            v-if="newNoteContent"
          >
            清空
          </button>
          <button 
            @click="submitNote" 
            class="submit-btn"
            :disabled="!newNoteContent.trim() || submitting"
          >
            {{ submitting ? '发布中...' : '发布笔记' }}
          </button>
        </div>
      </div>

      <!-- 我的笔记列表 -->
      <div v-if="myNotes.length > 0" class="my-notes">
        <h5 class="my-notes-title">📝 我的笔记</h5>
        <div v-for="note in myNotes" :key="note.id" class="my-note-card">
          <div class="note-header">
            <span class="privacy-badge" :class="{ public: note.is_public }">
              {{ note.is_public ? '🌍 公开' : '🔒 私密' }}
            </span>
            <span class="note-date">{{ formatDate(note.created_at) }}</span>
          </div>
          <p class="note-content">{{ note.note_content }}</p>
          <div class="note-actions-bar">
            <span class="note-likes">❤️ {{ note.likes }}</span>
            <div class="note-buttons">
              <button @click="editNote(note)" class="edit-btn">编辑</button>
              <button @click="deleteNote(note.id)" class="delete-btn">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-else class="login-prompt">
      <p>💡 登录后即可写下你的赏析笔记，与其他诗友交流</p>
      <button @click="$emit('showLogin')" class="login-btn">
        立即登录
      </button>
    </div>

    <!-- 其他用户的公开笔记 -->
    <div class="public-notes">
      <h4 class="notes-subtitle">
        <span class="icon">🌟</span>
        精彩笔记
      </h4>

      <div v-if="loading" class="loading-state">
        <p>加载中...</p>
      </div>

      <div v-else-if="publicNotes.length === 0" class="empty-state">
        <p>还没有人发表笔记，快来抢沙发吧！</p>
      </div>

      <div v-else class="notes-list">
        <div v-for="note in publicNotes" :key="note.id" class="note-card">
          <div class="note-header">
            <div class="author-info">
              <div class="avatar">
                <img v-if="note.avatar_url" :src="note.avatar_url" :alt="note.username">
                <span v-else class="avatar-placeholder">{{ note.username?.charAt(0) || 'U' }}</span>
              </div>
              <div class="author-details">
                <span class="author-name">{{ note.username }}</span>
                <span class="note-date">{{ formatDate(note.created_at) }}</span>
              </div>
            </div>
            <span class="quality-badge">优质</span>
          </div>

          <p class="note-content">{{ note.note_content }}</p>

          <div class="note-footer">
            <button 
              @click="handleLikeNote(note.id)" 
              class="like-btn"
              :class="{ liked: likedNotes.includes(note.id) }"
            >
              {{ likedNotes.includes(note.id) ? '❤️' : '🤍' }} {{ note.likes }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  getPoemNotes, 
  getUserNotes, 
  createAppreciationNote,
  deleteAppreciationNote,
  likeAppreciationNote,
  type AppreciationNote 
} from '../api/poetry'
import { getCurrentUser } from '../api/user'

interface Props {
  poemId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  showLogin: []
  noteCreated: []
}>()

const isLoggedIn = ref(false)
const currentUserId = ref<string | null>(null)
const loading = ref(true)
const submitting = ref(false)

const newNoteContent = ref('')
const isPublic = ref(true)
const noteRows = ref(3)

const publicNotes = ref<AppreciationNote[]>([])
const myNotes = ref<AppreciationNote[]>([])
const likedNotes = ref<string[]>([])

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

// 检查登录状态
const checkAuth = async () => {
  try {
    const user = await getCurrentUser()
    if (user) {
      isLoggedIn.value = true
      currentUserId.value = user.id
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 加载笔记
const loadNotes = async () => {
  loading.value = true
  try {
    // 加载公开笔记
    const notes = await getPoemNotes(props.poemId, 20)
    publicNotes.value = notes

    // 如果已登录，加载自己的笔记
    if (currentUserId.value) {
      const userNotes = await getUserNotes(currentUserId.value, props.poemId)
      myNotes.value = userNotes
    }
  } catch (error) {
    console.error('加载笔记失败:', error)
  } finally {
    loading.value = false
  }
}

// 提交笔记
const submitNote = async () => {
  if (!newNoteContent.value.trim()) return

  submitting.value = true
  try {
    await createAppreciationNote(props.poemId, newNoteContent.value.trim(), isPublic.value)
    
    // 清空输入
    newNoteContent.value = ''
    noteRows.value = 3
    
    // 重新加载笔记
    await loadNotes()
    
    emit('noteCreated')
    
    alert('笔记发布成功！' + (isPublic.value ? ' 已公开分享' : ' 仅自己可见'))
  } catch (error: any) {
    alert(error.message || '发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 清空笔记
const clearNote = () => {
  newNoteContent.value = ''
  noteRows.value = 3
}

// 处理失焦事件
const handleBlur = () => {
  if (!newNoteContent.value) {
    noteRows.value = 3
  }
}

// 编辑笔记
const editNote = (note: AppreciationNote) => {
  newNoteContent.value = note.note_content
  isPublic.value = note.is_public
  noteRows.value = 6
  // TODO: 实现更新功能
}

// 删除笔记
const deleteNote = async (noteId: string) => {
  if (!confirm('确定要删除这条笔记吗？')) return

  try {
    const success = await deleteAppreciationNote(noteId)
    if (success) {
      await loadNotes()
      alert('删除成功')
    }
  } catch (error) {
    alert('删除失败')
  }
}

// 点赞笔记
const handleLikeNote = async (noteId: string) => {
  if (!isLoggedIn.value) {
    emit('showLogin')
    return
  }

  try {
    const success = await likeAppreciationNote(noteId)
    if (success) {
      // 标记为已点赞
      if (!likedNotes.value.includes(noteId)) {
        likedNotes.value.push(noteId)
      }
      
      // 更新点赞数
      const note = publicNotes.value.find(n => n.id === noteId)
      if (note) {
        note.likes += 1
      }
    }
  } catch (error: any) {
    alert(error.message || '点赞失败')
  }
}

onMounted(async () => {
  await checkAuth()
  await loadNotes()
})
</script>

<style scoped>
.user-notes-section {
  max-width: 800px;
  margin: 2rem auto 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.8rem;
}

.notes-count {
  color: #999;
  font-size: 0.9rem;
}

/* 写笔记区域 */
.write-note-area {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px dashed #e0e7ff;
}

.write-header {
  margin-bottom: 1rem;
}

.write-header h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #333;
}

.tip {
  color: #999;
  font-size: 0.85rem;
}

.note-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.8;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.note-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.note-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.public-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.public-toggle input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.toggle-text {
  font-size: 0.95rem;
  color: #666;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.cancel-btn, .submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s;
}

.cancel-btn {
  background: #f3f4f6;
  color: #666;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.submit-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 我的笔记 */
.my-notes {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #e5e7eb;
}

.my-notes-title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #666;
}

.my-note-card {
  background: #f8f9fa;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border-left: 4px solid #10b981;
}

.privacy-badge {
  padding: 0.25rem 0.75rem;
  background: #6b7280;
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
}

.privacy-badge.public {
  background: #10b981;
}

.note-actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.note-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.edit-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.delete-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* 未登录提示 */
.login-prompt {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 2rem;
}

.login-prompt p {
  margin: 0 0 1rem 0;
  color: #92400e;
  font-size: 1rem;
}

.login-btn {
  padding: 0.75rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.login-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 公开笔记列表 */
.public-notes {
  margin-top: 2rem;
}

.notes-subtitle {
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.note-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #8b5cf6;
  transition: all 0.3s;
}

.note-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 1.2rem;
  color: #fff;
  background: #6b7280;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.note-date {
  color: #999;
  font-size: 0.8rem;
}

.quality-badge {
  padding: 0.35rem 0.75rem;
  background: #fef3c7;
  color: #d97706;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.note-content {
  color: #333;
  line-height: 1.9;
  font-size: 1rem;
  margin: 0 0 1rem 0;
  white-space: pre-wrap;
}

.note-footer {
  display: flex;
  gap: 1rem;
}

.like-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.like-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
  transform: scale(1.05);
}

.like-btn.liked {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.note-likes {
  color: #999;
  font-size: 0.85rem;
}

.loading-state, .empty-state {
  padding: 3rem 2rem;
  text-align: center;
  color: #999;
  background: #fafafa;
  border-radius: 12px;
}

@media (max-width: 768px) {
  .write-note-area {
    padding: 1.5rem;
  }

  .note-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

