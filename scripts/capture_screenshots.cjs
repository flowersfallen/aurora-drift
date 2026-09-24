const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;
const ARTIFACT_DIR = "C:\\Users\\wangyun\\.gemini\\antigravity\\brain\\7b7769ec-cc16-4a4c-a3f4-e6fafe19e9e9";

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

async function capture() {
  const edgeProc = spawn(EDGE_PATH, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    '--window-size=1280,800',
    'about:blank',
  ]);

  await delay(1500);

  let version;
  for (let i = 0; i < 10; i++) {
    try {
      version = await fetchJson(`http://127.0.0.1:${PORT}/json/version`);
      break;
    } catch {
      await delay(500);
    }
  }

  const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let msgId = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const curId = msgId++;
      ws.send(JSON.stringify({ id: curId, method, params }));
      const handler = (e) => {
        const d = JSON.parse(e.data);
        if (d.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(d.result);
        }
      };
      ws.addEventListener('message', handler);
    });
  };

  const takeScreenshot = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved screenshot: ${filename}`);
  };

  // 1. Desktop Idle with 300 NM (Fox, Whale, Oasis)
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_miles=300' });
  await delay(1500);
  await takeScreenshot('qa_audit_desktop_idle.png');

  // 2. Desktop Navigation Map Modal
  await send('Runtime.evaluate', { expression: `document.querySelector("header button[title*='航海图'], header button[title*='Chart']").click()` });
  await delay(600);
  await takeScreenshot('qa_audit_desktop_drift_map.png');
  await send('Runtime.evaluate', { expression: `document.querySelector("div.fixed.inset-0 button").click()` });
  await delay(400);

  // 3. Desktop Collection Modal
  await send('Runtime.evaluate', { expression: `document.querySelector("header button[title*='相册'], header button[title*='Album']").click()` });
  await delay(600);
  await takeScreenshot('qa_audit_desktop_collection_album.png');
  await send('Runtime.evaluate', { expression: `document.querySelector("div.fixed.inset-0 button").click()` });
  await delay(400);

  // 4. Mobile Idle (390x844)
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
  await send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_miles=300' });
  await delay(1500);
  await takeScreenshot('qa_audit_mobile_idle.png');

  // 5. Mobile Cruising (390x844) with leading Whale
  await send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_miles=300&test_cruising=1' });
  await delay(1500);
  await takeScreenshot('qa_audit_mobile_cruising_whale.png');

  // 6. Mobile Settings Drawer
  await send('Runtime.evaluate', { expression: `document.querySelector("header button[title*='设置'], header button[title*='Settings']").click()` });
  await delay(600);
  await takeScreenshot('qa_audit_mobile_settings_drawer.png');

  ws.close();
  edgeProc.kill();
  console.log('🎉 All QA Audit screenshots successfully captured!');
}

capture().catch(console.error);
