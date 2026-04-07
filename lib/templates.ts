// 模板配置：定义每个模板的视觉参数

export interface TemplateConfig {
  id: string;
  name: string;
  // 卡片容器
  background: string;
  // 文字颜色
  textColor: string;
  // 次要文字颜色（用户名、页码、水印）
  secondaryColor: string;
  // 强调色（用于图标、修饰元素等）
  accentColor: string;
  // 分割线颜色
  dividerColor: string;
  // 额外 CSS 类名
  className: string;
  // 缩略图预览用的渐变/颜色
  preview: string;
}

export const templates: TemplateConfig[] = [
  {
    id: "minimal-white",
    name: "简约白",
    background: "#ffffff",
    textColor: "#1a1a1a",
    secondaryColor: "#999999",
    accentColor: "#333333",
    dividerColor: "#e5e5e5",
    className: "",
    preview: "#ffffff",
  },
  {
    id: "gradient-warm",
    name: "复古暖阳",
    background: "linear-gradient(160deg, #fdfaf5 0%, #f9f3e8 35%, #f4eee0 65%, #fbf8f1 100%)",
    textColor: "#4a3a2a",
    secondaryColor: "#a68d7a",
    accentColor: "#e67e22",
    dividerColor: "rgba(166,141,122,0.15)",
    className: "card-gradient",
    preview: "linear-gradient(160deg, #fdfaf5 0%, #f4eee0 65%, #fbf8f1 100%)",
  },
  {
    id: "dark-literary",
    name: "深夜诗篇",
    background: "linear-gradient(170deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%)",
    textColor: "#d4d4e0",
    secondaryColor: "rgba(180,180,210,0.5)",
    accentColor: "#6c5ce7",
    dividerColor: "rgba(180,180,210,0.15)",
    className: "card-dark",
    preview: "linear-gradient(170deg, #0f0f1a 0%, #16213e 100%)",
  }
];

export function getTemplate(id: string): TemplateConfig {
  return templates.find((t) => t.id === id) || templates[0];
}
