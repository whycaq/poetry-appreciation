# DeepSeek AI 配置指南

## ✅ 已完成配置

恭喜！你的AI聊天助手已经成功接入DeepSeek AI服务！

### 当前配置
- **AI服务**: DeepSeek
- **模型**: deepseek-chat
- **API地址**: https://api.deepseek.com/v1/chat/completions
- **状态**: ✅ 已配置完成

## 🎯 功能特性

### AI助手能力
你的AI助手现在具备以下能力：

1. **诗词赏析** 📖
   - 深入解读诗词意境、情感
   - 分析修辞手法和艺术特色
   - 解释典故和文化背景

2. **创作辅助** ✍️
   - 提供创作灵感和技巧
   - 给出风格建议
   - 帮助修改润色

3. **知识问答** 🎓
   - 介绍诗人生平
   - 讲解历史背景
   - 普及文学知识

4. **智能推荐** 🌟
   - 根据喜好推荐诗词
   - 提供相关作品
   - 个性化建议

5. **学习指导** 📚
   - 诗词学习方法
   - 鉴赏技巧提升
   - 创作能力培养

## 🔧 技术细节

### API调用配置
```typescript
API URL: https://api.deepseek.com/v1/chat/completions
Model: deepseek-chat
Temperature: 0.7 (创意性和准确性的平衡)
Max Tokens: 2000 (单次回复最大长度)
```

### 系统提示词
AI助手使用专业的系统提示词，专注于：
- 中国古典诗词鉴赏
- 创作辅助
- 通俗易懂的解释
- 富有文采的表达

### 对话历史管理
- 保留最近10条消息作为上下文
- 自动管理对话连贯性
- 智能提取建议问题

## 🚀 如何使用

### 1. 打开网站
访问: http://localhost:5173

### 2. 点击AI助手按钮
在页面右下角找到紫色的"💬 AI助手"按钮

### 3. 开始对话
尝试以下问题：
- "帮我赏析李白的《静夜思》"
- "我想创作一首关于秋天的诗"
- "推荐一些边塞诗"
- "如何提高诗词鉴赏能力"

### 4. 使用快捷问题
点击预设的快捷问题快速开始对话

## 💰 成本说明

### DeepSeek定价（截至2024年）
- **输入**: ¥1/百万tokens
- **输出**: ¥2/百万tokens

### 成本估算示例
假设你的网站有1000个活跃用户：
- 每用户每月对话10次
- 每次对话平均500 tokens（输入+输出）
- 月总消耗: 1000用户 × 10次 × 500 tokens = 500万tokens
- **月成本**: 约 ¥10-20元

### 优化建议
1. 限制每次回复的最大tokens数
2. 设置用户每日对话次数上限
3. 缓存常见问题的回复
4. 只保留必要的对话历史

## 🔒 安全建议

### ⚠️ 重要提醒

**API密钥已直接写在代码中，存在安全风险！**

### 生产环境配置

#### 方案1: 使用环境变量（推荐）
在项目根目录创建 `.env.local` 文件：
```bash
VITE_AI_API_KEY=你的密钥
```

然后修改 `src/api/ai.ts`：
```typescript
const API_KEY = import.meta.env.VITE_AI_API_KEY
```

#### 方案2: 后端代理（最安全）
1. 创建后端API接口
2. 在后端调用DeepSeek API
3. 前端只调用自己的后端

示例结构：
```
前端 → 你的后端(/api/ai/chat) → DeepSeek API
```

优点：
- API密钥完全隐藏
- 可以添加访问控制
- 可以监控和限流
- 防止密钥泄露

#### 方案3: Serverless函数
使用Vercel/Netlify的Serverless函数：
```javascript
// api/chat.js
export default async function handler(req, res) {
  const response = await fetch('https://api.deepseek.com/...', {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify(req.body)
  })
  
  const data = await response.json()
  res.json(data)
}
```

### 密钥管理最佳实践
1. ✅ 使用环境变量
2. ✅ 添加到.gitignore
3. ✅ 定期更换密钥
4. ✅ 监控API使用量
5. ❌ 不要提交到Git
6. ❌ 不要分享给他人
7. ❌ 不要直接写在代码中

## 🐛 故障排查

### 问题1: AI没有回复
**可能原因**:
- 网络连接问题
- API密钥无效
- DeepSeek服务异常
- CORS跨域问题

**解决方法**:
1. 检查浏览器控制台错误信息
2. 验证API密钥是否正确
3. 检查网络连接
4. 查看DeepSeek服务状态

### 问题2: 回复速度慢
**可能原因**:
- 网络延迟
- 请求tokens过多
- DeepSeek服务繁忙

**解决方法**:
1. 减少max_tokens设置
2. 减少对话历史长度
3. 优化提示词长度

### 问题3: CORS错误
**解决方法**:
如果遇到CORS跨域问题，需要使用后端代理：

```typescript
// 不直接调用DeepSeek
// 而是调用自己的后端
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
})
```

## 📊 监控和优化

### 使用情况监控
建议添加以下监控：
1. API调用次数统计
2. Token消耗统计
3. 响应时间监控
4. 错误率追踪

### 性能优化
1. **缓存机制**: 缓存常见问题的回复
2. **请求合并**: 批量处理相似请求
3. **预加载**: 预测用户可能的问题
4. **降级策略**: AI服务失败时的备用方案

## 🎓 进阶功能

### 添加流式响应
让AI的回复像打字一样逐字显示：
```typescript
const response = await fetch(API_URL, {
  // ... 其他配置
  body: JSON.stringify({
    model: 'deepseek-chat',
    messages: messages,
    stream: true  // 启用流式响应
  })
})
```

### 添加语音对话
1. 使用Web Speech API获取语音输入
2. 转换为文字发送给AI
3. 将AI回复转为语音播放

### 添加图片识别
集成OCR服务，识别诗词图片：
1. 用户上传诗词图片
2. OCR识别文字
3. 发送给AI进行赏析

## 📝 常见问题

### Q: DeepSeek和其他AI服务相比如何？
A: DeepSeek的优势：
- 价格便宜（比GPT-4便宜90%以上）
- 中文理解能力强
- 响应速度快
- 稳定性好

### Q: 如何切换到其他AI服务？
A: 修改 `src/api/ai.ts` 中的API_URL和API_KEY即可：
- OpenAI: https://api.openai.com/v1/chat/completions
- 讯飞星火: https://spark-api.xf-yun.com/v3.5/chat
- 文心一言: https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions

### Q: 可以离线使用吗？
A: 不可以。AI服务需要联网调用。但可以考虑：
- 缓存常见问题的回复
- 提供基础的离线功能
- 使用本地小模型（需要额外配置）

## 🎉 下一步

现在你的AI助手已经完全配置好了！

建议你：
1. ✅ 测试各种对话场景
2. ✅ 优化系统提示词
3. ✅ 添加用户反馈功能
4. ✅ 监控API使用情况
5. ✅ 准备生产环境部署

---

**配置时间**: 2024年
**文档版本**: 1.0
**技术支持**: DeepSeek AI + Vue 3

