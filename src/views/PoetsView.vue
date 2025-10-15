<template>
  <div class="poets-view">
    <div class="page-header">
      <h1>诗人介绍</h1>
      <p>了解历代著名诗人的生平事迹和创作风格</p>
    </div>

    <div class="poets-container">
      <div class="dynasty-filter">
        <button 
          v-for="dynasty in dynasties" 
          :key="dynasty.id"
          :class="['dynasty-btn', { active: activeDynasty === dynasty.id }]"
          @click="activeDynasty = dynasty.id"
        >
          {{ dynasty.name }}
        </button>
      </div>

      <div class="poets-grid">
        <div v-for="poet in filteredPoets" :key="poet.id" class="poet-card">
          <div class="poet-image">
            <img :src="poet.image" :alt="poet.name" />
          </div>
          <div class="poet-info">
            <h2>{{ poet.name }}</h2>
            <p class="dynasty">{{ poet.dynasty }}</p>
            <p class="lifespan">{{ poet.lifespan }}</p>
            <p class="description">{{ poet.description }}</p>
            <div class="famous-works">
              <h4>代表作品</h4>
              <ul>
                <li v-for="work in poet.famousWorks" :key="work">{{ work }}</li>
              </ul>
            </div>
            <button @click="viewPoetDetail(poet.id)" class="detail-btn">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

const activeDynasty = ref('tang')

const dynasties = [
  { id: 'tang', name: '唐代诗人' },
  { id: 'song', name: '宋代词人' },
  { id: 'yuan', name: '元代曲家' },
  { id: 'modern', name: '现代诗人' }
]

const poets = [
  {
    id: 1,
    name: '李白',
    dynasty: '唐代',
    lifespan: '701年-762年',
    image: 'https://ai-public.mastergo.com/ai/img_res/6cef988e86519aeee312b949c3c77f80.jpg',
    description: '唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。其诗豪放飘逸，想象丰富，语言流转自然，音律和谐多变。',
    famousWorks: ['静夜思', '将进酒', '蜀道难', '望庐山瀑布']
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐代',
    lifespan: '712年-770年',
    image: 'https://ai-public.mastergo.com/ai/img_res/366643f2817681373d9f22ee88d7d419.jpg',
    description: '唐代伟大的现实主义诗人，被尊为"诗圣"。其诗沉郁顿挫，反映社会现实，具有深刻的思想性。',
    famousWorks: ['春望', '登高', '茅屋为秋风所破歌', '三吏三别']
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋代',
    lifespan: '1037年-1101年',
    image: 'https://ai-public.mastergo.com/ai/img_res/2e7425258b29069ccb11441db8c4f5ec.jpg',
    description: '北宋文学家、书画家，豪放派词人的代表。其词题材广阔，清新豪健，独具风格。',
    famousWorks: ['水调歌头', '念奴娇·赤壁怀古', '江城子·密州出猎', '定风波']
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋代',
    lifespan: '1084年-1155年',
    image: 'https://ai-public.mastergo.com/ai/img_res/b79358797d23ee092612a1aea57b353b.jpg',
    description: '宋代著名女词人，婉约派代表。其词语言清丽，讲究音律，前期多写悠闲生活，后期多悲叹身世。',
    famousWorks: ['声声慢', '如梦令', '醉花阴', '一剪梅']
  },
  {
    id: 5,
    name: '徐志摩',
    dynasty: '现代',
    lifespan: '1897年-1931年',
    image: 'https://ai-public.mastergo.com/ai/img_res/6cef988e86519aeee312b949c3c77f80.jpg',
    description: '现代诗人、散文家，新月派代表诗人。其诗字句清新，韵律谐和，比喻新奇，想象丰富。',
    famousWorks: ['再别康桥', '翡冷翠的一夜', '我不知道风是在哪一个方向吹']
  }
]

const filteredPoets = computed(() => {
  return poets.filter(poet => {
    if (activeDynasty.value === 'tang') return poet.dynasty === '唐代'
    if (activeDynasty.value === 'song') return poet.dynasty === '宋代'
    if (activeDynasty.value === 'yuan') return poet.dynasty === '元代'
    if (activeDynasty.value === 'modern') return poet.dynasty === '现代'
    return true
  })
})

const viewPoetDetail = (id: number) => {
  console.log('查看诗人详情:', id)
}
</script>

<style scoped>
.poets-view {
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

.dynasty-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.dynasty-btn {
  padding: 0.8rem 1.5rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  color: #6b7280;
  transition: all 0.3s;
}

.dynasty-btn.active {
  border-color: #3b82f6;
  background-color: #3b82f6;
  color: white;
}

.dynasty-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.poets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.poet-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.poet-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.poet-image {
  height: 200px;
  overflow: hidden;
}

.poet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poet-info {
  padding: 1.5rem;
}

.poet-info h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dynasty {
  color: #3b82f6;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.lifespan {
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.famous-works h4 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.famous-works ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
}

.famous-works li {
  color: #6b7280;
  padding: 0.2rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.famous-works li:last-child {
  border-bottom: none;
}

.detail-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.detail-btn:hover {
  background-color: #2563eb;
}
</style>