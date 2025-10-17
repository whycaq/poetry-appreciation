# AI聊天助手使用指南

## 📝 功能概述

AI聊天助手是一个智能的诗词学习辅助工具，可以帮助您：
- 🎭 **诗词赏析** - 深入解读诗词意境、修辞和艺术手法
- ✨ **创作辅助** - 提供创作灵感和技巧指导
- 📚 **知识问答** - 解答诗词相关问题，介绍诗人和历史背景
- 🎯 **智能推荐** - 根据您的偏好推荐合适的诗词
- 🎮 **学习指导** - 提供诗词学习方法和技巧

## 🎨 界面介绍

### 悬浮按钮
- **位置**: 页面右下角
- **功能**: 点击打开/关闭聊天窗口
- **提示**: 有新消息时会显示红点提醒

### 聊天窗口
- **头部**: 显示AI助手状态和功能按钮
- **消息区**: 显示对话历史
- **输入框**: 输入您的问题
- **快捷问题**: 点击快速发送常见问题

## 💡 使用技巧

### 1. 诗词赏析
您可以这样问：
```
"帮我赏析《静夜思》"
"分析一下李白这首诗的意境"
"这首诗用了什么修辞手法？"
```

### 2. 创作辅助
您可以这样问：
```
"我想创作一首关于春天的诗"
"如何写出李白风格的诗？"
"帮我续写这首诗"
```

### 3. 知识问答
您可以这样问：
```
"介绍一下李白的生平"
"唐诗和宋词有什么区别？"
"什么是格律诗？"
```

### 4. 学习指导
您可以这样问：
```
"如何学习诗词鉴赏？"
"初学者应该从哪些诗开始读？"
"如何提高诗词创作能力？"
```

## 🚀 快捷功能

### 预设问题
首次打开聊天窗口时，会显示6个常用快捷问题：
1. 帮我赏析一首诗
2. 我想创作一首诗
3. 推荐一些经典诗词
4. 如何学习诗词
5. 介绍唐诗宋词
6. 诗词格律知识

### 建议问题
AI回答后，可能会显示相关的建议问题，点击即可快速询问。

### 对话历史
- 自动保存最近50条对话记录
- 刷新页面后对话历史会自动恢复
- 点击头部的"🗑️"按钮可以清空所有对话

## ⚙️ 技术说明

### 当前状态
目前使用的是**模拟AI响应**，用于演示功能和界面。

### 接入真实AI服务

要启用真实的AI功能，需要在 `src/api/ai.ts` 文件中配置AI服务：

#### 方案1：使用讯飞星火（推荐）

```typescript
export const sendAIMessage = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  const response = await fetch('https://spark-api.xf-yun.com/v3.5/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    },
    body: JSON.stringify({
      model: 'spark-v3.5',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的诗词鉴赏和创作助手，精通中国古典诗词...'
        },
        ...history,
        {
          role: 'user',
          content: message
        }
      ]
    })
  })
  
  const data = await response.json()
  return {
    reply: data.choices[0].message.content,
    suggestions: [] // 可以根据回复内容生成建议
  }
}
```

#### 方案2：使用文心一言

```typescript
export const sendAIMessage = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_ACCESS_TOKEN`
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    })
  })
  
  const data = await response.json()
  return {
    reply: data.result,
    suggestions: []
  }
}
```

#### 方案3：使用通义千问

```typescript
export const sendAIMessage = async (
  message: string,
  context?: string,
  history?: AIMessage[]
): Promise<AIChatResponse> => {
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer YOUR_API_KEY`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      }
    })
  })
  
  const data = await response.json()
  return {
    reply: data.output.text,
    suggestions: []
  }
}
```

### 环境变量配置

在项目根目录创建 `.env` 文件：

```env
# AI服务配置
VITE_AI_API_URL=https://your-ai-service.com/api
VITE_AI_API_KEY=your_api_key_here
VITE_AI_MODEL=spark-v3.5
```

然后在代码中使用：

```typescript
const AI_API_URL = import.meta.env.VITE_AI_API_URL
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY
```

## 🔐 安全建议

1. **API密钥保护**
   - 不要在前端代码中直接暴露API密钥
   - 建议通过后端服务器代理AI请求
   - 使用环境变量管理敏感信息

2. **速率限制**
   - 实现请求频率控制，避免过度调用
   - 设置每日/每小时请求上限

3. **内容过滤**
   - 对用户输入进行内容审核
   - 过滤敏感词和不当内容

## 📱 响应式设计

- **桌面端**: 右下角显示为固定大小的聊天窗口（400x600px）
- **移动端**: 点击后全屏显示，提供更好的输入体验
- **平板**: 自动适配屏幕大小

## 🎯 未来功能规划

- [ ] 语音输入支持
- [ ] 图片识别诗词
- [ ] 多轮对话上下文理解
- [ ] 个性化推荐系统
- [ ] 诗词朗诵功能
- [ ] 社交分享功能

## 🐛 问题反馈

如遇到问题，请检查：
1. 浏览器控制台是否有错误信息
2. 网络连接是否正常
3. AI服务是否正确配置

## 📚 相关文档

- [Vue.js官方文档](https://vuejs.org/)
- [TypeScript文档](https://www.typescriptlang.org/)
- [讯飞星火API文档](https://www.xfyun.cn/doc/spark/Web.html)
- [文心一言API文档](https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html)

---

**版权所有 © 2024 AI诗词赏析平台**

