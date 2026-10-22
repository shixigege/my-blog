# shixigege's Blog

计算机专业学生的个人博客 · 现代大报风格（Modern Broadsheet / Editorial Aesthetic）。

基于 Next.js 16、React 19、Tailwind CSS v4 与 TypeScript 构建，纯静态导出（SSG）并部署于 GitHub Pages。

## 🌟 特性

- **报纸排版美学**：中英双语大报头（Masthead）、报耳元数据（Ears）、双细线（Oxford Rules）与两栏排印导语。
- **纯粹纸墨质感**：米白新闻纸、暖褐灰铅字、克制深红点缀，纯线条网格结构，无悬浮阴影。
- **特派报童 Live2D**：版面自适应嵌入罗小黑看板娘，支持视线跟随、点击交互与极客台词气泡。
- **静态导出与高性能**：所有专栏文章与标签页面均在构建期预渲染为纯静态 HTML，极速秒开。
- **明暗夜读模式**：支持日间新闻纸版与暗室版画夜读质感切换。

## 🛠️ 技术栈

- **框架**：Next.js 16 (App Router, Turbopack)
- **UI**：React 19 + TypeScript
- **样式**：Tailwind CSS v4
- **包管理**：pnpm
- **部署**：GitHub Actions + GitHub Pages

## 🚀 本地开发

```bash
# 安装依赖
pnpm install

# 启动本地开发服务 (http://localhost:3000/my-blog/)
pnpm dev

# 生产构建与静态导出验证
pnpm build
```
