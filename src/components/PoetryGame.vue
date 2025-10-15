<template>
  <div class="game-container">
    <h3 class="game-title">飞花令</h3>
    
    <div v-if="!gameStarted" class="game-start">
      <p class="game-description">
        古代文人雅士行酒令时的文字游戏，以"花"字为令，说出含有此字的诗句。
      </p>
      <div class="game-rules">
        <h4 class="rules-title">游戏规则</h4>
        <ul class="rules-list">
          <li>轮流说出含有"花"字的诗句</li>
          <li>诗句不能重复</li>
          <li>限时 30 秒作答</li>
          <li>答错或超时则淘汰</li>
        </ul>
      </div>
      <button @click="startGame" class="start-button">开始游戏</button>
    </div>

    <div v-else class="game-active">
      <div class="game-header">
        <div class="game-token">
          <div class="token-label">令字</div>
          <div class="token-character">{{ currentCharacter }}</div>
        </div>
        <div class="game-timer">
          剩余时间: <span class="timer">{{ timeLeft }}</span>秒
        </div>
      </div>

      <div class="game-input">
        <input 
          v-model="userInput" 
          @keyup.enter="submitAnswer"
          placeholder="请输入含有该字的诗句..."
          class="poem-input"
        />
        <button @click="submitAnswer" class="submit-button">提交</button>
      </div>

      <div class="game-history">
        <h4>已答诗句</h4>
        <ul>
          <li v-for="(poem, index) in answeredPoems" :key="index">
            {{ poem }}
          </li>
        </ul>
      </div>

      <div class="game-score">
        <p>得分: {{ score }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const gameStarted = ref(false)
const currentCharacter = ref('花')
const userInput = ref('')
const timeLeft = ref(30)
const score = ref(0)
const answeredPoems = ref<string[]>([])
let timer: number | null = null

// 示例诗句库（包含"花"字的诗句）
const flowerPoems = [
  "花间一壶酒，独酌无相亲",
  "感时花溅泪，恨别鸟惊心",
  "晓看红湿处，花重锦官城",
  "乱花渐欲迷人眼，浅草才能没马蹄",
  "花自飘零水自流，一种相思，两处闲愁",
  "人面不知何处去，桃花依旧笑春风",
  "春江花朝秋月夜，往往取酒还独倾",
  "花非花，雾非雾，夜半来，天明去",
  "花褪残红青杏小，燕子飞时，绿水人家绕",
  "花开花落两不惊，闲看庭前花开花落"
]

const startGame = () => {
  gameStarted.value = true
  timeLeft.value = 30
  score.value = 0
  answeredPoems.value = []
  userInput.value = ''
  startTimer()
}

const startTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
  
  timer = setInterval(() => {
    timeLeft.value--
    
    if (timeLeft.value <= 0) {
      endGame()
    }
  }, 1000)
}

const submitAnswer = () => {
  if (!userInput.value.trim()) return

  // 检查是否包含当前字符
  if (!userInput.value.includes(currentCharacter.value)) {
    alert(`诗句必须包含"${currentCharacter.value}"字`)
    return
  }

  // 检查是否重复
  if (answeredPoems.value.includes(userInput.value)) {
    alert('该诗句已被使用过')
    return
  }

  // 验证是否为有效诗句（简化验证）
  const isValid = flowerPoems.some(poem => 
    userInput.value.includes(poem.substring(0, 4)) // 简单匹配前4个字
  )

  if (!isValid) {
    alert('请输入有效的诗句')
    return
  }

  // 添加答案
  answeredPoems.value.push(userInput.value)
  score.value += 10
  timeLeft.value = 30 // 重置计时器
  userInput.value = ''

  // 每答对5题更换字符
  if (score.value % 50 === 0) {
    changeCharacter()
  }
}

const changeCharacter = () => {
  const characters = ['花', '月', '风', '云', '山', '水', '春', '秋']
  const currentIndex = characters.indexOf(currentCharacter.value)
  const nextIndex = (currentIndex + 1) % characters.length
  currentCharacter.value = characters[nextIndex]
}

const endGame = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  
  alert(`游戏结束！您的得分是: ${score}`)
  gameStarted.value = false
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.game-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.game-title {
  text-align: center;
  color: #1f2937;
  margin-bottom: 1rem;
}

.game-description {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.game-rules {
  margin-bottom: 2rem;
}

.rules-title {
  color: #374151;
  margin-bottom: 0.5rem;
}

.rules-list {
  color: #6b7280;
  padding-left: 1.5rem;
}

.rules-list li {
  margin-bottom: 0.25rem;
}

.start-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.game-token {
  text-align: center;
}

.token-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.token-character {
  font-size: 2rem;
  font-weight: bold;
  color: #3b82f6;
}

.game-timer {
  font-size: 1.125rem;
  color: #ef4444;
}

.timer {
  font-weight: bold;
}

.game-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.poem-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.game-history {
  margin-bottom: 1rem;
}

.game-history h4 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.game-history ul {
  max-height: 200px;
  overflow-y: auto;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.375rem;
}

.game-history li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.game-score {
  text-align: center;
  font-size: 1.125rem;
  font-weight: bold;
  color: #10b981;
}
</style>