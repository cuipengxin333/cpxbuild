chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.action === 'searchAndScreenshot') {
    searchAndScreenshot(request.query, sendResponse);
    return true;
  }
});

async function searchAndScreenshot(query, sendResponse) {
  console.log('开始搜索:', query);
  
  try {
    const baiduUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`;
    
    // 创建新标签，不激活
    const tab = await chrome.tabs.create({
      url: baiduUrl,
      active: false
    });
    console.log('创建新标签:', tab);
    
    // 等待页面加载
    await new Promise(resolve => {
      const checkLoaded = (tabId, changeInfo) => {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(checkLoaded);
          console.log('页面加载完成');
          resolve();
        }
      };
      chrome.tabs.onUpdated.addListener(checkLoaded);
      
      setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(checkLoaded);
        console.log('超时，继续执行');
        resolve();
      }, 15000);
    });

    // 等待渲染
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('准备使用 debugger 截图');

    // 使用 debugger API 截图
    let screenshot;
    try {
      // 连接 debugger
      await chrome.debugger.attach({ tabId: tab.id }, '1.3');
      console.log('Debugger 已连接');
      
      // 启用页面
      await chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.enable');
      
      // 等待一下
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 直接截图，使用 captureBeyondViewport
      const result = await chrome.debugger.sendCommand({ tabId: tab.id }, 'Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true
      });
      
      screenshot = `data:image/png;base64,${result.data}`;
      console.log('Debugger 截图成功');
      
    } finally {
      // 断开 debugger
      try {
        await chrome.debugger.detach({ tabId: tab.id });
        console.log('Debugger 已断开');
      } catch (e) {
        console.error('断开 debugger 失败:', e);
      }
    }

    // 关闭标签
    await chrome.tabs.remove(tab.id);

    sendResponse({
      success: true,
      screenshot: screenshot
    });
  } catch (error) {
    console.error('搜索和截图错误:', error);
    sendResponse({
      success: false,
      error: error.message || '操作失败'
    });
  }
}