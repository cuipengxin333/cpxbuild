/**
 * 检测当前用户环境
 * @returns {string} 返回 'mobile' 或 'desktop'
 */
export default function getUserEnvironment() {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipod|windows phone|mobile/i.test(ua)
        || (/(ipad|macintosh)/i.test(ua) && 'ontouchend' in document);
    return isMobile ? 'mobile' : 'desktop';
}