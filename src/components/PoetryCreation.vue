<template>
  <div class="creation-container">
    <h3 class="creation-title">诗词创作</h3>
    <form @submit.prevent="handleSubmit" class="creation-form">
      <div class="form-group">
        <label>标题</label>
        <input v-model="form.title" type="text" required placeholder="请输入诗词标题" />
      </div>
      <div class="form-group">
        <label>作者</label>
        <input v-model="form.author" type="text" required placeholder="请输入作者姓名" />
      </div>
      <div class="form-group">
        <label>朝代</label>
        <select v-model="form.dynasty" required>
          <option value="">请选择朝代</option>
          <option value="唐">唐</option>
          <option value="宋">宋</option>
          <option value="元">元</option>
          <option value="明">明</option>
          <option value="清">清</option>
          <option value="现代">现代</option>
        </select>
      </div>
      <div class="form-group">
        <label>分类</label>
        <select v-model="form.category" required>
          <option value="">请选择分类</option>
          <option value="唐诗">唐诗</option>
          <option value="宋词">宋词</option>
          <option value="元曲">元曲</option>
          <option value="古风">古风</option>
        </select>
      </div>
      <div class="form-group">
        <label>内容</label>
        <textarea v-model="form.content" required placeholder="请输入诗词内容" rows="6"></textarea>
      </div>
      <div class="form-group">
        <label>摘要（可选）</label>
        <textarea v-model="form.excerpt" placeholder="请输入诗词摘要" rows="2"></textarea>
      </div>
      <button type="submit" :disabled="isSubmitting" class="submit-button">
        {{ isSubmitting ? '提交中...' : '提交创作' }}
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { createPoem } from '../api/poetry'
import { getCurrentUser } from '../api/user'

const isSubmitting = ref(false)

const form = ref({
  title: '',
  author: '',
  dynasty: '',
  category: '',
  content: '',
  excerpt: ''
})

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    const user = await getCurrentUser()
    if (!user) {
      alert('请先登录后再进行创作')
      return
    }

    const poemData = {
      title: form.value.title,
      author: form.value.author,
      dynasty: form.value.dynasty,
      category: form.value.category,
      content: form.value.content,
      excerpt: form.value.excerpt || form.value.content.slice(0, 50) + '...'
    }

    const result = await createPoem(poemData)
    if (result) {
      alert('诗词创作成功！')
      form.value = {
        title: '',
        author: '',
        dynasty: '',
        category: '',
        content: '',
        excerpt: ''
      }
    }
  } catch (error: any) {
    alert('创作失败: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.creation-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.creation-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 1.5rem;
}

.creation-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>