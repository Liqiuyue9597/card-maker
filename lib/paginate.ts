/**
 * 分页算法：将 HTML 按块级元素分割成多页
 *
 * 核心策略：用累积渲染测量真实高度
 */

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1440;
export const CARD_PADDING = 80;

const HEADER_HEIGHT = 140;
const FOOTER_HEIGHT = 85;

const FIRST_PAGE_CONTENT_HEIGHT =
  CARD_HEIGHT - CARD_PADDING * 2 - HEADER_HEIGHT - FOOTER_HEIGHT;
const OTHER_PAGE_CONTENT_HEIGHT =
  CARD_HEIGHT - CARD_PADDING * 2 - FOOTER_HEIGHT;

/**
 * 将 HTML 拆分为细粒度的块（可分页单元）
 */
export function splitHtmlBlocks(html: string): string[] {
  if (typeof window === "undefined") return [html];

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: string[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      if (tagName === "p" && el.innerHTML.includes("<br>")) {
        blocks.push(...splitParagraphByBr(el));
      } else if (tagName === "ul" || tagName === "ol") {
        // 递归展平所有列表项（包括嵌套列表）
        flattenListItems(el, blocks);
      } else {
        blocks.push(el.outerHTML);
      }
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      blocks.push(`<p>${node.textContent}</p>`);
    }
  });

  return blocks;
}

/**
 * 递归展平列表：将嵌套的 ul/ol 拆成独立的单项列表
 * 例如：<ul><li>A<ul><li>B</li></ul></li></ul>
 * → <ul><li>A</li></ul>  +  <ul><li>B</li></ul>
 */
function flattenListItems(listEl: Element, blocks: string[]) {
  const tagName = listEl.tagName.toLowerCase();
  const items = listEl.querySelectorAll(":scope > li");

  items.forEach((li) => {
    // 检查 li 内是否有嵌套的 ul/ol
    const nestedLists = li.querySelectorAll(":scope > ul, :scope > ol");

    if (nestedLists.length === 0) {
      // 没有嵌套 — 直接作为独立项
      // 但 li 里如果有 <br>，还要进一步拆分
      if (li.innerHTML.includes("<br>")) {
        // 提取 <br> 之前的内容作为列表项
        const parts = splitElementByBr(li);
        parts.forEach((part, i) => {
          if (i === 0) {
            blocks.push(`<${tagName}><li>${part}</li></${tagName}>`);
          } else {
            // 后续部分作为普通段落
            blocks.push(`<p>${part}</p>`);
          }
        });
      } else {
        blocks.push(`<${tagName}><li>${li.innerHTML}</li></${tagName}>`);
      }
    } else {
      // 有嵌套 — 先提取 li 本身的文本内容（不含嵌套列表）
      const liClone = li.cloneNode(true) as Element;
      liClone.querySelectorAll("ul, ol").forEach((nested) => nested.remove());
      const ownContent = liClone.innerHTML.trim();

      if (ownContent) {
        if (ownContent.includes("<br>")) {
          const parts = splitElementByBr(liClone);
          parts.forEach((part, i) => {
            if (i === 0) {
              blocks.push(`<${tagName}><li>${part}</li></${tagName}>`);
            } else {
              blocks.push(`<p>${part}</p>`);
            }
          });
        } else {
          blocks.push(`<${tagName}><li>${ownContent}</li></${tagName}>`);
        }
      }

      // 然后递归处理嵌套列表
      nestedLists.forEach((nested) => {
        flattenListItems(nested, blocks);
      });
    }
  });
}

/**
 * 将元素内容按 <br> 拆分成多段文本
 */
function splitElementByBr(el: Element): string[] {
  const results: string[] = [];
  let currentFragments: string[] = [];

  el.childNodes.forEach((child) => {
    if (
      child.nodeType === Node.ELEMENT_NODE &&
      (child as Element).tagName.toLowerCase() === "br"
    ) {
      if (currentFragments.length > 0) {
        const content = currentFragments.join("").trim();
        if (content) results.push(content);
        currentFragments = [];
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as Element;
      // 跳过嵌套的 ul/ol（已经在 flattenListItems 中处理）
      if (!["ul", "ol"].includes(childEl.tagName.toLowerCase())) {
        currentFragments.push(childEl.outerHTML);
      }
    } else if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent || "";
      if (text) currentFragments.push(text);
    }
  });

  if (currentFragments.length > 0) {
    const content = currentFragments.join("").trim();
    if (content) results.push(content);
  }

  return results;
}

function splitParagraphByBr(el: Element): string[] {
  const parts = splitElementByBr(el);
  return parts.map((content) => `<p>${content}</p>`);
}

/**
 * 核心分页函数 — 累积渲染测量法
 */
export function paginateContent(html: string): string[] {
  if (typeof window === "undefined") return [html];

  const blocks = splitHtmlBlocks(html);
  if (blocks.length === 0) return [""];

  const measurer = document.createElement("div");
  measurer.className = "card-content heti";
  measurer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${CARD_WIDTH - CARD_PADDING * 2}px;
    visibility: hidden;
    z-index: -9999;
  `;
  document.body.appendChild(measurer);

  const blockElements: HTMLElement[] = [];
  for (const blockHtml of blocks) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = blockHtml;
    const firstEl = wrapper.firstElementChild as HTMLElement | null;
    if (firstEl) {
      blockElements.push(firstEl);
    }
  }

  const pages: HTMLElement[][] = [[]];
  let currentPageIndex = 0;

  measurer.innerHTML = "";

  for (const blockEl of blockElements) {
    const maxHeight =
      currentPageIndex === 0
        ? FIRST_PAGE_CONTENT_HEIGHT
        : OTHER_PAGE_CONTENT_HEIGHT;

    measurer.appendChild(blockEl);
    const totalHeight = measurer.offsetHeight;

    if (totalHeight > maxHeight && pages[currentPageIndex].length > 0) {
      measurer.removeChild(blockEl);
      currentPageIndex++;
      pages[currentPageIndex] = [];
      measurer.innerHTML = "";
      measurer.appendChild(blockEl);
    }

    pages[currentPageIndex].push(blockEl);
  }

  document.body.removeChild(measurer);

  return pages.map((pageBlocks) =>
    pageBlocks.map((el) => el.outerHTML).join("\n")
  );
}
