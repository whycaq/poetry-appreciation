<template>
  <div class="study-check-in">
    <div class="check-in-header">
      <h3>
        <el-icon><Calendar /></el-icon>
        学习打卡
      </h3>
      <el-tag v-if="todayChecked" type="success" effect="dark">
        <el-icon><Check /></el-icon>
        今日已打卡
      </el-tag>
    </div>

    <div class="check-in-stats">
      <div class="stat-box">
        <span class="stat-number">{{ consecutiveDays }}</span>
        <span class="stat-label">连续天数</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">{{ totalDays }}</span>
        <span class="stat-label">累计天数</span>
      </div>
      <div class="stat-box">
        <span class="stat-number">{{ todayPoems }}</span>
        <span class="stat-label">今日学习</span>
      </div>
    </div>

    <div class="calendar-grid">
      <div 
        v-for="day in recentDays" 
        :key="day.date"
        :class="['calendar-day', { 
          'checked': day.checked,
          'today': day.isToday 
        }]"
        :title="day.date"
      >
        <span class="day-number">{{ day.dayOfMonth }}</span>
        <el-icon v-if="day.checked" class="check-icon"><Check /></el-icon>
      </div>
    </div>

    <el-button 
      v-if="!todayChecked"
      type="primary" 
      :icon="Calendar"
      @click="handleCheckIn"
      :loading="checking"
      style="width: 100%; margin-top: 1rem;"
    >
      立即打卡
    </el-button>

    <p v-if="todayChecked" class="check-in-tip">
      太棒了！今天已经完成打卡 🎉
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const todayChecked = ref(false)
const checking = ref(false)
const consecutiveDays = ref(0)
const totalDays = ref(0)
const todayPoems = ref(0)
const checkInHistory = ref<string[]>([]) // 存储已打卡的日期

// 最近30天
const recentDays = computed(() => {
  const days = []
  const today = new Date()
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const dateString = date.toISOString().split('T')[0]
    const isToday = i === 0
    const checked = checkInHistory.value.includes(dateString)
    
    days.push({
      date: dateString,
      dayOfMonth: date.getDate(),
      isToday,
      checked
    })
  }
  
  return days
})

// 打卡处理
const handleCheckIn = async () => {
  checking.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const today = new Date().toISOString().split('T')[0]
    checkInHistory.value.push(today)
    todayChecked.value = true
    consecutiveDays.value += 1
    totalDays.value += 1
    
    ElMessage.success({
      message: '打卡成功！继续保持哦 💪',
      duration: 3000
    })
    
    // 保存到本地存储
    localStorage.setItem('checkInHistory', JSON.stringify(checkInHistory.value))
    localStorage.setItem('consecutiveDays', String(consecutiveDays.value))
    localStorage.setItem('totalDays', String(totalDays.value))
  } catch (error) {
    ElMessage.error('打卡失败，请重试')
  } finally {
    checking.value = false
  }
}

// 加载打卡数据
const loadCheckInData = () => {
  const history = localStorage.getItem('checkInHistory')
  if (history) {
    checkInHistory.value = JSON.parse(history)
  }
  
  const consecutive = localStorage.getItem('consecutiveDays')
  if (consecutive) {
    consecutiveDays.value = parseInt(consecutive)
  }
  
  const total = localStorage.getItem('totalDays')
  if (total) {
    totalDays.value = parseInt(total)
  }
  
  // 检查今天是否已打卡
  const today = new Date().toISOString().split('T')[0]
  todayChecked.value = checkInHistory.value.includes(today)
}

onMounted(() => {
  loadCheckInData()
})
</script>

<style scoped>
.study-check-in {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.check-in-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.check-in-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.check-in-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-box {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 0.25rem;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #999;
  position: relative;
  transition: all 0.3s;
}

.calendar-day.checked {
  background: #10b981;
  color: white;
}

.calendar-day.today {
  border: 2px solid #3b82f6;
}

.calendar-day.checked.today {
  background: #3b82f6;
}

.day-number {
  font-size: 0.7rem;
}

.check-icon {
  position: absolute;
  font-size: 1rem;
}

.check-in-tip {
  text-align: center;
  color: #10b981;
  margin: 1rem 0 0 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>

