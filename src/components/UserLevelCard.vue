<template>
  <div class="user-level-card">
    <div class="level-header">
      <div class="level-badge">
        <span class="level-number">Lv.{{ userLevel }}</span>
      </div>
      <div class="level-info">
        <h3 class="username">{{ username }}</h3>
        <p class="level-title">{{ levelTitle }}</p>
      </div>
    </div>

    <div class="experience-bar">
      <div class="exp-info">
        <span>经验值</span>
        <span>{{ currentExp }} / {{ nextLevelExp }}</span>
      </div>
      <el-progress 
        :percentage="expPercentage" 
        :stroke-width="12"
        :show-text="false"
        status="success"
      />
    </div>

    <div class="stats-grid">
      <div class="stat-item">
        <el-icon class="stat-icon"><Reading /></el-icon>
        <div class="stat-content">
          <span class="stat-value">{{ stats.poems_studied || 0 }}</span>
          <span class="stat-label">学习诗词</span>
        </div>
      </div>

      <div class="stat-item">
        <el-icon class="stat-icon"><Star /></el-icon>
        <div class="stat-content">
          <span class="stat-value">{{ stats.favorite_count || 0 }}</span>
          <span class="stat-label">收藏数</span>
        </div>
      </div>

      <div class="stat-item">
        <el-icon class="stat-icon"><Edit /></el-icon>
        <div class="stat-content">
          <span class="stat-value">{{ stats.creation_count || 0 }}</span>
          <span class="stat-label">创作数</span>
        </div>
      </div>

      <div class="stat-item">
        <el-icon class="stat-icon"><Calendar /></el-icon>
        <div class="stat-content">
          <span class="stat-value">{{ stats.study_days || 0 }}</span>
          <span class="stat-label">打卡天数</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  username: string
  userLevel: number
  currentExp: number
  stats?: {
    poems_studied?: number
    favorite_count?: number
    creation_count?: number
    study_days?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  username: '游客',
  userLevel: 1,
  currentExp: 0,
  stats: () => ({})
})

// 计算下一级所需经验值
const nextLevelExp = computed(() => {
  return props.userLevel * 100 // 每级需要 level * 100 经验
})

// 计算经验值百分比
const expPercentage = computed(() => {
  return Math.min(100, (props.currentExp / nextLevelExp.value) * 100)
})

// 根据等级获取称号
const levelTitle = computed(() => {
  const level = props.userLevel
  if (level >= 50) return '诗词宗师'
  if (level >= 30) return '诗词大家'
  if (level >= 20) return '诗词行家'
  if (level >= 10) return '诗词爱好者'
  if (level >= 5) return '诗词学徒'
  return '诗词新人'
})
</script>

<style scoped>
.user-level-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.level-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.level-badge {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.5);
}

.level-number {
  font-size: 1.2rem;
  font-weight: bold;
}

.level-info {
  flex: 1;
}

.username {
  margin: 0 0 0.25rem 0;
  font-size: 1.3rem;
  font-weight: bold;
}

.level-title {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.experience-bar {
  margin-bottom: 1.5rem;
}

.exp-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(10px);
}

.stat-icon {
  font-size: 1.5rem;
  opacity: 0.9;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>


