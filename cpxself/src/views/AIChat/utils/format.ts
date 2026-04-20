import { marked } from 'marked'; 
import DOMPurify from 'dompurify'; 

/**
 * AI 回答格式化（完美渲染标题、加粗、列表、代码、换行）
 * @param text 原始文本内容
 * @returns 消毒后的 HTML 字符串
 */
export function formatAIAnswer(text: string): string { 
  if (!text) return ''; 

  // 1. 预处理：清理 AI 多余空行、零宽字符 
  const content = text 
    .replace(/\r/g, '') 
    .replace(/\n{2,}/g, '\n\n') // 强制将所有连续换行缩减为最多两个，保持段落感但压缩空间
    .replace(/\u200b/g, '') 
    .trim(); 

  // 2. 把 Markdown 变成美观的 HTML（标题、加粗、列表、引用、代码） 
  const html = marked(content, { 
    gfm: true,         // 支持标准 Markdown 
    breaks: true,      // 自动把 \n 变成 <br>
    async: false,      // 同步渲染
  }) as string; 

  // 3. 安全消毒（必须！防止 XSS、页面错乱） 
  return DOMPurify.sanitize(html); 
}
