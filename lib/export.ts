import { toPng } from "html-to-image";
import JSZip from "jszip";
import { CARD_WIDTH, CARD_HEIGHT } from "./paginate";

/**
 * 将单个卡片 DOM 节点导出为 2x 高清 PNG
 * 使用固定的卡片尺寸而非 offsetWidth/Height，保证一致性
 */
export async function exportCardToPng(
  node: HTMLElement,
  scale: number = 2
): Promise<string> {
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
 * 下载单张图片
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * 批量导出多张卡片并打包为 zip 下载
 */
export async function exportAllCards(
  nodes: HTMLElement[],
  filenamePrefix: string = "card"
): Promise<void> {
  if (nodes.length === 1) {
    const dataUrl = await exportCardToPng(nodes[0]);
    downloadImage(dataUrl, `${filenamePrefix}.png`);
    return;
  }

  const zip = new JSZip();

  for (let i = 0; i < nodes.length; i++) {
    const dataUrl = await exportCardToPng(nodes[i]);
    const base64 = dataUrl.split(",")[1];
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
