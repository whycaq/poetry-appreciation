/**
 * AI助手相关API
 * 提供诗词赏析、创作辅助等AI功能
 */

import { request } from './index'

// AI消息类型
export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// AI对话请求
export interface AIChatRequest {
  message: string
  context?: string
  history?: AIMessage[]
}

// AI对话响应
export interface AIChatResponse {
  reply: string
  suggestions?: string[]
}

/**
 * 发送消息给AI助手
 * @param message 用户消息
 * @param context 上下文信息（如当前正在查看的诗词）
 * @param history 对话历史
 */
export const sendAIMessage = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  try {
    // 使用真实的DeepSeek AI服务
    return await callDeepSeekAPI(message, context, history)
  } catch (error) {
    console.error('AI对话失败:', error)
    // 如果AI服务失败，返回友好的错误提示
    return {
      reply: '抱歉，AI服务暂时不可用。请稍后再试，或者检查网络连接。',
      suggestions: []
    }
  }
}

/**
 * 调用DeepSeek AI API
 */
const callDeepSeekAPI = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  // DeepSeek API配置
  const API_URL = 'https://api.deepseek.com/v1/chat/completions'
  const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'
  
  // 构建系统提示词
  const systemPrompt = `你是一个专业的中国古典诗词鉴赏和创作助手，精通唐诗、宋词、元曲等各种诗词形式。你的职责是：

1. **诗词赏析**：深入解读诗词的意境、情感、修辞手法、艺术特色
2. **创作辅助**：根据用户需求提供创作灵感、技巧指导、风格建议
3. **知识解答**：介绍诗人生平、历史背景、文学知识
4. **智能推荐**：根据用户喜好推荐合适的诗词作品
5. **学习指导**：提供诗词学习方法和鉴赏技巧

回答要求：
- 专业准确，引经据典
- 通俗易懂，深入浅出
- 富有文采，体现诗词之美
- 回答简洁明了，重点突出
- 适当使用emoji让对话更生动
- 每次回答后，可以提供2-3个相关的建议问题`

  // 构建消息历史
  const messages: any[] = [
    {
      role: 'system',
      content: systemPrompt
    }
  ]

  // 添加对话历史（最近5轮）
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10) // 只保留最近10条消息
    recentHistory.forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role,
          content: msg.content
        })
      }
    })
  }

  // 添加当前消息
  let userMessage = message
  if (context) {
    userMessage = `${context}\n\n${message}`
  }
  
  messages.push({
    role: 'user',
    content: userMessage
  })

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const aiReply = data.choices[0].message.content

    // 从回复中提取建议问题（如果AI提供了）
    const suggestions = extractSuggestions(aiReply)

    return {
      reply: aiReply,
      suggestions: suggestions
    }
  } catch (error) {
    console.error('DeepSeek API调用失败:', error)
    throw error
  }
}

/**
 * 从AI回复中提取建议问题
 */
const extractSuggestions = (reply: string): string[] => {
  const suggestions: string[] = []
  
  // 尝试匹配常见的建议问题格式
  const patterns = [
    /(?:您可以问|可以问|你可以问)[:：]?\s*(.+)/gi,
    /(?:建议|推荐)(?:问题|提问)[:：]?\s*(.+)/gi,
    /(?:相关问题)[:：]?\s*(.+)/gi
  ]

  for (const pattern of patterns) {
    const matches = reply.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        // 分割多个问题
        const questions = match[1].split(/[、，,；;]/).map(q => q.trim()).filter(q => q.length > 0 && q.length < 30)
        suggestions.push(...questions.slice(0, 3))
      }
    }
  }

  // 如果没有提取到建议，返回默认建议
  if (suggestions.length === 0) {
    return ['告诉我更多', '换个话题', '推荐相关诗词']
  }

  return suggestions.slice(0, 3) // 最多返回3个建议
}

/**
 * 模拟AI响应（用于演示和备用）
 * 当真实AI服务不可用时使用
 */
const simulateAIResponse = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const lowerMessage = message.toLowerCase()
  
  // 智能回复逻辑
  if (lowerMessage.includes('创作') || lowerMessage.includes('写诗') || lowerMessage.includes('作诗')) {
    return {
      reply: '我可以帮您创作诗词！请告诉我：\n\n1. 想要创作什么主题的诗？（如：春天、思念、山水等）\n2. 喜欢什么风格？（如：李白豪放、杜甫沉郁、李清照婉约等）\n3. 有什么特定的意象或词语想要包含吗？\n\n您也可以直接点击下方的"AI创作诗词"按钮，我会引导您完成创作！',
      suggestions: ['创作一首关于春天的诗', '写一首思乡的诗', '模仿李白的风格']
    }
  }
  
  if (lowerMessage.includes('赏析') || lowerMessage.includes('解读') || lowerMessage.includes('分析')) {
    return {
      reply: '我很乐意为您赏析诗词！您可以：\n\n1. 告诉我具体的诗名，我会为您详细解读\n2. 粘贴诗词内容，我会分析其意境、修辞和艺术手法\n3. 在诗词详情页点击"AI赏析"按钮，获得深入分析\n\n比如，您想了解哪首诗的深层含义？',
      suggestions: ['赏析《静夜思》', '解读李白的诗', '分析诗词意境']
    }
  }
  
  if (lowerMessage.includes('推荐') || lowerMessage.includes('有什么') || lowerMessage.includes('好的')) {
    return {
      reply: '根据您的兴趣，我为您推荐以下诗词：\n\n📖 **唐诗篇**：\n• 李白《将进酒》- 豪放洒脱的人生态度\n• 杜甫《春望》- 忧国忧民的家国情怀\n\n📖 **宋词篇**：\n• 苏轼《水调歌头》- 旷达乐观的人生哲理\n• 李清照《声声慢》- 细腻婉约的情感表达\n\n您可以在首页的"热门诗词推荐"区域浏览更多经典作品！',
      suggestions: ['推荐李白的诗', '推荐宋词', '推荐边塞诗']
    }
  }
  
  if (lowerMessage.includes('李白') || lowerMessage.includes('诗人') || lowerMessage.includes('作者')) {
    return {
      reply: '关于诗人的信息，我可以帮您了解：\n\n🎨 **生平经历** - 诗人的人生轨迹\n📚 **代表作品** - 经典名篇赏析\n✍️ **创作风格** - 艺术特色解析\n💫 **历史影响** - 文学地位评价\n\n您可以访问"诗人介绍"页面，那里有更详细的诗人资料。您想了解哪位诗人？',
      suggestions: ['介绍李白', '介绍杜甫', '介绍苏轼']
    }
  }
  
  if (lowerMessage.includes('帮助') || lowerMessage.includes('功能') || lowerMessage.includes('怎么用')) {
    return {
      reply: '欢迎使用诗词赏析AI助手！我可以帮您：\n\n🎭 **诗词赏析** - 深入解读诗词的意境、修辞和艺术手法\n✨ **创作辅助** - 根据主题和风格生成诗词，提供创作灵感\n📚 **知识问答** - 解答诗词相关的问题，介绍诗人和历史背景\n🎯 **智能推荐** - 根据您的偏好推荐合适的诗词\n🎮 **学习指导** - 提供诗词学习方法和技巧\n\n直接输入您的问题，或点击下方的快捷问题开始吧！',
      suggestions: ['如何学习诗词', '诗词的格律是什么', '如何提高诗词鉴赏能力']
    }
  }
  
  // 默认回复
  return {
    reply: `您好！我是您的诗词AI助手。您提到了"${message}"，这是一个很有趣的话题！\n\n我可以帮您：\n• 赏析任何诗词的深层含义\n• 辅助您创作原创诗词\n• 推荐适合您的经典作品\n• 解答诗词相关的疑问\n\n您想了解更多关于哪方面的内容呢？`,
    suggestions: ['诗词赏析', '创作诗词', '推荐诗词', '学习指导']
  }
}

/**
 * 获取快捷问题列表
 */
export const getQuickQuestions = (): string[] => {
  return [
    '帮我赏析一首诗',
    '我想创作一首诗',
    '推荐一些经典诗词',
    '如何学习诗词',
    '介绍唐诗宋词',
    '诗词格律知识'
  ]
}

/**
 * 诗词赏析
 * @param poemTitle 诗词标题
 * @param poemContent 诗词内容
 */
export const analyzePoem = async (
  poemTitle: string,
  poemContent: string
): Promise<string> => {
  try {
    // TODO: 调用真实的AI API进行深度赏析
    return `《${poemTitle}》赏析\n\n这首诗意境深远，通过精妙的意象和修辞手法，表达了诗人的情感...\n\n（这是模拟的赏析内容，实际使用时需要接入真实的AI服务）`
  } catch (error) {
    console.error('诗词赏析失败:', error)
    throw error
  }
}

/**
 * 诗词创作 - 根据主题生成诗词
 * @param theme 主题
 * @param style 风格
 * @param keywords 关键词
 * @param length 长度（句数）
 */
export const generatePoem = async (
  theme: string,
  style: string,
  keywords?: string[],
  length: number = 8
): Promise<{ title: string; content: string }> => {
  try {
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'
    const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'

    // 构建提示词
    const styleDescriptions: Record<string, string> = {
      'classical': '古典风格，遵循古代诗词格律，用词典雅',
      'modern': '现代风格，语言清新自然，不拘泥于格律',
      'romantic': '浪漫风格，充满诗意和想象力',
      'bold': '豪放风格，气势磅礴，豪迈奔放',
      'graceful': '婉约风格，细腻柔美，含蓄深沉'
    }

    const lengthDescription = length <= 8 ? '短诗（4-8句）' : length <= 16 ? '中诗（10-16句）' : '长诗（18-20句）'

    let prompt = `请创作一首${styleDescriptions[style] || style}的诗词。

创作要求：
- 主题：${theme}
- 风格：${styleDescriptions[style] || style}
- 长度：${lengthDescription}，约${length}句
${keywords && keywords.length > 0 ? `- 关键词：${keywords.join('、')}（请在诗中巧妙融入这些关键词）` : ''}

请直接给出诗词内容，格式如下：
标题：[诗词标题]
内容：
[第一句]
[第二句]
...

要求：
1. 诗词要有意境美感
2. 注意韵律和节奏
3. 用词要精炼优美
4. 表达要含蓄深刻`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的诗词创作大师，精通各种诗词格律和创作技巧。你的创作富有意境，用词精炼，善于运用各种修辞手法。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9, // 提高创造性
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status}`)
    }

    const data = await response.json()
    const aiReply = data.choices[0].message.content

    // 解析AI返回的内容
    const titleMatch = aiReply.match(/标题[：:]\s*[《「『]?(.+?)[》」』]?[\n\r]/i)
    const contentMatch = aiReply.match(/内容[：:]?\s*[\n\r]+([\s\S]+)/i)

    let title = titleMatch ? titleMatch[1].trim() : `${theme}·诗`
    let content = contentMatch ? contentMatch[1].trim() : aiReply

    // 清理内容，移除标题行
    content = content.replace(/^标题[：:].*$/gm, '')
                     .replace(/^内容[：:].*$/gm, '')
                     .trim()

    return { title, content }
  } catch (error) {
    console.error('诗词创作失败:', error)
    throw error
  }
}

/**
 * 优化诗词 - 改进现有诗词
 * @param originalPoem 原始诗词内容
 * @param improvementType 改进类型
 */
export const improvePoem = async (
  originalPoem: string,
  improvementType: 'grammar' | 'rhythm' | 'imagery' | 'overall' = 'overall'
): Promise<{ improved: string; suggestions: string }> => {
  try {
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'
    const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'

    const improvementDescriptions: Record<string, string> = {
      'grammar': '语法和用词',
      'rhythm': '韵律和节奏',
      'imagery': '意境和意象',
      'overall': '全面优化'
    }

    const prompt = `请帮我优化以下诗词，重点改进${improvementDescriptions[improvementType]}：

原诗：
${originalPoem}

请提供：
1. 优化后的诗词（保持原意，提升表达）
2. 具体的改进说明（解释为什么这样修改）

格式：
优化版本：
[优化后的诗词]

改进说明：
[详细说明每处修改的原因]`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的诗词编辑和评论家，擅长发现诗词中的问题并提供建设性的改进建议。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status}`)
    }

    const data = await response.json()
    const aiReply = data.choices[0].message.content

    // 解析回复
    const improvedMatch = aiReply.match(/优化版本[：:]?\s*[\n\r]+([\s\S]+?)(?=[\n\r]*改进说明|$)/i)
    const suggestionsMatch = aiReply.match(/改进说明[：:]?\s*[\n\r]+([\s\S]+)/i)

    return {
      improved: improvedMatch ? improvedMatch[1].trim() : aiReply,
      suggestions: suggestionsMatch ? suggestionsMatch[1].trim() : '已优化诗词内容'
    }
  } catch (error) {
    console.error('诗词优化失败:', error)
    throw error
  }
}

/**
 * 押韵建议 - 提供押韵词汇建议
 * @param currentLine 当前诗句
 * @param rhymePosition 押韵位置（句尾字）
 */
export const getRhymeSuggestions = async (
  currentLine: string,
  rhymePosition: string
): Promise<string[]> => {
  try {
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'
    const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'

    const prompt = `请为以下诗句提供押韵建议：

当前诗句：${currentLine}
需要押韵的字：${rhymePosition}

请提供10个与"${rhymePosition}"押韵的字，要求：
1. 与"${rhymePosition}"同韵母
2. 适合用于诗词创作
3. 意境优美
4. 提供简短的使用示例

格式：
1. [字] - [示例短语]
2. [字] - [示例短语]
...`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位精通诗词韵律的专家，熟知各种韵部和押韵规则。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status}`)
    }

    const data = await response.json()
    const aiReply = data.choices[0].message.content

    // 解析押韵建议
    const suggestions: string[] = []
    const lines = aiReply.split('\n')
    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+)/)
      if (match) {
        suggestions.push(match[1].trim())
      }
    }

    return suggestions.length > 0 ? suggestions : ['明、清、晴、情、声、鸣、轻、青、盈']
  } catch (error) {
    console.error('获取押韵建议失败:', error)
    throw error
  }
}

/**
 * 续写诗句 - 根据前文续写
 * @param previousLines 前面的诗句
 * @param style 风格
 */
export const continuePoem = async (
  previousLines: string,
  style: string = 'classical'
): Promise<string> => {
  try {
    const API_URL = 'https://api.deepseek.com/v1/chat/completions'
    const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'

    const prompt = `请续写以下诗句，保持风格一致：

已有内容：
${previousLines}

要求：
1. 续写2-4句
2. 保持与前文风格、韵律一致
3. 意境连贯，自然流畅
4. 只给出续写的诗句，不要其他说明`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位诗词续写专家，能够准确把握诗词的风格、意境和韵律，续写出浑然天成的诗句。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`AI服务请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('诗句续写失败:', error)
    throw error
  }
}

