"use client";

import { templates, TemplateConfig } from "@/lib/templates";

interface TemplateSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function TemplateSelector({
  selected,
  onSelect,
}: TemplateSelectorProps) {
  return (
    <div className="flex gap-3">
      {templates.map((t: TemplateConfig) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={`relative flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all ${
            selected === t.id
              ? "ring-2 ring-blue-500 ring-offset-2"
              : "hover:bg-gray-100"
          }`}
        >
          {/* 模板缩略图 */}
          <div
            className="w-16 h-20 rounded-md border border-gray-200 shadow-sm"
            style={{ background: t.preview }}
          >
            {/* 模拟文字行 */}
            <div className="p-2 flex flex-col gap-1">
              <div
                className="h-1 w-8 rounded-full"
                style={{
                  background: t.textColor,
                  opacity: 0.6,
                }}
              />
              <div
                className="h-1 w-10 rounded-full"
                style={{
                  background: t.textColor,
                  opacity: 0.4,
                }}
              />
              <div
                className="h-1 w-6 rounded-full"
                style={{
                  background: t.textColor,
                  opacity: 0.3,
                }}
              />
            </div>
          </div>
          <span className="text-xs text-gray-600">{t.name}</span>
        </button>
      ))}
    </div>
  );
}
