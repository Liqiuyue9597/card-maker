"use client";

import { ChangeEvent } from "react";
import TemplateSelector from "./TemplateSelector";

interface EditorProps {
  markdown: string;
  onMarkdownChange: (value: string) => void;
  username: string;
  onUsernameChange: (value: string) => void;
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
  showAuthor: boolean;
  onShowAuthorChange: (show: boolean) => void;
  templateId: string;
  onTemplateChange: (id: string) => void;
  onExport: () => void;
  isExporting: boolean;
  totalPages: number;
}

const DEFAULT_MARKDOWN = `长风破浪会有时，
直挂云帆济沧海。

---

When you feel like you are moving *slowly*,
just remember that as long as you don't go backwards,
you are already making progress.

- 接受缓慢的进步
- 不要回头
- 自我怀疑

---

当你觉得自己走得很慢时，
只要不后退，
就已经是在前进了。`;

export { DEFAULT_MARKDOWN };

export default function Editor({
  markdown,
  onMarkdownChange,
  username,
  onUsernameChange,
  avatarUrl,
  onAvatarChange,
  showAuthor,
  onShowAuthorChange,
  templateId,
  onTemplateChange,
  onExport,
  isExporting,
  totalPages,
}: EditorProps) {
  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onAvatarChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full gap-5 p-5">
      {/* 标题 */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Card Maker</h1>
        <p className="text-sm text-gray-500 mt-1">
          文字卡片生成器 · 粘贴文字 → 选模板 → 下载图片
        </p>
      </div>

      {/* 设置区 */}
      <div className="flex flex-col gap-4">
        {/* 头像 + 用户名 */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showAuthor}
              onChange={(e) => onShowAuthorChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500 accent-gray-900"
            />
            <span className="text-xs text-gray-500">显示署名</span>
          </label>
        </div>
        <div className={`flex items-center gap-3 transition-opacity ${showAuthor ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
          <label className="relative cursor-pointer group">
            <div
              className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-gray-400 transition"
              style={{
                backgroundImage: avatarUrl
                  ? `url(${avatarUrl})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!avatarUrl && (
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </label>
          <div className="flex items-center gap-1 flex-1">
            <span className="text-gray-400 text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              placeholder="用户名"
              className="flex-1 text-sm border-none outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* 模板选择 */}
        <div>
          <label className="text-xs text-gray-500 mb-2 block">选择模板</label>
          <TemplateSelector
            selected={templateId}
            onSelect={onTemplateChange}
          />
        </div>
      </div>

      {/* Markdown 编辑器 */}
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-xs text-gray-500 mb-2 block">
          输入内容（支持 Markdown）
        </label>
        <textarea
          className="editor-textarea flex-1 w-full resize-none border border-gray-200 rounded-lg p-4 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition bg-white"
          value={markdown}
          onChange={(e) => onMarkdownChange(e.target.value)}
          placeholder="在这里输入或粘贴文字...

支持 Markdown 语法：
# 标题
**加粗** *斜体*
- 列表项
--- 分割线
> 引用"
          spellCheck={false}
        />
      </div>

      {/* 导出按钮 */}
      <button
        onClick={onExport}
        disabled={isExporting}
        className="w-full py-3 px-4 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 active:bg-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        {isExporting ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            导出中...
          </>
        ) : (
          <>
            下载图片{totalPages > 1 ? `（共 ${totalPages} 张）` : ""}
          </>
        )}
      </button>
    </div>
  );
}
