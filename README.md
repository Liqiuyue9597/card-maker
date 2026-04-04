# Card Maker - 文字卡片生成器

将文字转化为精美图片卡片，一键下载发布到小红书、公众号等社交平台。

## 功能

- **Markdown 编辑** — 支持标题、加粗、斜体、列表、引用、分割线等常用语法
- **多模板切换** — 简约白 / 复古暖阳 / 深夜诗篇，一键换装
- **自动分页** — 内容超出单张卡片时自动拆分为多页，带页码
- **署名可选** — 可开关首页头像 + 用户名展示，每页页脚始终保留 @署名水印
- **高清导出** — 1080×1440 @2x PNG，多页自动打包 ZIP 下载
- **实时预览** — 左侧编辑、右侧即时预览，所见即所得

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可使用。

## 技术栈

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- marked (Markdown 解析)
- heti (中文排版增强)
- html-to-image + jszip (导出)

## 项目结构

```
app/
  page.tsx              主页面 & 状态管理
  layout.tsx            根布局
  globals.css           全局样式 & 卡片排版

components/
  Editor.tsx            编辑面板（署名开关、头像、模板、文本编辑、导出）
  Preview.tsx           预览区（缩放预览 + 翻页）
  CardPage.tsx          单张卡片渲染（决定导出最终效果）
  TemplateSelector.tsx  模板选择器

lib/
  templates.ts          模板配置
  markdown.ts           Markdown → HTML
  paginate.ts           分页算法
  export.ts             导出 PNG / ZIP
```

## 部署

```bash
npm run build
npm start
```

支持一键部署到 [Vercel](https://vercel.com)。
