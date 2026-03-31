"use client";

import CardPage from "./CardPage";
import { TemplateConfig } from "@/lib/templates";
import { CARD_WIDTH, CARD_HEIGHT } from "@/lib/paginate";

interface PreviewProps {
  pages: string[];
  template: TemplateConfig;
  username: string;
  avatarUrl: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function Preview({
  pages,
  template,
  username,
  avatarUrl,
  currentPage,
  onPageChange,
}: PreviewProps) {
  const totalPages = pages.length;
  const scaleFactor = 0.38;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      {/* 卡片缩放预览 */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          width: CARD_WIDTH * scaleFactor,
          height: CARD_HEIGHT * scaleFactor,
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            transform: `scale(${scaleFactor})`,
            transformOrigin: "top left",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
          }}
        >
          <CardPage
            htmlContent={pages[currentPage] || ""}
            template={template}
            pageIndex={currentPage}
            totalPages={totalPages}
            username={username}
            avatarUrl={avatarUrl}
            isFirstPage={currentPage === 0}
            isLastPage={currentPage === totalPages - 1}
          />
        </div>
      </div>

      {/* 翻页控制器 */}
      {totalPages > 1 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => onPageChange(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-500 tabular-nums">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={() =>
              onPageChange(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
