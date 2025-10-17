# 📦 Netlify部署指南

## 🚀 快速部署步骤

### 方法1：通过GitHub自动部署（推荐）

#### 第1步：登录Netlify
1. 访问 https://www.netlify.com/
2. 点击 "Sign up" 或 "Log in"
3. 选择 "GitHub" 登录（或其他方式）

#### 第2步：导入GitHub仓库
1. 登录后，点击 "Add new site" → "Import an existing project"
2. 选择 "Deploy with GitHub"
3. 授权Netlify访问你的GitHub账号
4. 在仓库列表中找到 `poetry-appreciation`
5. 点击该仓库

#### 第3步：配置构建设置

**基本设置：**
```
Site name: poetry-appreciation-ai (或你喜欢的名字)
Branch to deploy: master
```

**构建设置：**
```
Base directory: (留空)
Build command: npm run build
Publish directory: dist
```

**环境变量：**（如果需要）
```
VITE_SUPABASE_URL=你的Supabase URL
VITE_SUPABASE_ANON_KEY=你的Supabase匿名密钥
VITE_AI_API_KEY=你的DeepSeek API密钥（可选）
```

#### 第4步：部署
1. 检查所有配置无误
2. 点击 "Deploy site"
3. 等待构建完成（约2-5分钟）
4. 部署成功！

---

## 📋 详细配置说明

### 构建配置

| 配置项 | 值 | 说明 |
|-------|-----|------|
| **Base directory** | (空) | 项目根目录 |
| **Build command** | `npm run build` | Vite构建命令 |
| **Publish directory** | `dist` | 构建输出目录 |
| **Functions directory** | (空) | 无需配置 |

### 环境变量配置

在 Netlify 控制台中设置环境变量：

1. 进入你的站点
2. 点击 "Site settings"
3. 找到 "Environment variables"
4. 点击 "Add a variable"

**必需的环境变量：**

#### Supabase配置
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**可选的环境变量：**

#### AI服务配置
```bash
VITE_AI_API_KEY=sk-your-deepseek-api-key
VITE_AI_API_URL=https://api.deepseek.com/v1/chat/completions
VITE_AI_MODEL=deepseek-chat
```

---

## 🔐 环境变量安全配置

### 当前问题
API密钥目前直接写在代码中，不安全！

### 解决方案

#### 第1步：修改代码使用环境变量

在 `src/api/ai.ts` 中修改：

```typescript
// 修改前（不安全）
const API_KEY = 'sk-4a4be4e498254785a124e514e3378997'

// 修改后（安全）
const API_KEY = import.meta.env.VITE_AI_API_KEY || 'sk-4a4be4e498254785a124e514e3378997'
```

#### 第2步：创建本地环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Supabase配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# DeepSeek AI配置
VITE_AI_API_KEY=sk-your-api-key
VITE_AI_API_URL=https://api.deepseek.com/v1/chat/completions
VITE_AI_MODEL=deepseek-chat
```

**注意：** `.env.local` 已在 `.gitignore` 中，不会被提交到GitHub

#### 第3步：在Netlify中配置环境变量

在Netlify控制台添加相同的环境变量。

---

## 🌐 自定义域名

### 使用Netlify提供的域名
默认域名格式：`your-site-name.netlify.app`

### 绑定自定义域名

1. 在Netlify控制台，点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入你的域名（如：poetry.yourdomain.com）
4. 按照提示配置DNS记录

**DNS配置示例：**
```
类型: CNAME
名称: poetry (或 @ 用于根域名)
值: your-site-name.netlify.app
```

---

## 🔄 自动部署

### GitHub自动部署（已配置）
- ✅ 每次推送到master分支自动部署
- ✅ Pull Request会创建预览部署
- ✅ 部署状态会显示在GitHub

### 手动触发部署
1. 在Netlify控制台
2. 点击 "Deploys"
3. 点击 "Trigger deploy" → "Deploy site"

---

## 🎯 部署后检查清单

### ✅ 基本功能
- [ ] 网站能正常访问
- [ ] 首页正常显示
- [ ] 导航正常工作
- [ ] 所有页面路由正常

### ✅ API功能
- [ ] Supabase连接正常
- [ ] 可以获取诗词数据
- [ ] 用户登录注册正常
- [ ] AI助手可以正常对话

### ✅ AI功能
- [ ] AI聊天助手正常
- [ ] AI诗词生成功能正常
- [ ] AI优化功能正常
- [ ] 押韵建议功能正常

### ✅ 性能优化
- [ ] 页面加载速度快
- [ ] 图片正常显示
- [ ] 移动端适配良好
- [ ] 无控制台错误

---

## 🐛 常见问题解决

### 问题1：部署失败 - 构建错误
**错误信息：** Build failed

**解决方法：**
```bash
# 检查本地是否能正常构建
npm run build

# 如果本地构建成功，检查Node版本
# Netlify默认使用Node 18
```

### 问题2：页面404 - 路由不工作
**原因：** Vue Router的history模式需要服务器配置

**解决方法：** 
已在 `netlify.toml` 中配置重定向规则。如果还有问题，检查该文件是否存在。

### 问题3：环境变量不生效
**原因：** 环境变量配置错误或未重新部署

**解决方法：**
1. 确认变量名以 `VITE_` 开头
2. 在Netlify控制台检查变量是否正确
3. 修改环境变量后需要重新部署

### 问题4：API调用失败
**原因：** 环境变量未配置或Supabase连接问题

**解决方法：**
1. 检查Supabase URL和密钥是否正确
2. 在浏览器控制台查看具体错误
3. 检查Supabase项目是否正常运行

### 问题5：AI功能不工作
**原因：** DeepSeek API密钥未配置或CORS问题

**解决方法：**
1. 在Netlify环境变量中添加 `VITE_AI_API_KEY`
2. 检查API密钥是否有效
3. 如有CORS错误，考虑使用Netlify Functions代理

---

## ⚡ 性能优化建议

### 1. 启用CDN加速
Netlify默认启用全球CDN，无需额外配置。

### 2. 配置缓存
在 `netlify.toml` 中添加：

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 3. 图片优化
使用Netlify的图片优化服务：

```html
<img src="/.netlify/images?url=/path/to/image.jpg&w=800" />
```

### 4. 预渲染
对于SEO，可以配置预渲染：

```toml
[[plugins]]
  package = "@netlify/plugin-sitemap"
```

---

## 📊 监控和分析

### 1. 部署日志
在 "Deploys" 标签页查看详细的构建日志。

### 2. 性能监控
Netlify Analytics（付费功能）可以监控：
- 页面访问量
- 加载性能
- 地理分布

### 3. 错误监控
建议集成第三方监控服务：
- Sentry（错误追踪）
- Google Analytics（访问统计）

---

## 🎓 进阶配置

### 使用Netlify Functions（可选）

如果需要隐藏API密钥，可以使用Netlify Functions：

#### 1. 创建函数目录
```bash
mkdir netlify/functions
```

#### 2. 创建AI代理函数
`netlify/functions/ai-chat.js`:

```javascript
exports.handler = async (event) => {
  const { message } = JSON.parse(event.body)
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: message }]
    })
  })
  
  const data = await response.json()
  
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  }
}
```

#### 3. 前端调用
```typescript
const response = await fetch('/.netlify/functions/ai-chat', {
  method: 'POST',
  body: JSON.stringify({ message: 'hello' })
})
```

### 配置Split Testing（A/B测试）

```toml
[[redirects]]
  from = "/*"
  to = "/test-version/:splat"
  status = 200
  force = false
  conditions = {Cookie = ["ab_test=b"]}
```

---

## 📱 移动端优化

### PWA配置
添加 `public/manifest.json`:

```json
{
  "name": "AI诗词赏析",
  "short_name": "诗词AI",
  "description": "AI驱动的诗词鉴赏与创作平台",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

---

## 🎉 部署完成后

### 分享你的网站
```
网站地址：https://your-site-name.netlify.app
GitHub：https://github.com/whycaq/poetry-appreciation
```

### 继续改进
- 添加更多AI功能
- 优化用户体验
- 收集用户反馈
- 持续更新内容

---

## 📞 获取帮助

### Netlify官方资源
- 文档：https://docs.netlify.com/
- 社区：https://answers.netlify.com/
- 支持：support@netlify.com

### 项目相关
- GitHub Issues：在你的仓库创建Issue
- 查看项目文档：README.md

---

**祝部署顺利！** 🚀

如有问题，随时查看此文档或咨询技术支持。

