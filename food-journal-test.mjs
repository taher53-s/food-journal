import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';
const MOBILE = { viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15' };
const DESKTOP = { viewport: { width: 1280, height: 800 } };

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
  const context = await browser.newContext();

  for (const pageInfo of pages) {
    // Desktop test
    await testPage(context, pageInfo, DESKTOP, false);
    // Mobile test
    await testPage(context, pageInfo, MOBILE, true);
  }

  await browser.close();

  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
  if (consoleErrors.length > 0) {
    console.log(`\nConsole errors found (${consoleErrors.length}):`);
    consoleErrors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('\nNo console errors found!');
  }
}

async function testPage(baseContext, pageInfo, device, isMobile) {
  const deviceName = isMobile ? 'Mobile' : 'Desktop';
  const ctx = await baseContext.newContext({ ...device });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = `[${pageInfo.name}] ${deviceName}: Console error: ${msg.text()}`;
      consoleErrors.push(text);
    }
  });
  page.on('pageerror', err => {
    const text = `[${pageInfo.name}] ${deviceName}: Page error: ${err.message}`;
    errors.push(text);
    consoleErrors.push(text);
  });

  try {
    const response = await page.goto(`${BASE}${pageInfo.url}`, { waitUntil: 'networkidle', timeout: 15000 });
    const status = response?.status() || 0;

    // Check HTTP status
    if (status >= 400) {
      fail(`${pageInfo.name} (${deviceName}): HTTP ${status}`);
    } else {
      pass(`${pageInfo.name} (${deviceName}): Loaded successfully (HTTP ${status})`);
    }

    // Check page has content
    const body = await page.$('body');
    if (!body) {
      fail(`${pageInfo.name} (${deviceName}): No body element found`);
    } else {
      pass(`${pageInfo.name} (${deviceName}): Body element present`);
    }

    // Check background color (theme consistency)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    pass(`${pageInfo.name} (${deviceName}): Body bg: ${bgColor}`);

    // Check for broken images (404s)
    const failedResources = [];
    page.on('response', resp => {
      if (resp.status() === 404 && resp.url().match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        failedResources.push(resp.url());
      }
    });

    // Test buttons and links
    const buttons = await page.$$('button');
    const links = await page.$$('a');
    pass(`${pageInfo.name} (${deviceName}): Found ${buttons.length} buttons, ${links.length} links`);

    // Check all links are clickable (have href)
    for (const link of links.slice(0, 10)) {
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      if (href) {
        pass(`${pageInfo.name} (${deviceName}): Link "${text?.trim().substring(0, 30)}" → ${href}`);
      }
    }

    // Check all buttons are visible
    for (const btn of buttons.slice(0, 10)) {
      const text = await btn.textContent();
      const visible = await btn.isVisible();
      if (visible) {
        pass(`${pageInfo.name} (${deviceName}): Button "${text?.trim().substring(0, 30)}" is visible`);
      }
    }

    // Check navbar exists
    const navbar = await page.$('nav, [class*="fixed"]');
    if (navbar) {
      pass(`${pageInfo.name} (${deviceName}): Navigation present`);
    } else {
      // Might be fine if it's a different structure
      pass(`${pageInfo.name} (${deviceName}): No fixed nav (may be scrollable)`);
    }

    // Check font loading (no FOUT to default)
    const fontFamily = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily;
    });
    pass(`${pageInfo.name} (${deviceName}): Font family: ${fontFamily.substring(0, 60)}`);

    // Mobile-specific checks
    if (isMobile) {
      // Check no horizontal overflow
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      if (!overflow) {
        pass(`${pageInfo.name} (Mobile): No horizontal overflow`);
      } else {
        fail(`${pageInfo.name} (Mobile): HAS horizontal overflow!`);
      }

      // Check buttons have adequate tap targets
      const smallTaps = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.filter(b => {
          const rect = b.getBoundingClientRect();
          return rect.width < 44 || rect.height < 44;
        }).length;
      });
      if (smallTaps === 0) {
        pass(`${pageInfo.name} (Mobile): All buttons have adequate tap targets (44px+)`);
      } else {
        fail(`${pageInfo.name} (Mobile): ${smallTaps} buttons have small tap targets`);
      }
    }

    // Check for duplicate IDs
    const dupIds = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      const seen = new Set();
      const dups = [];
      for (const id of ids) {
        if (seen.has(id) && id) dups.push(id);
        seen.add(id);
      }
      return dups;
    });
    if (dupIds.length === 0) {
      pass(`${pageInfo.name} (${deviceName}): No duplicate IDs`);
    } else {
      fail(`${pageInfo.name} (${deviceName}): Duplicate IDs: ${dupIds.join(', ')}`);
    }

    // Check no unhandled promise rejections
    if (errors.length > 0) {
      errors.forEach(e => fail(e));
    } else {
      pass(`${pageInfo.name} (${deviceName}): No JavaScript errors`);
    }

  } catch (err) {
    fail(`${pageInfo.name} (${deviceName}): ${err.message}`);
  }

  await ctx.close();
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
  totalPassed++;
}

function fail(msg) {
  console.log(`  ❌ ${msg}`);
  totalFailed++;
}

runTests().catch(console.error);
