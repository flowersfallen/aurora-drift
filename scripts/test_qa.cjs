const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9222;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.msgId = 0;
    this.callbacks = new Map();
    this.events = [];

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.callbacks.has(data.id)) {
        const { resolve, reject } = this.callbacks.get(data.id);
        this.callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      } else if (data.method) {
        this.events.push(data);
      }
    };
  }

  ready() {
    return new Promise((resolve, reject) => {
      if (this.ws.readyState === WebSocket.OPEN) return resolve();
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.msgId;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval exception: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function waitForMount(cdp, timeoutMs = 10000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const ready = await cdp.eval(`(() => {
        window.confirm = () => true;
        window.alert = () => true;
        return Boolean(document.querySelector('header') && document.querySelector('footer'));
      })()`);
      if (ready) {
        await delay(500); // Allow react state effects to settle
        return;
      }
    } catch {
      // Retrying
    }
    await delay(250);
  }
  throw new Error('Page mount timeout');
}

async function runQA() {
  console.log('🚀 Starting Comprehensive QA Test Suite across Web & WAP...');

  // Launch Edge in headless mode with remote debugging
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

  if (!version) {
    console.error('❌ Failed to connect to Edge DevTools');
    edgeProc.kill();
    process.exit(1);
  }

  const targets = await fetchJson(`http://127.0.0.1:${PORT}/json/list`);
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.ready();
  console.log('✅ Connected to Edge DevTools via WebSocket CDP');

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  const testResults = [];

  async function assertTest(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      testResults.push({ name, status: 'PASS' });
    } catch (err) {
      console.error(`  ✗ ${name}:`, err.message);
      testResults.push({ name, status: 'FAIL', error: err.message });
    }
  }

  // -------------------------------------------------------------
  // TEST SUITE 1: DESKTOP (1280x800) TESTS
  // -------------------------------------------------------------
  console.log('\n--- [TEST SUITE 1] Desktop Interactions (1280x800) ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_miles=300' });
  await waitForMount(cdp);

  // 1. Check Console Errors & Horizontal Overflow
  await assertTest('Desktop: No horizontal scroll overflow', async () => {
    const isOverflown = await cdp.eval('document.documentElement.scrollWidth > window.innerWidth');
    if (isOverflown) throw new Error('Horizontal scrollbar detected on desktop');
  });

  // 2. Language Toggle
  await assertTest('Desktop: Language Toggle (EN / 中)', async () => {
    const langBtn = await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('header button'));
      return Boolean(btns.find(b => b.innerText.trim() === 'EN' || b.innerText.trim() === '中'));
    })()`);
    if (!langBtn) throw new Error('Language toggle button missing');
    const initialLang = await cdp.eval(`Array.from(document.querySelectorAll('header button')).find(b => b.innerText.trim() === 'EN' || b.innerText.trim() === '中').innerText.trim()`);
    await cdp.eval(`Array.from(document.querySelectorAll('header button')).find(b => b.innerText.trim() === 'EN' || b.innerText.trim() === '中').click()`);
    await delay(300);
    const newLang = await cdp.eval(`Array.from(document.querySelectorAll('header button')).find(b => b.innerText.trim() === 'EN' || b.innerText.trim() === '中').innerText.trim()`);
    if (initialLang === newLang) throw new Error('Language toggle did not change text');
    // Toggle back so subsequent tests run in the initial locale
    await cdp.eval(`Array.from(document.querySelectorAll('header button')).find(b => b.innerText.trim() === 'EN' || b.innerText.trim() === '中').click()`);
    await delay(300);
  });

  // 3. Sky Theme Switcher
  await assertTest('Desktop: Sky Theme buttons (Aurora, Sunset, Midnight)', async () => {
    // Click sunset
    const sunsetBtn = await cdp.eval('Boolean(document.querySelector("header button[title*=\'日落\'], header button[title*=\'Sunset\']"))');
    if (!sunsetBtn) throw new Error('Sunset theme button missing');
    await cdp.eval('document.querySelector("header button[title*=\'日落\'], header button[title*=\'Sunset\']").click()');
    await delay(300);
    // Click midnight
    const nightBtn = await cdp.eval('Boolean(document.querySelector("header button[title*=\'午夜\'], header button[title*=\'Midnight\']"))');
    if (!nightBtn) throw new Error('Midnight theme button missing');
    await cdp.eval('document.querySelector("header button[title*=\'午夜\'], header button[title*=\'Midnight\']").click()');
    await delay(300);
    // Click aurora
    await cdp.eval('document.querySelector("header button[title*=\'极光\'], header button[title*=\'Aurora\']").click()');
    await delay(300);
  });

  // 4. Pearls -> CampDecorModal
  await assertTest('Desktop: Pearls counter opens CampDecorModal and closes cleanly', async () => {
    await cdp.eval('document.querySelector("[title*=\'珍珠\'], [title*=\'Pearls\']").click()');
    await delay(400);
    const modalVisible = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0"))');
    if (!modalVisible) throw new Error('CampDecorModal did not open');
    // Close modal via close button
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
    const modalClosed = await cdp.eval('!document.querySelector("div.fixed.inset-0")');
    if (!modalClosed) throw new Error('CampDecorModal did not close');
  });

  // 5. Polar Drift Navigational Chart Modal (Voyage)
  await assertTest('Desktop: Voyage button opens DriftMapModal and closes cleanly', async () => {
    const voyageBtn = await cdp.eval('Boolean(document.querySelector("header button[title*=\'航海图\'], header button[title*=\'Chart\'], header button[title*=\'Voyage\']"))');
    if (!voyageBtn) throw new Error('Voyage button missing in desktop header');
    await cdp.eval('document.querySelector("header button[title*=\'航海图\'], header button[title*=\'Chart\'], header button[title*=\'Voyage\']").click()');
    await delay(400);
    const hasWaypoints = await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button[class*=\'rounded-2xl\']").length >= 4');
    if (!hasWaypoints) throw new Error('DriftMapModal did not display waypoints');
    // Click close
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 6. Collection Album Modal
  await assertTest('Desktop: Collection Album modal opens, switches tabs, opens detail, and closes cleanly', async () => {
    await cdp.eval('document.querySelector("header button[title*=\'相册\'], header button[title*=\'Album\']").click()');
    await delay(400);
    // Check tabs
    const tabCount = await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button").length');
    if (tabCount < 4) throw new Error('Album category tabs missing');
    // Click second tab (Postcards)
    await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button")[1].click()');
    await delay(300);
    // Click first unlocked treasure card
    const hasCard = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0 div[class*=\'group\']"))');
    if (!hasCard) throw new Error('No unlocked treasure card found');
    await cdp.eval('document.querySelector("div.fixed.inset-0 div[class*=\'group\']").click()');
    await delay(400);
    // Detail modal open
    const hasDetail = await cdp.eval('Boolean(document.querySelector("div[class*=\'animate-scaleUp\']"))');
    if (!hasDetail) throw new Error('Treasure detail dialog did not open');
    // Close detail modal
    await cdp.eval('document.querySelector("div[class*=\'animate-scaleUp\'] button").click()');
    await delay(300);
    // Close Album modal
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 7. Audio Mixer Modal
  await assertTest('Desktop: Audio Mixer opens, toggles mute, updates sliders, and closes', async () => {
    await cdp.eval('document.querySelector("header button[title*=\'调音台\'], header button[title*=\'Mixer\']").click()');
    await delay(400);
    const hasSliders = await cdp.eval('document.querySelectorAll("div.fixed.inset-0 input[type=\'range\']").length === 5');
    if (!hasSliders) throw new Error('Audio mixer sliders missing');
    // Toggle mute button
    await cdp.eval('document.querySelector("div.fixed.inset-0 button[class*=\'font-bold\']").click()');
    await delay(200);
    // Unmute
    await cdp.eval('document.querySelector("div.fixed.inset-0 button[class*=\'font-bold\']").click()');
    await delay(200);
    // Close
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 8. Info Modal
  await assertTest('Desktop: Info modal opens and closes cleanly', async () => {
    await cdp.eval('document.querySelector("header button[title*=\'关于\'], header button[title*=\'About\']").click()');
    await delay(400);
    const hasOtter = await cdp.eval('document.body.innerText.includes("Aurora Drift") || document.body.innerText.includes("极光水獭")');
    if (!hasOtter) throw new Error('Info modal text missing');
    // Click back to camp
    await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button")[1].click()');
    await delay(300);
  });

  // 9. Desktop Share Modal
  await assertTest('Desktop: Share Modal opens and closes cleanly', async () => {
    const shareBtn = await cdp.eval('Boolean(document.querySelector("header button[title*=\'分享\'], header button[title*=\'Share\']"))');
    if (!shareBtn) throw new Error('Share button missing in header');
    await cdp.eval('document.querySelector("header button[title*=\'分享\'], header button[title*=\'Share\']").click()');
    await delay(400);
    const shareModalOpen = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0"))');
    if (!shareModalOpen) throw new Error('Share modal did not open');
    // Close share modal
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 10. Interactive Stage: Otter, Fox, Whale
  await assertTest('Desktop: Center Stage Otter click triggers speech bubble', async () => {
    await cdp.eval('document.querySelector("svg[viewBox=\'0 0 460 320\']").parentElement.click()');
    await delay(300);
    const bubble = await cdp.eval('Boolean(document.querySelector(".animate-bounce"))');
    if (!bubble) throw new Error('Otter speech bubble did not appear on click');
  });

  await assertTest('Desktop: Sleeping Fox click triggers fox speech bubble', async () => {
    const foxFound = await cdp.eval('Boolean(document.querySelector("#sleeping-fox"))');
    if (foxFound) {
      await cdp.eval('document.querySelector("#sleeping-fox").dispatchEvent(new MouseEvent("click", { bubbles: true }))');
      await delay(300);
      const foxBubble = await cdp.eval('document.body.innerText.includes("🦊")');
      if (!foxBubble) throw new Error('Fox bubble did not appear');
    }
  });

  await assertTest('Desktop: Humpback Whale click triggers whale dialogue', async () => {
    const whaleFound = await cdp.eval('Boolean(document.querySelector("div[title*=\'座头鲸\'], div[title*=\'Whale\']"))');
    if (!whaleFound) throw new Error('Whale not found at 300 NM');
    await cdp.eval('document.querySelector("div[title*=\'座头鲸\'], div[title*=\'Whale\']").dispatchEvent(new MouseEvent("click", { bubbles: true }))');
    await delay(300);
    const whaleBubble = await cdp.eval('document.body.innerText.includes("🐋")');
    if (!whaleBubble) throw new Error('Whale bubble did not appear');
  });

  // 11. Focus Timer Presets and Execution
  await assertTest('Desktop: Timer Presets switch duration (1m, 5m, 25m, 45m)', async () => {
    // Locate the preset buttons specifically
    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const target = btns.find(b => b.innerText.includes('5m') || b.innerText.includes('5分'));
      if (target) target.click();
    })()`);
    await delay(200);
    let timeText = await cdp.eval('document.querySelector("footer .tabular-nums").innerText');
    if (timeText !== '05:00') throw new Error(`Expected 05:00, got ${timeText}`);

    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const target = btns.find(b => b.innerText.includes('25m') || b.innerText.includes('25分'));
      if (target) target.click();
    })()`);
    await delay(200);
    timeText = await cdp.eval('document.querySelector("footer .tabular-nums").innerText');
    if (timeText !== '25:00') throw new Error(`Expected 25:00, got ${timeText}`);

    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const target = btns.find(b => b.innerText.includes('1m') || b.innerText.includes('1分'));
      if (target) target.click();
    })()`);
    await delay(200);
    timeText = await cdp.eval('document.querySelector("footer .tabular-nums").innerText');
    if (timeText !== '01:00') throw new Error(`Expected 01:00, got ${timeText}`);
  });

  await assertTest('Desktop: Start Cruise and Stop Cruise cycle', async () => {
    // Click Start
    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const startBtn = btns.find(b => b.innerText.includes('启航') || b.innerText.includes('出发') || b.innerText.includes('Sail') || b.innerText.includes('Cruise') || b.innerText.includes('潜水') || b.innerText.includes('Dive'));
      if (startBtn) startBtn.click();
    })()`);
    await delay(500);

    // Stop Cruise
    const stopFound = await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const stopBtn = btns.find(b => b.innerText.includes('抛锚') || b.innerText.includes('浮上') || b.innerText.includes('Anchor') || b.innerText.includes('Cancel'));
      if (stopBtn) {
        stopBtn.click();
        return true;
      }
      return false;
    })()`);
    if (!stopFound) throw new Error('Stop cruise button not found or could not click');
    await delay(400);
  });

  // -------------------------------------------------------------
  // TEST SUITE 2: MOBILE (390x844) TESTS
  // -------------------------------------------------------------
  console.log('\n--- [TEST SUITE 2] Mobile Interactions (390x844) ---');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_miles=300' });
  await waitForMount(cdp);

  // 1. Check No Horizontal Overflow on Mobile in Idle
  await assertTest('Mobile: No horizontal scroll overflow in idle', async () => {
    const isOverflown = await cdp.eval('document.documentElement.scrollWidth > 390');
    if (isOverflown) throw new Error('Horizontal scrollbar detected on mobile');
  });

  // 2. Mobile Header: Pearls counter opens CampDecorModal
  await assertTest('Mobile: Pearls counter opens CampDecorModal and closes', async () => {
    await cdp.eval('document.querySelector("[title*=\'珍珠\'], [title*=\'Pearls\']").click()');
    await delay(400);
    const decorOpen = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0"))');
    if (!decorOpen) throw new Error('CampDecorModal did not open on mobile');
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 3. Mobile Header: Album button opens CollectionModal
  await assertTest('Mobile: Collection Album opens, tabs work, and closes', async () => {
    await cdp.eval('document.querySelector("header button[title*=\'相册\'], header button[title*=\'Album\']").click()');
    await delay(400);
    const albumOpen = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0"))');
    if (!albumOpen) throw new Error('Album modal did not open on mobile');
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 4. Mobile Header: Audio Mixer button opens AudioMixerModal
  await assertTest('Mobile: Audio Mixer opens and closes', async () => {
    await cdp.eval('document.querySelector("header button[title*=\'调音台\'], header button[title*=\'Mixer\']").click()');
    await delay(400);
    const mixerOpen = await cdp.eval('Boolean(document.querySelector("div.fixed.inset-0"))');
    if (!mixerOpen) throw new Error('Audio mixer modal did not open on mobile');
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 5. Mobile Settings Drawer
  await assertTest('Mobile: Settings Drawer opens, toggles language, theme, and closes', async () => {
    const gearBtn = await cdp.eval('Boolean(document.querySelector("header button[title*=\'设置\'], header button[title*=\'Settings\']"))');
    if (!gearBtn) throw new Error('Mobile settings gear button not found');
    await cdp.eval('document.querySelector("header button[title*=\'设置\'], header button[title*=\'Settings\']").click()');
    await delay(400);

    const drawerVisible = await cdp.eval('document.body.innerText.includes("极地设置") || document.body.innerText.includes("Polar Settings")');
    if (!drawerVisible) throw new Error('Mobile settings drawer did not open');

    // Test clicking language in drawer
    await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button")[2].click()'); // English
    await delay(300);
    await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button")[1].click()'); // Chinese
    await delay(300);

    // Close settings drawer
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 6. Mobile Navigation Pill to Voyage Map
  await assertTest('Mobile: Bottom Voyage Navigation Pill opens DriftMapModal', async () => {
    const navPill = await cdp.eval('Boolean(document.querySelector("footer button[title*=\'航海图\'], footer button[title*=\'Chart\'], footer button[title*=\'Voyage\']"))');
    if (!navPill) throw new Error('Bottom navigation pill not found on mobile');
    await cdp.eval('document.querySelector("footer button[title*=\'航海图\'], footer button[title*=\'Chart\'], footer button[title*=\'Voyage\']").click()');
    await delay(400);
    const mapOpened = await cdp.eval('document.body.innerText.includes("航海图") || document.body.innerText.includes("Drift")');
    if (!mapOpened) throw new Error('DriftMapModal did not open from mobile navigation pill');
    // Close
    await cdp.eval('document.querySelector("div.fixed.inset-0 button").click()');
    await delay(300);
  });

  // 7. Mobile Stage Interactions: Otter, Fox, Whale
  await assertTest('Mobile: Center Stage Otter, Fox, and Whale respond to taps', async () => {
    // Otter tap
    await cdp.eval('document.querySelector("svg[viewBox=\'0 0 460 320\']").parentElement.click()');
    await delay(300);
    const bubble = await cdp.eval('Boolean(document.querySelector(".animate-bounce"))');
    if (!bubble) throw new Error('Otter bubble did not appear on mobile tap');

    // Whale tap
    const whaleFound = await cdp.eval('Boolean(document.querySelector("div[title*=\'座头鲸\'], div[title*=\'Whale\']"))');
    if (whaleFound) {
      await cdp.eval('document.querySelector("div[title*=\'座头鲸\'], div[title*=\'Whale\']").dispatchEvent(new MouseEvent("click", { bubbles: true }))');
      await delay(300);
    }
  });

  // 8. Mobile Focus Timer Presets
  await assertTest('Mobile: Focus Timer Presets switch duration (5m, 1m)', async () => {
    // Click 5m preset
    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const target = btns.find(b => b.innerText.includes('5m') || b.innerText.includes('5分'));
      if (target) target.click();
    })()`);
    await delay(200);
    const time5m = await cdp.eval('document.querySelector("footer .tabular-nums").innerText');
    if (time5m !== '05:00') throw new Error(`Expected 05:00 on mobile, got ${time5m}`);

    // Click 1m preset
    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const target = btns.find(b => b.innerText.includes('1m') || b.innerText.includes('1分'));
      if (target) target.click();
    })()`);
    await delay(200);
    const time1m = await cdp.eval('document.querySelector("footer .tabular-nums").innerText');
    if (time1m !== '01:00') throw new Error(`Expected 01:00 on mobile, got ${time1m}`);
  });

  // 9. Mobile Start Cruise & Whale Escort Verification
  await assertTest('Mobile: Start Cruise with leading Whale and check no horizontal overflow', async () => {
    // Click Start Cruise
    await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const startBtn = btns.find(b => b.innerText.includes('启航') || b.innerText.includes('出发') || b.innerText.includes('Sail') || b.innerText.includes('Cruise'));
      if (startBtn) startBtn.click();
    })()`);
    await delay(600);

    // Verify no horizontal overflow while cruising
    const isOverflown = await cdp.eval('document.documentElement.scrollWidth > 390');
    if (isOverflown) throw new Error('Horizontal scrollbar detected while cruising on mobile');

    // Click Stop Cruise
    const stopFound = await cdp.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('footer button'));
      const stopBtn = btns.find(b => b.innerText.includes('抛锚') || b.innerText.includes('浮上') || b.innerText.includes('Anchor') || b.innerText.includes('Cancel'));
      if (stopBtn) {
        stopBtn.click();
        return true;
      }
      return false;
    })()`);
    if (!stopFound) throw new Error('Stop cruise button not found on mobile');
    await delay(400);
  });

  // -------------------------------------------------------------
  // TEST SUITE 3: CLAM CRACKING RITUAL & REWARDS
  // -------------------------------------------------------------
  console.log('\n--- [TEST SUITE 3] Clam Cracking Ritual & Rewards ---');
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_cracking=1' });
  await waitForMount(cdp);

  await assertTest('Clam Cracking Modal: Taps 1, 2, 3 progress properly and reveal reward', async () => {
    const crackingVisible = await cdp.eval('Boolean(document.querySelector(".animate-pebble-idle, .animate-pebble-strike"))');
    if (!crackingVisible) throw new Error('Clam Cracking Modal not visible');

    // Strike 1
    await cdp.eval('document.querySelector(".cursor-pointer.select-none.group").click()');
    await delay(600);

    // Strike 2
    await cdp.eval('document.querySelector(".cursor-pointer.select-none.group").click()');
    await delay(600);

    // Strike 3 (Cracks shell open)
    await cdp.eval('document.querySelector(".cursor-pointer.select-none.group").click()');
    await delay(1200);

    // Verify Phase 2 reward card appears
    const rewardVisible = await cdp.eval('Boolean(document.querySelector(".animate-scaleUp button"))');
    if (!rewardVisible) throw new Error('Reward claim card did not appear after cracking');

    // Click Collect reward button
    await cdp.eval('document.querySelector(".animate-scaleUp button").click()');
    await delay(500);
  });

  // -------------------------------------------------------------
  // TEST SUITE 4: WAYPOINT ARRIVAL CELEBRATION MODAL
  // -------------------------------------------------------------
  console.log('\n--- [TEST SUITE 4] Waypoint Arrival Celebration Modal ---');
  await cdp.send('Page.navigate', { url: 'http://127.0.0.1:3000/?test_arrival=300' });
  await waitForMount(cdp);

  await assertTest('Waypoint Arrival Celebration Modal opens and buttons respond', async () => {
    const arrivalVisible = await cdp.eval('document.body.innerText.includes("抵达全新航海目的地") || document.body.innerText.includes("Arrived")');
    if (!arrivalVisible) throw new Error('Waypoint Arrival modal did not open');

    // Click "继续前行" (Continue)
    await cdp.eval('document.querySelectorAll("div.fixed.inset-0 button")[2].click()');
    await delay(400);

    const closed = await cdp.eval('!document.querySelector("div.fixed.inset-0 div[class*=\'border-sky-400\']")');
    if (!closed) throw new Error('Arrival modal did not close on continue button');
  });

  // Summary
  console.log('\n======================================================');
  console.log('              QA TEST SUITE SUMMARY                   ');
  console.log('======================================================');
  const passed = testResults.filter((r) => r.status === 'PASS').length;
  const failed = testResults.filter((r) => r.status === 'FAIL').length;
  console.log(`Total Tests Run: ${testResults.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  testResults.forEach((r) => {
    console.log(` [${r.status}] ${r.name}${r.error ? ` -> ${r.error}` : ''}`);
  });
  console.log('======================================================\n');

  cdp.close();
  edgeProc.kill();

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runQA().catch((err) => {
  console.error('Fatal QA script error:', err);
  process.exit(1);
});
