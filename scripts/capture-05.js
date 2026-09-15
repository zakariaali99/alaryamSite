import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ffmpegPath = '/opt/homebrew/bin/ffmpeg';
const outDir = path.resolve(__dirname, '../summaries/screenshots/05');
const baseUrl = 'http://localhost:4173';

fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('🚀 Starting Plan 05 Screenshot, Video Capture & Audit Suite...\n');

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Helper: scroll through whole page
  async function scrollThroughPage() {
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      let current = 0;
      const max = document.body.scrollHeight;
      while (current < max) {
        current += step;
        window.scrollTo(0, current);
        await new Promise((r) => setTimeout(r, 200));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 600));
  }

  // Helper: count hidden elements
  async function countHiddenElements() {
    return await page.evaluate(() => {
      const drawer = document.querySelector('#mobile-drawer, [role="dialog"], [data-drawer]');
      const drawerBackdrop = document.querySelector('.drawer-backdrop');
      const bladeOverlay = document.querySelector('#blade-overlay, [aria-hidden="true"]');

      return [...document.querySelectorAll('[data-reveal], .split-word, h1, h2, h3, p, a, li')]
        .filter((el) => {
          if (drawer && drawer.contains(el)) return false;
          if (drawerBackdrop && drawerBackdrop.contains(el)) return false;
          if (el.closest('#mobile-drawer') || el.closest('[data-drawer]')) return false;
          if (el.closest('#blade-overlay')) return false;

          const s = getComputedStyle(el);
          return (
            el.getBoundingClientRect().height > 0 &&
            (parseFloat(s.opacity) < 0.99 || s.visibility === 'hidden')
          );
        })
        .length;
    });
  }

  // 1. 24 Full-page screenshots & hidden element audit
  console.log('--- 1. Capturing 24 Full-Page Screenshots & Hidden Elements Audit ---');
  const pagesToCapture = [
    { name: 'home', ar: '/ar/', en: '/en/' },
    { name: 'services', ar: '/ar/services/', en: '/en/services/' },
    { name: 'services-software-development', ar: '/ar/services/software-development/', en: '/en/services/software-development/' },
    { name: 'about', ar: '/ar/about/', en: '/en/about/' },
    { name: 'contact', ar: '/ar/contact/', en: '/en/contact/' },
    { name: '404', ar: '/404.html', en: '/404.html' },
  ];

  const auditResults = [];

  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];

      // Desktop 1440px
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await scrollThroughPage();
      const hidden1440 = await countHiddenElements();
      const fn1440 = `${item.name}-${lang}-1440.png`;
      await page.screenshot({ path: path.join(outDir, fn1440), fullPage: true });
      auditResults.push({ page: item.name, lang, viewport: '1440px', hiddenCount: hidden1440 });
      console.log(`📸 Saved: ${fn1440} (Hidden: ${hidden1440})`);

      // Mobile 390px
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await scrollThroughPage();
      const hidden390 = await countHiddenElements();
      const fn390 = `${item.name}-${lang}-390.png`;
      await page.screenshot({ path: path.join(outDir, fn390), fullPage: true });
      auditResults.push({ page: item.name, lang, viewport: '390px', hiddenCount: hidden390 });
      console.log(`📸 Saved: ${fn390} (Hidden: ${hidden390})`);
    }
  }

  // 2. 360px Horizontal Overflow Check
  console.log('\n--- 2. Checking 360px Horizontal Overflow ---');
  await page.setViewport({ width: 360, height: 800, deviceScaleFactor: 1 });
  const overflowResults = [];

  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);

      const overflowData = await page.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const diff = docWidth - winWidth;
        const overflowingElements = [];

        document.querySelectorAll('*').forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 1) {
            overflowingElements.push({
              tag: el.tagName,
              className: el.className.toString().slice(0, 50),
              right: rect.right,
              diff: rect.right - winWidth
            });
          }
        });

        return { diff, hasOverflow: diff > 1, overflowingElements: overflowingElements.slice(0, 3) };
      });

      overflowResults.push({
        page: item.name,
        lang,
        hasOverflow: overflowData.hasOverflow,
        diff: overflowData.diff,
        overflowingElements: overflowData.overflowingElements
      });

      if (overflowData.hasOverflow) {
        console.error(`❌ Overflow detected on ${item.name} (${lang}): diff = ${overflowData.diff}px`, overflowData.overflowingElements);
      } else {
        console.log(`✅ No overflow: ${item.name} (${lang}) at 360px`);
      }
    }
  }

  // 3. Close-ups (viewport-only, after intro finishes)
  console.log('\n--- 3. Capturing Viewport Close-Ups ---');

  // hero-ar-1440.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(outDir, 'hero-ar-1440.png') });
  console.log('📸 Saved: hero-ar-1440.png');

  // hero-en-1440.png
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(outDir, 'hero-en-1440.png') });
  console.log('📸 Saved: hero-en-1440.png');

  // hero-ar-390.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(outDir, 'hero-ar-390.png') });
  console.log('📸 Saved: hero-ar-390.png');

  // hero-en-390.png
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1600));
  await page.screenshot({ path: path.join(outDir, 'hero-en-390.png') });
  console.log('📸 Saved: hero-en-390.png');

  // pagehero-services-ar-1440.png
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/services/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, 'pagehero-services-ar-1440.png') });
  console.log('📸 Saved: pagehero-services-ar-1440.png');

  // pagehero-service-detail-en-1440.png
  await page.goto(`${baseUrl}/en/services/software-development/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, 'pagehero-service-detail-en-1440.png') });
  console.log('📸 Saved: pagehero-service-detail-en-1440.png');

  // pagehero-about-ar-390.png
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/about/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(outDir, 'pagehero-about-ar-390.png') });
  console.log('📸 Saved: pagehero-about-ar-390.png');

  // 4. Special states
  console.log('\n--- 4. Capturing Special States ---');

  // Drawer Open
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.click('button[aria-controls="mobile-drawer"]');
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: path.join(outDir, 'drawer-open-ar-390.png') });
  console.log('📸 Saved: drawer-open-ar-390.png');

  // No-JS
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setJavaScriptEnabled(false);
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(outDir, 'nojs-home-ar-1440.png'), fullPage: true });
  console.log('📸 Saved: nojs-home-ar-1440.png');
  await page.setJavaScriptEnabled(true);

  // Reduced Motion
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'reduced-motion-home-en-1440.png'), fullPage: true });
  console.log('📸 Saved: reduced-motion-home-en-1440.png');
  await page.emulateMediaFeatures([]);

  // Contact States for thoroughness
  await page.setRequestInterception(true);
  const requestHandler = (req) => {
    if (req.url().includes('/api/contact.php') && req.method() === 'POST') {
      if (req.headers()['x-mock-error']) {
        req.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, error: 'server_error' }),
        });
      } else {
        req.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }
    } else {
      req.continue();
    }
  };
  page.on('request', requestHandler);

  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'contact-validation-ar-390.png') });
  console.log('📸 Saved: contact-validation-ar-390.png');

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.setExtraHTTPHeaders({ 'x-mock-error': '1' });
  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.type('input[name="name"]', 'سالم علي');
  await page.type('input[name="email"]', 'salem@example.ly');
  await page.type('textarea[name="message"]', 'طلب استشارة بخصوص الحلول البرمجية المتكاملة');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'contact-error-ar-1440.png') });
  console.log('📸 Saved: contact-error-ar-1440.png');

  await page.setExtraHTTPHeaders({});
  await page.goto(`${baseUrl}/en/contact/`, { waitUntil: 'networkidle0' });
  await page.type('input[name="name"]', 'John Doe');
  await page.type('input[name="email"]', 'john@example.com');
  await page.type('textarea[name="message"]', 'Requesting partnership consultation.');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'contact-success-en-1440.png') });
  console.log('📸 Saved: contact-success-en-1440.png');

  page.off('request', requestHandler);
  await page.setRequestInterception(false);

  // 5. Native Screencast Video Recordings (30fps)
  console.log('\n--- 5. Recording Native Screencast Videos with Puppeteer (30fps) ---');

  // Video 1: blade-en.webm (Home -> Services -> About)
  console.log('🎥 Recording blade-en.webm...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  let recorder = await page.screencast({
    path: path.join(outDir, 'blade-en.webm'),
    ffmpegPath: ffmpegPath,
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    document.querySelector('nav a[href="/en/services/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1600));
  await page.evaluate(() => {
    document.querySelector('nav a[href="/en/about/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1600));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 600));
  console.log('✅ Created: blade-en.webm');

  // Video 2: blade-ar.webm (الرئيسية -> خدماتنا -> من نحن)
  console.log('🎥 Recording blade-ar.webm...');
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  recorder = await page.screencast({
    path: path.join(outDir, 'blade-ar.webm'),
    ffmpegPath: ffmpegPath,
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    document.querySelector('nav a[href="/ar/services/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1600));
  await page.evaluate(() => {
    document.querySelector('nav a[href="/ar/about/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1600));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 600));
  console.log('✅ Created: blade-ar.webm');

  // Video 3: hero-intro-en.webm
  console.log('🎥 Recording hero-intro-en.webm...');
  await page.goto('about:blank');
  recorder = await page.screencast({
    path: path.join(outDir, 'hero-intro-en.webm'),
    ffmpegPath: ffmpegPath,
  });
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));
  await page.evaluate(async () => {
    const total = 900;
    let curr = 0;
    while (curr < total) {
      curr += 80;
      window.scrollTo(0, curr);
      await new Promise((res) => setTimeout(res, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 600));
  console.log('✅ Created: hero-intro-en.webm');

  // Video 4: hero-intro-ar-390.webm
  console.log('🎥 Recording hero-intro-ar-390.webm...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('about:blank');
  recorder = await page.screencast({
    path: path.join(outDir, 'hero-intro-ar-390.webm'),
    ffmpegPath: ffmpegPath,
  });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 2200));
  await page.evaluate(async () => {
    const total = 700;
    let curr = 0;
    while (curr < total) {
      curr += 70;
      window.scrollTo(0, curr);
      await new Promise((res) => setTimeout(res, 60));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 600));
  console.log('✅ Created: hero-intro-ar-390.webm');

  await browser.close();

  // Audit outputs
  console.log('\n--- HIDDEN ELEMENTS AUDIT TABLE ---');
  console.table(auditResults);
  const hiddenNonZero = auditResults.filter((r) => r.hiddenCount > 0);
  if (hiddenNonZero.length > 0) {
    console.error('❌ FAIL: Some pages have hidden elements remaining:', hiddenNonZero);
    process.exit(1);
  } else {
    console.log('🎉 ALL 24 pages report exactly 0 hidden elements!');
  }

  console.log('\n--- 360px OVERFLOW AUDIT TABLE ---');
  console.table(overflowResults.map(r => ({ page: r.page, lang: r.lang, hasOverflow: r.hasOverflow, diff: `${r.diff}px` })));
  const overflowFails = overflowResults.filter(r => r.hasOverflow);
  if (overflowFails.length > 0) {
    console.error('❌ FAIL: Horizontal overflow detected at 360px:', overflowFails);
    process.exit(1);
  } else {
    console.log('🎉 ALL pages report 0 horizontal overflow at 360px!');
  }

  // ffprobe probe video durations
  console.log('\n--- WEBM VIDEO PROBE (ffprobe) ---');
  const videos = ['blade-en.webm', 'blade-ar.webm', 'hero-intro-en.webm', 'hero-intro-ar-390.webm'];
  for (const v of videos) {
    const vPath = path.join(outDir, v);
    try {
      const dur = execSync(
        `/opt/homebrew/bin/ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${vPath}"`,
        { encoding: 'utf8' }
      ).trim();
      const packets = execSync(
        `/opt/homebrew/bin/ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of default=noprint_wrappers=1:nokey=1 "${vPath}"`,
        { encoding: 'utf8' }
      ).trim();
      const sz = fs.statSync(vPath).size;
      console.log(`🎬 ${v}: duration = ${parseFloat(dur).toFixed(2)}s, packets = ${packets}, size = ${(sz / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.log(`🎬 ${v}: file size = ${fs.statSync(vPath).size} bytes (probe note: ${e.message})`);
    }
  }

  console.log('\n🎉 Plan 05 Suite Completed Successfully!');
}

run().catch((err) => {
  console.error('Execution error in capture-05:', err);
  process.exit(1);
});
