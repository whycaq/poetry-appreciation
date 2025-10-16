# AI诗歌鉴赏应用

基于Vue 3 + TypeScript + Vite构建的现代化AI诗歌鉴赏与创作平台。

## 项目特色

- 🎨 **现代化UI设计** - 采用Element Plus组件库，提供优雅的用户界面
- 📱 **响应式布局** - 完美适配桌面端和移动端设备
- 🔧 **TypeScript支持** - 完整的类型检查，提高代码质量
- 🚀 **Vite构建** - 快速的开发服务器和构建工具
- 📚 **组件化开发** - 高度可复用的组件架构
- 🌐 **网络请求封装** - 统一的API管理和错误处理
- 🎯 **状态管理** - 使用Pinia进行状态管理

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **开发语言**: TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **路由管理**: Vue Router 4
- **状态管理**: Pinia
- **后端服务**: Supabase (PostgreSQL 17.6)
- **用户认证**: Supabase Auth
- **轮播组件**: Swiper
- **部署平台**: Vercel + Supabase

## 项目结构

```
src/
├── api/                          # API接口管理
│   ├── poetry.ts                 # 诗词相关API（12个函数）
│   ├── user.ts                   # 用户相关API（9个函数）
│   └── index.ts                  # API统一导出
├── components/                   # 通用组件
│   ├── NavBar.vue                # 导航栏
│   ├── UserAuth.vue              # 用户认证
│   ├── PoetryGame.vue            # 诗词游戏
│   ├── UserLevelCard.vue         # ⭐ 用户成长卡片
│   ├── DailyRecommendation.vue   # ⭐ 每日推荐
│   └── StudyCheckIn.vue          # ⭐ 学习打卡
├── views/                        # 页面组件
│   ├── HomeView.vue              # 首页（含每日推荐）
│   ├── PoetryListView.vue        # 诗词列表（支持分页搜索）
│   ├── PoetryDetailView.vue      # 诗词详情（含翻译赏析）
│   ├── PoetryCategoryView.vue    # 分类浏览
│   ├── PoetsView.vue             # 诗人列表
│   ├── PoetDetailView.vue        # ⭐ 诗人详情
│   └── ...
├── store/                        # 状态管理
├── router/                       # 路由配置
├── utils/                        # 工具函数
├── types/                        # 类型定义
├── lib/                          # 第三方库配置
│   └── supabase.ts               # Supabase客户端
└── assets/                       # 静态资源
    └── css/                      # 样式文件
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 功能模块

### 📖 诗歌鉴赏
- ✅ 诗歌列表展示（支持分页、搜索、筛选）
- ✅ 诗歌详情查看（含翻译和赏析）
- ✅ 诗歌分类浏览（7个分类）
- ✅ 全文搜索功能
- ✅ 智能点赞系统（支持取消点赞）
- ✅ 浏览历史记录
- ✅ 精选诗词推荐
- ✅ 难度等级标识

### 👤 诗人介绍
- ✅ 诗人列表展示（6位诗人）
- ✅ 诗人详情页面
- ✅ 诗人作品列表
- ✅ 按朝代筛选诗人
- ✅ 诗人生平简介

### 🎮 互动功能
- ✅ 每日推荐（智能推荐算法）
- ✅ 用户成长系统（等级、经验、称号）
- ✅ 学习打卡（30天日历）
- ✅ 诗词小游戏（飞花令）

### 👨‍💻 用户中心
- ✅ 用户登录注册（Supabase Auth）
- ✅ 收藏管理
- ✅ 浏览历史
- ✅ 个人统计

### 🎨 AI创作
- 智能诗歌生成
- 诗歌风格选择
- 创作参数调整

## 开发规范

本项目遵循严格的代码规范和最佳实践，确保代码质量和可维护性。详细规范请参考项目根目录下的`.cursorrules`文件。

## 许可证

MIT License