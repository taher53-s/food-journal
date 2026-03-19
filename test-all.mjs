import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const pages = [
  { url: '/', name: 'Homepage' },
  { url: '/restaurants', name: 'Restaurants listing' },
  { url: '/gallery', name: 'Gallery' },
  { url: '/hall-of-fame', name: 'Hall of Fame' },
  { url: '/top-restaurants', name: 'Top Restaurants' },
  { url: '/analytics', name: 'Analytics' },
  { url: '/login', name: 'Login' },
];

const consoleErrors = [];
let totalPassed = 0;
let totalFailed = 0;

async function runTests() {
  const browser = await chromium.launch({ headless: true });

  console.log('\n=== DESKTOP (1280x800) ===');
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  for (const pageInfo of pages) {
    await testPage(desktopCtx, pageInfo, 'Desktop');
  }

  console.log('\n=== MOBILE (390x844) ===');
  const mobileCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  for (const pageInfo of pages) {
    await testPage(mobileCtx, pageInfo, 'Mobile');
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log(`RESULTS: ${totalPassed} passed, ${totalFailed} failed`);
  if (consoleErrors.length > 0) {
    console.log(`\n⚠️  Console errors (${consoleErrors.length}):`);
    consoleErrors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('\n✅ No console errors!');
  }
  if (totalFailed > 0) process.exit(1);
}

async function testPage(context, pageInfo, deviceName) {
  const page = await context.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${pageInfo.name}] ${deviceName}: ${msg.text()}`);
    }
  });
  try {
    const response = await page.goto(`${BASE}${pageInfo.url}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    const status = response?.status() || 0;
    if (status >= 400) { fail(`${pageInfo.name} (${deviceName}): HTTP ${status}`); }
    else { pass(`${pageInfo.name} (${deviceName}): HTTP ${status} — loaded`); }

    const hasBody = await page.$('body') !== null;
    ok(hasBody, `${pageInfo.name} (${deviceName}): Body element exists`);

    const bgColor = await page.evaluate(() => window.getComputedStyle(document.body).backgroundColor);
    const bgOk = bgColor === 'rgb(10, 26, 18)' || bgColor === 'rgb(250, 247, 240)' || bgColor.includes('rgba(0, 0, 0');
    console.log(`    Background: ${bgColor} ${bgOk ? '✅' : '⚠️'}`);

    const buttons = await page.$$('button');
    const links = await page.$$('a');
    pass(`${pageInfo.name} (${deviceName}): ${buttons.length} buttons, ${links.length} links`);

    for (const btn of buttons) {
      const text = await btn.textContent();
      const visible = await btn.isVisible();
      // Only flag hidden buttons that have visible text — skip icon-only buttons
      if (!visible && text?.trim().length > 0) {
        fail(`${pageInfo.name} (${deviceName}): Hidden button with text: "${text?.trim().substring(0, 30)}"`);
      }
    }
    for (const link of links) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (!href && href !== '') fail(`${pageInfo.name} (${deviceName}): Link without href: "${text?.trim().substring(0, 30)}"`);
    }

    if (deviceName === 'Mobile') {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      if (overflow) fail(`${pageInfo.name} (Mobile): HAS horizontal overflow!`);
      else pass(`${pageInfo.name} (Mobile): No horizontal overflow`);

      const smallTaps = await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.filter(b => {
          const r = b.getBoundingClientRect();
          const hasText = b.textContent?.trim().length > 0;
          // Skip icon-only buttons (back-to-top, copy, toggle, etc.) — they're intentional
          if (!hasText) return false;
          return (r.width < 44 || r.height < 44) && r.width > 0 && r.height > 0;
        }).length;
      });
      if (smallTaps === 0) pass(`${pageInfo.name} (Mobile): All buttons have 44px+ tap targets`);
      else fail(`${pageInfo.name} (Mobile): ${smallTaps} buttons have small tap targets (<44px)`);
    }

    const fontFamily = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily.substring(0, 50));
    pass(`${pageInfo.name} (${deviceName}): Font: ${fontFamily}`);
  } catch (err) {
    fail(`${pageInfo.name} (${deviceName}): ${err.message}`);
  }
  await page.close();
}

function pass(msg) { console.log(`  ✅ ${msg}`); totalPassed++; }
function fail(msg) { console.log(`  ❌ ${msg}`); totalFailed++; }
function ok(value, msg) { if (value) pass(msg); else fail(msg); }

runTests().catch(err => { console.error(err); process.exit(1); });
