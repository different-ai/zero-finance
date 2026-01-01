// background.js - CDP-based browser control

// 1. Connect to the Native Host application
let port = chrome.runtime.connectNative('com.zerofinance.agent_bridge');

// Track attached debugger sessions: tabId -> true
const attachedTabs = new Map();

// Keep-alive interval
setInterval(() => {
  try {
    port.postMessage({ type: 'ping' });
  } catch (e) {
    console.log('Keep-alive failed', e);
    reconnect();
  }
}, 20000);

function reconnect() {
  try {
    port = chrome.runtime.connectNative('com.zerofinance.agent_bridge');
    setupListeners(port);
  } catch (err) {
    console.error('Reconnection failed', err);
  }
}

function setupListeners(p) {
  p.onDisconnect.addListener(() => {
    console.log('Disconnected from Native Host', chrome.runtime.lastError);
  });

  p.onMessage.addListener(async (msg) => {
    console.log('Received message from host:', msg);
    if (msg.type === 'ping') return;

    try {
      let result;
      switch (msg.type) {
        case 'navigate':
          result = await navigate(msg.url);
          break;
        case 'get_dom':
          result = await getDOM();
          break;
        case 'get_text':
          result = await getPageText();
          break;
        case 'evaluate':
          result = await evaluateViaCDP(msg.script);
          break;
        case 'click':
          result = await clickElement(msg.selector);
          break;
        case 'click_text':
          result = await clickByText(msg.text, msg.tag);
          break;
        case 'fill':
          result = await fillElement(msg.selector, msg.value);
          break;
        case 'scroll':
          result = await scrollPage(msg.x, msg.y);
          break;
        case 'screenshot':
          result = await takeScreenshot();
          break;
        case 'get_links':
          result = await getLinks();
          break;
        case 'get_inputs':
          result = await getInputs();
          break;
        default:
          result = { error: 'Unknown command: ' + msg.type };
      }

      p.postMessage({ id: msg.id, result });
    } catch (err) {
      p.postMessage({ id: msg.id, error: err.message });
    }
  });
}

setupListeners(port);

// --- Debugger Helpers ---

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error('No active tab found');
  return tab;
}

async function ensureDebuggerAttached(tabId) {
  if (attachedTabs.has(tabId)) return;

  await chrome.debugger.attach({ tabId }, '1.3');
  attachedTabs.set(tabId, true);

  // Clean up when tab closes
  chrome.tabs.onRemoved.addListener(function listener(closedTabId) {
    if (closedTabId === tabId) {
      attachedTabs.delete(tabId);
      chrome.tabs.onRemoved.removeListener(listener);
    }
  });
}

async function sendCommand(tabId, method, params = {}) {
  await ensureDebuggerAttached(tabId);
  return new Promise((resolve, reject) => {
    chrome.debugger.sendCommand({ tabId }, method, params, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(result);
      }
    });
  });
}

// --- Navigation ---

async function navigate(url) {
  const tab = await getActiveTab();
  await chrome.tabs.update(tab.id, { url });
  return { status: 'navigating', tabId: tab.id, url };
}

// --- DOM & Text Extraction (via CDP, bypasses CSP) ---

async function getDOM() {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: 'document.documentElement.outerHTML',
    returnByValue: true,
  });
  return { html: result.result.value };
}

async function getPageText() {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: 'document.body.innerText',
    returnByValue: true,
  });
  return { text: result.result.value };
}

// --- Script Evaluation (via CDP, bypasses CSP) ---

async function evaluateViaCDP(script) {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: script,
    returnByValue: true,
    awaitPromise: true,
  });

  if (result.exceptionDetails) {
    return { error: result.exceptionDetails.text || 'Script error' };
  }

  return { result: result.result.value };
}

// --- Click Actions ---

async function clickElement(selector) {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return { success: false, error: 'Element not found' };
      el.click();
      return { success: true, tag: el.tagName, text: el.innerText?.substring(0, 50) };
    })()`,
    returnByValue: true,
  });
  return result.result.value;
}

async function clickByText(text, tag = '*') {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      const xpath = "//${tag}[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text.toLowerCase()}')]";
      const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!el) return { success: false, error: 'Element with text not found' };
      el.click();
      return { success: true, tag: el.tagName, text: el.innerText?.substring(0, 50) };
    })()`,
    returnByValue: true,
  });
  return result.result.value;
}

// --- Form Filling ---

async function fillElement(selector, value) {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return { success: false, error: 'Element not found' };
      el.focus();
      el.value = ${JSON.stringify(value)};
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return { success: true };
    })()`,
    returnByValue: true,
  });
  return result.result.value;
}

// --- Scrolling ---

async function scrollPage(x, y) {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      window.scrollTo(${parseInt(x) || 0}, ${parseInt(y) || 0});
      return { x: window.scrollX, y: window.scrollY };
    })()`,
    returnByValue: true,
  });
  return result.result.value;
}

// --- Screenshot (via CDP) ---

async function takeScreenshot() {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Page.captureScreenshot', {
    format: 'png',
  });
  return { dataUrl: 'data:image/png;base64,' + result.data };
}

// --- Page Analysis Helpers ---

async function getLinks() {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      return Array.from(document.querySelectorAll('a[href]')).map(a => ({
        text: a.innerText?.trim().substring(0, 100),
        href: a.href,
        visible: a.offsetParent !== null
      })).filter(l => l.text && l.visible);
    })()`,
    returnByValue: true,
  });
  return { links: result.result.value };
}

async function getInputs() {
  const tab = await getActiveTab();
  const result = await sendCommand(tab.id, 'Runtime.evaluate', {
    expression: `(function() {
      const inputs = [];
      document.querySelectorAll('input, textarea, select, button').forEach(el => {
        inputs.push({
          tag: el.tagName,
          type: el.type || null,
          name: el.name || null,
          id: el.id || null,
          placeholder: el.placeholder || null,
          value: el.value?.substring(0, 50) || null,
          text: el.innerText?.trim().substring(0, 50) || null,
          visible: el.offsetParent !== null
        });
      });
      return inputs.filter(i => i.visible);
    })()`,
    returnByValue: true,
  });
  return { inputs: result.result.value };
}
