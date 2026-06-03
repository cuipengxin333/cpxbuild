// 监听来自网页的消息
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.type !== 'BAIDU_SEARCH_EXTENSION') return;

  chrome.runtime.sendMessage(event.data, (response) => {
    console.log('Content script 收到 background 响应:', response);
    window.postMessage({
      type: 'BAIDU_SEARCH_EXTENSION_RESPONSE',
      ...response
    }, '*');
  });
}, false);