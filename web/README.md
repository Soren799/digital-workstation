# 数字工作台 (Digital Workstation)

个人数字工作台 — 模块化、磁贴布局、深色模式的个人效率工具。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **后端**: Supabase (认证 + 数据库)
- **部署**: EdgeOne Pages
- **AI**: DeepSeek API (后续集成)

## 功能模块 (v1.0)

| 模块 | 状态 | 说明 |
|------|------|------|
| 🔐 认证系统 | ✅ | 邮箱登录/注册，Supabase Auth |
| 👤 角色权限 | ✅ | admin / friend / visitor 三层权限 |
| 🌙 深色模式 | ✅ | ThemeProvider + localStorage 持久化 |
| 🧩 磁贴系统 | ✅ | Notion 风格卡片，拖拽排序 |
| 📑 收藏模块 | ✅ | 链接/笔记/图片，标签分类 |

## 目录结构

```
wangzhan/
├── web/                    # Next.js 应用
│   ├── src/
│   │   ├── app/            # App Router 页面 & API Routes
│   │   │   ├── api/bookmarks/  # 收藏 API
│   │   │   ├── bookmarks/      # 收藏页面
│   │   │   ├── login/          # 登录页面
│   │   │   └── register/       # 注册页面
│   │   ├── modules/        # 独立功能模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── tiles/      # 磁贴模块
│   │   │   └── bookmarks/  # 收藏模块
│   │   ├── components/     # 全局组件
│   │   │   ├── ui/         # 基础 UI (Button, Modal, Input...)
│   │   │   ├── TopBar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── AppLayout.tsx
│   │   ├── lib/            # 工具库 & Supabase 客户端
│   │   ├── hooks/          # 全局 Hooks
│   │   └── types/          # TypeScript 类型定义
│   └── ...
└── supabase/
    └── migrations/         # 数据库迁移 SQL
        └── 001_initial_schema.sql
```

## 快速开始

### 1. 克隆项目

```bash
git clone <repo-url>
cd wangzhan/web
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入你的 Supabase 凭据：

```bash
cp .env.local.example .env.local
```

### 4. 初始化数据库

在 Supabase SQL Editor 中运行 `supabase/migrations/001_initial_schema.sql`。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 6. 部署到 EdgeOne Pages

1. 将项目推送到 GitHub
2. 在 EdgeOne Pages 控制台导入项目
3. 构建配置：
   - 构建命令: `cd web && npm install && npm run build`
   - 输出目录: `web/.next`
4. 设置环境变量：`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 角色权限

| 权限 | 管理员 | Friend | 访客 |
|------|:---:|:---:|:---:|
| 浏览公开内容 | ✅ | ✅ | ✅ |
| 创建磁贴/收藏 | ✅ | ✅ | ❌ |
| 编辑自己的内容 | ✅ | ✅ | ❌ |
| 删除自己的内容 | ✅ | ✅ | ❌ |
| 管理所有用户 | ✅ | ❌ | ❌ |

默认注册角色为**访客**，管理员可在 Supabase Dashboard 手动升级角色。

## 开发规范

- **模块化**: 新功能在 `src/modules/<name>/` 下独立开发
- **不修改已有模块**: 通过新增模块扩展功能
- **统一 UI**: 使用 `src/components/ui/` 下的基础组件
- **TypeScript**: 类型定义集中在 `src/types/`
