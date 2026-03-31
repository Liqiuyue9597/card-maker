import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
  async: false,
});

/**
 * 预处理：保留用户的多次回车作为可见空行
 *
 * Markdown 会把多个空行折叠成一个段落分隔。
 * 我们把每个额外的空行变成一个独立的 &nbsp; 段落。
 */
function preserveBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, (match) => {
    const extraLines = match.length - 2;
    // 每个额外空行变成独立段落：\n\n&nbsp;\n\n
    const spacers = Array(extraLines).fill("\n\n&nbsp;").join("");
    return spacers + "\n\n";
  });
}

/**
 * 将 Markdown 文本解析为 HTML
 */
export function parseMarkdown(text: string): string {
  if (!text.trim()) return "";
  const processed = preserveBlankLines(text);
  return marked.parse(processed, { async: false }) as string;
}
