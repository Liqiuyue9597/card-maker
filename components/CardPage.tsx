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
  showAuthor: boolean;
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
      showAuthor,
      isFirstPage,
      isLastPage,
      ...rest
    },
    ref
  ) => {
    // Current date format
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

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
        {/* 边框修饰 */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: `1px solid ${template.dividerColor}`,
            borderRadius: 24,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* 主内容区域，放在背景之上 */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* 页眉：仅首页且显示署名时显示 */}
          {isFirstPage && showAuthor && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 40,
                flexShrink: 0,
              }}
            >
              {/* 头像 */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "#e0e0e0",
                  backgroundImage: avatarUrl
                    ? `url(${avatarUrl})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  flexShrink: 0,
                  border: `3px solid ${template.background}`,
                  boxShadow: `0 0 0 2px ${template.accentColor}`,
                }}
              />
              {/* 用户信息 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontSize: 32,
                    color: template.textColor,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {username || "YourName"}
                </span>
                <span
                  style={{
                    fontSize: 22,
                    color: template.secondaryColor,
                    fontWeight: 400,
                  }}
                >
                  {today}
                </span>
              </div>
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
              paddingTop: 24,
              borderTop: `1.5px solid ${template.dividerColor}`,
              flexShrink: 0,
            }}
          >
            {/* 左侧：Logo/标语 */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: template.accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={template.id === 'minimal-white' ? template.background : (template.id === 'dark-literary' ? '#0f0f1a' : '#fdfaf5')} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>
              <span
                style={{
                  fontSize: 24,
                  color: template.secondaryColor,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                CARD MAKER
              </span>
            </div>

            {/* 右侧：页码 & 水印 */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {totalPages > 1 && (
                <div
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    backgroundColor: template.dividerColor,
                    fontSize: 22,
                    color: template.textColor,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                  }}
                >
                  {pageIndex + 1} / {totalPages}
                </div>
              )}
              {(!isFirstPage || !showAuthor) && (
                <span
                  style={{
                    fontSize: 26,
                    color: template.secondaryColor,
                    fontWeight: 500,
                  }}
                >
                  @{username || "YourName"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CardPage.displayName = "CardPage";
export default CardPage;
