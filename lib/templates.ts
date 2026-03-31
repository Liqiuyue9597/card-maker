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
    dividerColor: "#e5e5e5",
    className: "",
    preview: "#ffffff",
  },
  {
    id: "gradient-warm",
    name: "复古暖阳",
    background: "linear-gradient(160deg, #f5eddf 0%, #efe3cd 35%, #e8d5b8 65%, #f0e6d4 100%)",
    textColor: "#3a2a1a",
    secondaryColor: "#8c7260",
    dividerColor: "rgba(140,114,96,0.25)",
    className: "card-gradient",
    preview: "linear-gradient(160deg, #f5eddf 0%, #e8d5b8 65%, #f0e6d4 100%)",
  },
  {
    id: "dark-literary",
    name: "深夜诗篇",
    background: "linear-gradient(170deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%)",
    textColor: "#d4d4e0",
    secondaryColor: "rgba(180,180,210,0.5)",
    dividerColor: "rgba(180,180,210,0.15)",
    className: "card-dark",
    preview: "linear-gradient(170deg, #0f0f1a 0%, #16213e 100%)",
  },
];

export function getTemplate(id: string): TemplateConfig {
  return templates.find((t) => t.id === id) || templates[0];
}
