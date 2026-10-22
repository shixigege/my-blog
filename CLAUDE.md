# shixigege's Blog 开发指南

## 项目定位
- 框架：Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- 样式：Tailwind CSS v4 (CSS-first)
- 部署：GitHub Pages 纯静态导出 (`output: "export"`, `basePath: "/my-blog"`, `trailingSlash: true`)
- 风格：现代大报风格（Modern Broadsheet / Editorial）

## 路由规范
- `/`：头版（头条专稿 + 二版精选 + 特派报童 + 分类广告格）
- `/blog`：专栏总览索引
- `/blog/[slug]`：专稿详情（服务端静态预渲染）
- `/archive`：编年合订归档
- `/tags` & `/tags/[tag]`：活字字盘与专题文章
- `/friends`：同好通讯录与登报申请（mailto 协议）
- `/about`：主编档案与编辑部名录

## 关键约束
1. 静态导出无后端运行时，禁止引入 API Routes / Middleware。
2. 客户端资源与图片 fetch 必须拼接 `process.env.NEXT_PUBLIC_BASE_PATH`。
3. 中文标签路由必须使用 `encodeURIComponent`。
