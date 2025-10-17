<!--
  AI聊天助手组件
  功能：悬浮在页面右下角的AI助手，提供诗词赏析、创作辅助等功能
-->
<template>
  <!-- 悬浮按钮 -->
  <div class="ai-chat-container">
    <!-- 聊天窗口 -->
    <Transition name="chat-window">
      <div v-if="isOpen" class="chat-window">
        <!-- 窗口头部 -->
        <div class="chat-header">
          <div class="header-left">
            <div class="ai-avatar">🤖</div>
            <div class="ai-info">
              <h3 class="ai-name">诗词AI助手</h3>
              <span class="ai-status">
                <span class="status-dot"></span>
                在线
              </span>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" @click="clearChat" title="清空对话">
              🗑️
            </button>
            <button class="header-btn close-btn" @click="toggleChat" title="关闭">
              ×
            </button>
          </div>
        </div>

        <!-- 聊天消息区域 -->
        <div class="chat-messages" ref="messagesContainer">
          <!-- 欢迎消息 -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-avatar">👋</div>
            <h3 class="welcome-title">你好！我是诗词AI助手</h3>
            <p class="welcome-text">
              我可以帮您赏析诗词、辅助创作、推荐经典作品。有什么可以帮您的吗？
            </p>
            
            <!-- 快捷问题 -->
            <div class="quick-questions">
              <button
                v-for="(question, index) in quickQuestions"
                :key="index"
                class="quick-question-btn"
                @click="sendQuickQuestion(question)"
              >
                {{ question }}
              </button>
            </div>
          </div>

          <!-- 对话消息列表 -->
          <div
            v-for="(message, index) in messages"
            :key="index"
            :class="['message', message.role]"
          >
            <div class="message-avatar">
              {{ message.role === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="message-text" v-html="formatMessage(message.content)"></div>
              </div>
              <span class="message-time">{{ formatTime(message.timestamp) }}</span>
            </div>
          </div>

          <!-- AI输入中状态 -->
          <div v-if="isTyping" class="message assistant">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="message-bubble">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <!-- 建议问题 -->
          <div v-if="suggestions.length > 0" class="suggestions">
            <p class="suggestions-title">您可能还想问：</p>
            <div class="suggestions-list">
              <button
                v-for="(suggestion, index) in suggestions"
                :key="index"
                class="suggestion-btn"
                @click="sendQuickQuestion(suggestion)"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- 输入框区域 -->
        <div class="chat-input-area">
          <div class="input-wrapper">
            <input
              v-model="userInput"
              type="text"
              class="chat-input"
              placeholder="输入您的问题..."
              @keypress.enter="sendMessage"
              :disabled="isTyping"
            />
            <button
              class="send-btn"
              @click="sendMessage"
              :disabled="!userInput.trim() || isTyping"
            >
              <span v-if="!isTyping">发送</span>
              <span v-else>...</span>
            </button>
          </div>
          <div class="input-tips">
            💡 提示：您可以问我关于诗词赏析、创作、推荐等问题
          </div>
        </div>
      </div>
    </Transition>

    <!-- 悬浮触发按钮 -->
    <Transition name="fab">
      <button
        v-if="!isOpen"
        class="chat-fab"
        @click="toggleChat"
        :class="{ 'has-badge': hasNewMessage }"
      >
        <span class="fab-icon">💬</span>
        <span class="fab-text">AI助手</span>
        <span v-if="hasNewMessage" class="fab-badge"></span>
      </button>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { sendAIMessage, getQuickQuestions, type AIMessage } from '../api/ai'

// 组件状态
const isOpen = ref(false)
const userInput = ref('')
const isTyping = ref(false)
const hasNewMessage = ref(false)
const messages = ref<AIMessage[]>([])
const suggestions = ref<string[]>([])
const messagesContainer = ref<HTMLElement | null>(null)

// 快捷问题
const quickQuestions = ref<string[]>(getQuickQuestions())

/**
 * 切换聊天窗口显示/隐藏
 */
const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    hasNewMessage.value = false
    // 窗口打开时，滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}

/**
 * 发送消息
 */
const sendMessage = async () => {
  const message = userInput.value.trim()
  if (!message || isTyping.value) return

  // 添加用户消息
  messages.value.push({
    role: 'user',
    content: message,
    timestamp: Date.now()
  })

  // 清空输入框
  userInput.value = ''
  
  // 清空之前的建议
  suggestions.value = []

  // 滚动到底部
  nextTick(() => scrollToBottom())

  // 显示AI输入中状态
  isTyping.value = true

  try {
    // 调用AI API
    const response = await sendAIMessage(message, undefined, messages.value)

    // 添加AI回复
    messages.value.push({
      role: 'assistant',
      content: response.reply,
      timestamp: Date.now()
    })

    // 更新建议问题
    if (response.suggestions && response.suggestions.length > 0) {
      suggestions.value = response.suggestions
    }

    // 如果窗口关闭，显示新消息提示
    if (!isOpen.value) {
      hasNewMessage.value = true
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    
    // 添加错误提示
    messages.value.push({
      role: 'assistant',
      content: '抱歉，我遇到了一些问题。请稍后再试。',
      timestamp: Date.now()
    })
  } finally {
    isTyping.value = false
    nextTick(() => scrollToBottom())
  }
}

/**
 * 发送快捷问题
 */
const sendQuickQuestion = (question: string) => {
  userInput.value = question
  sendMessage()
}

/**
 * 清空对话
 */
const clearChat = () => {
  if (confirm('确定要清空所有对话记录吗？')) {
    messages.value = []
    suggestions.value = []
  }
}

/**
 * 滚动到底部
 */
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

/**
 * 格式化消息内容（支持换行）
 */
const formatMessage = (content: string): string => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

/**
 * 格式化时间
 */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 监听消息变化，自动滚动
watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom())
})

// 组件挂载时，从本地存储恢复对话历史
onMounted(() => {
  const savedMessages = localStorage.getItem('ai-chat-history')
  if (savedMessages) {
    try {
      messages.value = JSON.parse(savedMessages)
    } catch (error) {
      console.error('恢复对话历史失败:', error)
    }
  }
})

// 监听消息变化，保存到本地存储
watch(messages, (newMessages) => {
  // 只保留最近50条消息
  const messagesToSave = newMessages.slice(-50)
  localStorage.setItem('ai-chat-history', JSON.stringify(messagesToSave))
}, { deep: true })
</script>

<style scoped>
/* 容器 */
.ai-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

/* 悬浮按钮 */
.chat-fab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.chat-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
}

.fab-icon {
  font-size: 20px;
}

.fab-text {
  font-size: 14px;
}

.fab-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* 聊天窗口 */
.chat-window {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 600px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 窗口头部 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.ai-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.9;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.header-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 16px;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn {
  font-size: 24px;
  line-height: 1;
}

/* 消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9fafb;
}

/* 欢迎消息 */
.welcome-message {
  text-align: center;
  padding: 20px;
}

.welcome-avatar {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.welcome-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.6;
}

/* 快捷问题 */
.quick-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-question-btn {
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quick-question-btn:hover {
  background: #f3f4f6;
  border-color: #667eea;
  color: #667eea;
}

/* 消息样式 */
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  animation: messageSlideIn 0.3s ease;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.message.assistant .message-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 75%;
}

.message.user .message-content {
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  word-wrap: break-word;
}

.message.user .message-bubble {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: white;
  color: #1f2937;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.message-text {
  font-size: 14px;
  line-height: 1.6;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
  padding: 0 4px;
}

/* 输入中动画 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #9ca3af;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

/* 建议问题 */
.suggestions {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  animation: messageSlideIn 0.3s ease;
}

.suggestions-title {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.suggestion-btn {
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.suggestion-btn:hover {
  background: #e5e7eb;
  border-color: #667eea;
  color: #667eea;
}

/* 输入区域 */
.chat-input-area {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.input-wrapper {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.chat-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.chat-input:focus {
  border-color: #667eea;
}

.chat-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-tips {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.4;
}

/* 动画 */
.fab-enter-active,
.fab-leave-active {
  transition: all 0.3s ease;
}

.fab-enter-from,
.fab-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}

.chat-window-enter-active,
.chat-window-leave-active {
  transition: all 0.3s ease;
}

.chat-window-enter-from,
.chat-window-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-window {
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }

  .chat-fab {
    padding: 14px 20px;
  }

  .fab-text {
    display: none;
  }
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>

