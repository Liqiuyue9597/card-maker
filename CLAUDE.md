@AGENTS.md

# Card Maker - 项目架构文档

## 概述

文字卡片生成器：用户输入 Markdown 文本 → 选择模板 → 自动分页渲染为 1080×1440 卡片 → 导出为 PNG/ZIP。
适用场景：小红书、公众号等社交平台图文发布。

## 技术栈

- **框架**: Next.js 16.2.1 (App Router, Turbopack)
- **UI**: React 19.2.4 + Tailwind CSS 4
- **Markdown**: marked 17.x
- **排版**: heti (赫蹏中文排版增强)
- **导出**: html-to-image + jszip
- **语言**: TypeScript 5

## 文件结构

```
app/
  layout.tsx          — 根布局，lang="zh-CN"，引入 globals.css
  page.tsx            — 主页面，所有状态在此管理（markdown, username, avatarUrl, showAuthor, templateId, currentPage, pages, isExporting）
  globals.css         — 全局样式：Tailwind 引入、卡片排版(.card-content)、模板覆盖(.card-dark/.card-gradient)、编辑器样式

components/
  Editor.tsx          — 左侧编辑面板：标题、署名开关、头像上传、用户名输入、模板选择、Markdown 编辑器、导出按钮
  Preview.tsx         — 右侧预览区：缩放预览(0.38x) + 翻页控制器
  CardPage.tsx        — 单张卡片渲染（核心组件，决定导出图片最终效果）
  TemplateSelector.tsx — 模板选择器：横排展示模板缩略图

lib/
  templates.ts        — 模板配置（TemplateConfig 接口 + 预置模板数组 + getTemplate()）
  markdown.ts         — Markdown → HTML 转换（marked + 空行保留预处理）
  paginate.ts         — 分页算法：HTML → 块级拆分 → 累积渲染测量真实高度 → 多页
  export.ts           — 导出：html-to-image 生成 2x PNG，多张时 jszip 打包下载
```

## 数据流

```
用户输入 Markdown
  ↓ parseMarkdown()
HTML 字符串
  ↓ paginateContent()    ← 依赖 DOM 测量，仅客户端
pages: string[]          ← 每页是一段 HTML
  ↓
CardPage × N             ← 渲染每页卡片
  ↓ exportCardToPng()
PNG dataUrl → 下载 / ZIP
```

## 状态管理（全在 app/page.tsx）

| 状态 | 类型 | 说明 |
|------|------|------|
| markdown | string | 编辑器内容 |
| username | string | 署名用户名，默认 "LuckyYou" |
| avatarUrl | string \| null | 头像 base64 DataURL |
| showAuthor | boolean | 是否显示首页页眉（头像+署名），页脚水印不受影响 |
| templateId | string | 当前模板 ID，默认 "minimal-white" |
| currentPage | number | 预览当前页码 |
| pages | string[] | 分页后的 HTML 数组 |
| isExporting | boolean | 导出加载状态 |

## 核心组件接口

### CardPage props
- htmlContent, template, pageIndex, totalPages, username, avatarUrl, showAuthor, isFirstPage, isLastPage
- 页眉（头像+用户名）：仅 `isFirstPage && showAuthor` 时显示
- 页脚水印（@username）：每页始终显示
- 通过 `data-card-page` 属性标记，供导出时 querySelectorAll 查找

### Editor props
- markdown, onMarkdownChange, username, onUsernameChange, avatarUrl, onAvatarChange, showAuthor, onShowAuthorChange, templateId, onTemplateChange, onExport, isExporting, totalPages

### Preview props
- pages, template, username, avatarUrl, showAuthor, currentPage, onPageChange

## 模板系统

TemplateConfig 字段：id, name, background, textColor, secondaryColor, dividerColor, className, preview

预置模板：
1. **minimal-white** (简约白) — 纯白背景
2. **gradient-warm** (复古暖阳) — className: "card-gradient"，globals.css 有对应覆盖样式
3. **dark-literary** (深夜诗篇) — className: "card-dark"，globals.css 有对应覆盖样式

添加新模板：在 templates 数组追加即可，如需特殊样式则在 globals.css 加 `.card-{name}` 覆盖。

## 卡片尺寸常量（lib/paginate.ts）

- CARD_WIDTH: 1080px, CARD_HEIGHT: 1440px, CARD_PADDING: 80px
- HEADER_HEIGHT: 140px, FOOTER_HEIGHT: 85px
- 首页内容区高度: 1440 - 80×2 - 140 - 85 = 1055px
- 非首页内容区高度: 1440 - 80×2 - 85 = 1195px

## 导出机制

1. 隐藏的全尺寸 CardPage 容器（fixed, visibility:hidden）用于导出
2. 导出时临时 visible → html-to-image 逐页截图(2x) → 隐藏
3. 单页直接下载 PNG，多页打包 ZIP

## 关键样式

- `.card-content` 基础字号 36px, 行高 2, 字间距 0.03em
- `.card-content h1/h2/h3` 分别 54/46/40px
- `.editor-textarea` 使用等宽字体 14px
- 卡片字体栈：-apple-system → PingFang SC → Microsoft YaHei（中西文兼顾）
