"use client";

import { TemplateConfig } from "@/lib/templates";
import { CARD_WIDTH, CARD_HEIGHT, CARD_PADDING } from "@/lib/paginate";
import { forwardRef } from "react";

interface CardPageProps {
  htmlContent: string;
  template: TemplateConfig;
  pageIndex: number;
  totalPages: number;
  username: string;
  avatarUrl: string | null;
  isFirstPage: boolean;
  isLastPage: boolean;
  "data-card-page"?: boolean;
}

/**
 * 单张卡片渲染组件
 * 这是最核心的组件——它决定了导出图片的最终效果
 */
const CardPage = forwardRef<HTMLDivElement, CardPageProps>(
  (
    {
      htmlContent,
      template,
      pageIndex,
      totalPages,
      username,
      avatarUrl,
      isFirstPage,
      isLastPage,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-card-page={rest["data-card-page"] ? "" : undefined}
        className={`relative ${template.className}`}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: template.background,
          padding: CARD_PADDING,
          display: "flex",
          flexDirection: "column",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
          overflow: "hidden",
        }}
      >
        {/* 页眉：仅首页显示 */}
        {isFirstPage && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 40,
              flexShrink: 0,
            }}
          >
            {/* 头像 */}
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                backgroundColor: "#e0e0e0",
                backgroundImage: avatarUrl
                  ? `url(${avatarUrl})`
                  : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0,
              }}
            />
            {/* 用户名 */}
            <span
              style={{
                fontSize: 28,
                color: template.secondaryColor,
                fontWeight: 500,
              }}
            >
              @{username || "YourName"}
            </span>
          </div>
        )}

        {/* 正文内容 */}
        <div
          className="card-content heti"
          style={{
            flex: 1,
            color: template.textColor,
            overflow: "hidden",
          }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* 页脚 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 32,
            flexShrink: 0,
          }}
        >
          {/* 页码 */}
          {totalPages > 1 && (
            <span
              style={{
                fontSize: 24,
                color: template.secondaryColor,
                fontWeight: 400,
                letterSpacing: "0.05em",
              }}
            >
              {pageIndex + 1} / {totalPages}
            </span>
          )}

          {/* 末页水印 */}
          {isLastPage && (
            <span
              style={{
                fontSize: 24,
                color: template.secondaryColor,
                fontWeight: 400,
                marginLeft: "auto",
              }}
            >
              @{username || "YourName"}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CardPage.displayName = "CardPage";
export default CardPage;
