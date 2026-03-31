import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Maker - 文字卡片生成器",
  description: "将文字转化为精美图片卡片，一键下载发布到小红书、公众号",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
