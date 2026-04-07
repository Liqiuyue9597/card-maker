import { toPng } from "html-to-image";
import JSZip from "jszip";
import { CARD_WIDTH, CARD_HEIGHT } from "./paginate";

/**
 * 等待节点内所有 <img> 加载完成（含 base64），
 * 避免移动端导出时头像空白
 */
async function waitForImages(node: HTMLElement): Promise<void> {
  const imgs = node.querySelectorAll("img");
  await Promise.all(
    Array.from(imgs).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    )
  );
}

/**
 * 检测是否为移动端
 */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * dataUrl → File 对象
 */
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], filename, { type: mime });
}

/**
 * dataUrl → Blob
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * 检测 Web Share API 是否支持分享文件
 */
function canShareFiles(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function"
  );
}

/**
 * 移动端：通过 Web Share API 分享图片（可直接保存到相册）
 * 如果不支持 Share API，则 fallback 到打开图片让用户长按保存
 */
async function shareMobileImages(
  dataUrls: string[],
  filenamePrefix: string
): Promise<void> {
  const files = dataUrls.map((url, i) => {
    const suffix = dataUrls.length === 1 ? "" : `_${i + 1}`;
    return dataUrlToFile(url, `${filenamePrefix}${suffix}.png`);
  });

  // 尝试 Web Share API（iOS Safari / Android Chrome 均支持）
  if (canShareFiles()) {
    const shareData: ShareData = { files };
    try {
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return;
      }
    } catch (e) {
      // 用户取消分享不算错误，直接返回
      if (e instanceof DOMException && e.name === "AbortError") return;
      // 其他错误 fallback 到下面的方案
    }
  }

  // Fallback：逐张打开图片，提示用户长按保存
  for (const dataUrl of dataUrls) {
    const blob = dataUrlToBlob(dataUrl);
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    // 延迟释放，给浏览器足够时间加载
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  }
}

/**
 * 将单个卡片 DOM 节点导出为 2x 高清 PNG
 * 使用固定的卡片尺寸而非 offsetWidth/Height，保证一致性
 */
export async function exportCardToPng(
  node: HTMLElement,
  scale: number = 2
): Promise<string> {
  // 确保图片加载完成后再截图
  await waitForImages(node);

  const dataUrl = await toPng(node, {
    width: CARD_WIDTH * scale,
    height: CARD_HEIGHT * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      width: `${CARD_WIDTH}px`,
      height: `${CARD_HEIGHT}px`,
    },
    quality: 1,
    pixelRatio: 1,
  });
  return dataUrl;
}

/**
 * 桌面端：下载单张图片
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * 导出所有卡片
 * - 移动端：Web Share API 分享图片（可直接保存到相册），不走 ZIP
 * - 桌面端：单张直接下载 PNG，多张打包 ZIP
 */
export async function exportAllCards(
  nodes: HTMLElement[],
  filenamePrefix: string = "card"
): Promise<void> {
  const mobile = isMobile();

  // 逐张生成 PNG dataUrl
  const dataUrls: string[] = [];
  for (let i = 0; i < nodes.length; i++) {
    dataUrls.push(await exportCardToPng(nodes[i]));
  }

  // ---- 移动端：分享 / 长按保存 ----
  if (mobile) {
    await shareMobileImages(dataUrls, filenamePrefix);
    return;
  }

  // ---- 桌面端：下载 ----
  if (dataUrls.length === 1) {
    downloadImage(dataUrls[0], `${filenamePrefix}.png`);
    return;
  }

  const zip = new JSZip();
  for (let i = 0; i < dataUrls.length; i++) {
    const base64 = dataUrls[i].split(",")[1];
    zip.file(`${filenamePrefix}_${i + 1}.png`, base64, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${filenamePrefix}.zip`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
