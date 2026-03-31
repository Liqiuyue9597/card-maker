"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Editor, { DEFAULT_MARKDOWN } from "@/components/Editor";
import Preview from "@/components/Preview";
import CardPage from "@/components/CardPage";
import { getTemplate } from "@/lib/templates";
import { parseMarkdown } from "@/lib/markdown";
import { paginateContent } from "@/lib/paginate";
import { exportAllCards } from "@/lib/export";

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [username, setUsername] = useState("LuckyYou");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("minimal-white");
  const [currentPage, setCurrentPage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [pages, setPages] = useState<string[]>([""]);

  const exportContainerRef = useRef<HTMLDivElement>(null);

  const template = getTemplate(templateId);

  // Markdown → HTML → 分页
  useEffect(() => {
    const html = parseMarkdown(markdown);
    const newPages = paginateContent(html);
    setPages(newPages.length > 0 ? newPages : [""]);
    setCurrentPage((prev) =>
      prev >= newPages.length ? Math.max(0, newPages.length - 1) : prev
    );
  }, [markdown]);

  // 导出所有卡片
  const handleExport = useCallback(async () => {
    if (!exportContainerRef.current) return;

    setIsExporting(true);
    try {
      // 导出前：让容器可见（html-to-image 需要可见元素）
      const container = exportContainerRef.current;
      container.style.visibility = "visible";

      // 等一帧让浏览器渲染
      await new Promise((r) => requestAnimationFrame(r));

      const cardNodes = container.querySelectorAll("[data-card-page]");
      const nodes = Array.from(cardNodes) as HTMLElement[];
      if (nodes.length === 0) return;
      await exportAllCards(nodes, "card");

      // 导出后：隐藏容器
      container.style.visibility = "hidden";
    } catch (error) {
      console.error("Export failed:", error);
      alert("导出失败，请重试");
      if (exportContainerRef.current) {
        exportContainerRef.current.style.visibility = "hidden";
      }
    } finally {
      setIsExporting(false);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 左侧编辑区 */}
      <div className="w-[420px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
        <Editor
          markdown={markdown}
          onMarkdownChange={setMarkdown}
          username={username}
          onUsernameChange={setUsername}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
          templateId={templateId}
          onTemplateChange={setTemplateId}
          onExport={handleExport}
          isExporting={isExporting}
          totalPages={pages.length}
        />
      </div>

      {/* 右侧预览区 */}
      <div className="flex-1 bg-gray-100 overflow-hidden relative">
        {/* 缩放预览（可见） */}
        <Preview
          pages={pages}
          template={template}
          username={username}
          avatarUrl={avatarUrl}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {/* 隐藏的导出用全尺寸卡片容器 */}
        <div
          ref={exportContainerRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            visibility: "hidden",
            zIndex: -1,
            pointerEvents: "none",
          }}
        >
          {pages.map((pageHtml, i) => (
            <CardPage
              key={i}
              data-card-page
              htmlContent={pageHtml}
              template={template}
              pageIndex={i}
              totalPages={pages.length}
              username={username}
              avatarUrl={avatarUrl}
              isFirstPage={i === 0}
              isLastPage={i === pages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
