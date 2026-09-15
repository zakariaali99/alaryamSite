// scripts/capture-all.js
import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ffmpegPath = '/opt/homebrew/bin/ffmpeg';
const outDir = path.resolve('summaries/screenshots/04');
const frameDir = path.join(outDir, 'frames');
const baseUrl = 'http://localhost:4173';

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(frameDir, { recursive: true });

async function run() {
  console.log('🚀 Starting Plan 04 Screenshot & Video Capture Suite...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Helper: scroll through whole page in steps of 60% viewport height, waiting 250ms per step
  async function scrollThroughPage() {
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.6;
      let current = 0;
      const max = document.body.scrollHeight;
      while (current < max) {
        current += step;
        window.scrollTo(0, current);
        await new Promise((r) => setTimeout(r, 250));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 800));
  }

  // Helper: count hidden elements excluding drawer and its backdrop
  async function countHiddenElements() {
    return await page.evaluate(() => {
      const drawer = document.querySelector('#mobile-drawer, [role="dialog"], [data-drawer]');
      const drawerBackdrop = document.querySelector('.drawer-backdrop');

      return [...document.querySelectorAll('[data-reveal], .split-word, h1, h2, h3, p, a, li')]
        .filter((el) => {
          if (drawer && drawer.contains(el)) return false;
          if (drawerBackdrop && drawerBackdrop.contains(el)) return false;
          if (el.closest('#mobile-drawer') || el.closest('[data-drawer]')) return false;

          const s = getComputedStyle(el);
          return (
            el.getBoundingClientRect().height > 0 &&
            (parseFloat(s.opacity) < 0.99 || s.visibility === 'hidden')
          );
        })
        .length;
    });
  }

  // 1. Full-page screenshots (24 files) + hidden element auditing
  const pagesToCapture = [
    { name: 'home', ar: '/ar/', en: '/en/' },
    { name: 'services', ar: '/ar/services/', en: '/en/services/' },
    { name: 'services-software-development', ar: '/ar/services/software-development/', en: '/en/services/software-development/' },
    { name: 'about', ar: '/ar/about/', en: '/en/about/' },
    { name: 'contact', ar: '/ar/contact/', en: '/en/contact/' },
    { name: '404', ar: '/404.html', en: '/404.html' },
  ];

  const auditResults = [];

  console.log('\n--- Capturing 24 Full-Page Screenshots & Verifying Hidden Counts ---');
  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];

      // 1440px desktop
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await scrollThroughPage();
      const hidden1440 = await countHiddenElements();
      const fn1440 = `${item.name}-${lang}-1440.png`;
      await page.screenshot({ path: path.join(outDir, fn1440), fullPage: true });
      auditResults.push({ page: item.name, lang, viewport: '1440px', hiddenCount: hidden1440 });
      console.log(`📸 Saved: ${fn1440} (Hidden elements: ${hidden1440})`);

      // 390px mobile
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await page.evaluate(() => document.fonts.ready);
      await scrollThroughPage();
      const hidden390 = await countHiddenElements();
      const fn390 = `${item.name}-${lang}-390.png`;
      await page.screenshot({ path: path.join(outDir, fn390), fullPage: true });
      auditResults.push({ page: item.name, lang, viewport: '390px', hiddenCount: hidden390 });
      console.log(`📸 Saved: ${fn390} (Hidden elements: ${hidden390})`);
    }
  }

  // 2. Drawer open states
  console.log('\n--- Capturing Drawer States ---');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.click('button[aria-controls="mobile-drawer"]');
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: path.join(outDir, 'drawer-open-ar-390.png') });
  console.log('📸 Saved: drawer-open-ar-390.png');

  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await page.click('button[aria-controls="mobile-drawer"]');
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: path.join(outDir, 'drawer-open-en-390.png') });
  console.log('📸 Saved: drawer-open-en-390.png');

  // 3. Contact Form validation, intercepted success & error
  console.log('\n--- Capturing Contact States ---');
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

  // Validation state (Arabic 390)
  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'contact-validation-ar-390.png') });
  console.log('📸 Saved: contact-validation-ar-390.png');

  // Error state (Arabic 1440)
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

  // Success state (English 1440)
  await page.setExtraHTTPHeaders({});
  await page.goto(`${baseUrl}/en/contact/`, { waitUntil: 'networkidle0' });
  await page.type('input[name="name"]', 'John Doe');
  await page.type('input[name="email"]', 'john@example.com');
  await page.type('textarea[name="message"]', 'Requesting partnership consultation.');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'contact-success-en-1440.png') });
  console.log('📸 Saved: contact-success-en-1440.png');

  // Success state (Arabic 390)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.type('input[name="name"]', 'سالم علي');
  await page.type('input[name="email"]', 'salem@example.ly');
  await page.type('textarea[name="message"]', 'طلب استشارة');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(outDir, 'contact-success-ar-390.png') });
  console.log('📸 Saved: contact-success-ar-390.png');

  page.off('request', requestHandler);
  await page.setRequestInterception(false);

  // 4. View Transition Frame Sequences (80ms interval)
  console.log('\n--- Capturing 80ms View Transition Frame Sequences ---');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  // EN
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const o = document.startViewTransition.bind(document);
    window.__vt = 0;
    document.startViewTransition = (cb) => {
      window.__vt++;
      return o(cb);
    };
  });
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise((r) => setTimeout(r, 400));
  const linkEn = await page.$('header a[href="/en/about/"]');
  const enFramesPromise = (async () => {
    for (let i = 1; i <= 10; i++) {
      const num = String(i).padStart(2, '0');
      await page.screenshot({ path: path.join(frameDir, `vt-en-${num}.png`) });
      await new Promise((r) => setTimeout(r, 80));
    }
  })();
  await linkEn.click();
  await enFramesPromise;
  const vtEnVal = await page.evaluate(() => window.__vt);
  console.log(`✅ EN View Transition Frames captured. window.__vt = ${vtEnVal}`);

  // AR
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const o = document.startViewTransition.bind(document);
    window.__vt = 0;
    document.startViewTransition = (cb) => {
      window.__vt++;
      return o(cb);
    };
  });
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise((r) => setTimeout(r, 400));
  const linkAr = await page.$('header a[href="/ar/about/"]');
  const arFramesPromise = (async () => {
    for (let i = 1; i <= 10; i++) {
      const num = String(i).padStart(2, '0');
      await page.screenshot({ path: path.join(frameDir, `vt-ar-${num}.png`) });
      await new Promise((r) => setTimeout(r, 80));
    }
  })();
  await linkAr.click();
  await arFramesPromise;
  const vtArVal = await page.evaluate(() => window.__vt);
  console.log(`✅ AR View Transition Frames captured. window.__vt = ${vtArVal}`);

  // 5. Native Puppeteer Screencast Video Recordings (§4)
  console.log('\n--- Recording Native Screencast Videos with Puppeteer ---');

  // Video 1: vt-en.webm
  console.log('🎥 Recording vt-en.webm...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise((r) => setTimeout(r, 400));

  let recorder = await page.screencast({
    path: path.join(outDir, 'vt-en.webm'),
    ffmpegPath: ffmpegPath,
  });
  await page.evaluate(() => {
    document.querySelector('header a[href="/en/about/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 800));
  console.log('✅ Created: vt-en.webm');

  // Video 2: vt-ar.webm
  console.log('🎥 Recording vt-ar.webm...');
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise((r) => setTimeout(r, 400));

  recorder = await page.screencast({
    path: path.join(outDir, 'vt-ar.webm'),
    ffmpegPath: ffmpegPath,
  });
  await page.evaluate(() => {
    document.querySelector('header a[href="/ar/about/"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1500));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 800));
  console.log('✅ Created: vt-ar.webm');

  // Video 3: hero-intro-ar.webm
  console.log('🎥 Recording hero-intro-ar.webm...');
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'domcontentloaded' });
  recorder = await page.screencast({
    path: path.join(outDir, 'hero-intro-ar.webm'),
    ffmpegPath: ffmpegPath,
  });
  await new Promise((r) => setTimeout(r, 2500)); // wait 2.5s
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    let curr = 0;
    while (curr < total) {
      curr += 120;
      window.scrollTo(0, curr);
      await new Promise((res) => setTimeout(res, 80));
    }
  });
  await new Promise((r) => setTimeout(r, 600));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 800));
  console.log('✅ Created: hero-intro-ar.webm');

  // Video 4: drawer-ar-390.webm
  console.log('🎥 Recording drawer-ar-390.webm...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  recorder = await page.screencast({
    path: path.join(outDir, 'drawer-ar-390.webm'),
    ffmpegPath: ffmpegPath,
  });
  await new Promise((r) => setTimeout(r, 500));
  await page.evaluate(() => {
    document.querySelector('button[aria-controls="mobile-drawer"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.evaluate(() => {
    document.querySelector('button[aria-label="إغلاق القائمة"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 800));
  console.log('✅ Created: drawer-ar-390.webm');

  // Video 5: contact-success-en.webm
  console.log('🎥 Recording contact-success-en.webm...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.setRequestInterception(true);
  page.on('request', requestHandler);
  await page.goto(`${baseUrl}/en/contact/`, { waitUntil: 'networkidle0' });
  recorder = await page.screencast({
    path: path.join(outDir, 'contact-success-en.webm'),
    ffmpegPath: ffmpegPath,
  });
  await page.type('input[name="name"]', 'Sarah Jenkins');
  await page.type('input[name="email"]', 'sarah@example.com');
  await page.type('textarea[name="message"]', 'Inquiring about IoT infrastructure integration for our facilities.');
  await page.evaluate(() => {
    document.querySelector('button[type="submit"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 2000));
  await recorder.stop();
  await new Promise((r) => setTimeout(r, 800));
  page.off('request', requestHandler);
  await page.setRequestInterception(false);
  console.log('✅ Created: contact-success-en.webm');

  await browser.close();

  console.log('\n--- HIDDEN ELEMENTS AUDIT TABLE ---');
  console.table(auditResults);
  const nonZero = auditResults.filter((r) => r.hiddenCount > 0);
  if (nonZero.length > 0) {
    console.error('❌ FAIL: Some pages have hidden elements remaining:', nonZero);
    process.exit(1);
  } else {
    console.log('🎉 ALL 24 pages report exactly 0 hidden elements!');
  }

  // Probe durations of the recorded webm files using ffprobe
  console.log('\n--- WEBM VIDEO DURATIONS (ffprobe) ---');
  const videos = ['vt-en.webm', 'vt-ar.webm', 'hero-intro-ar.webm', 'drawer-ar-390.webm', 'contact-success-en.webm'];
  for (const v of videos) {
    const vPath = path.join(outDir, v);
    try {
      const dur = execSync(
        `${ffmpegPath.replace('ffmpeg', 'ffprobe')} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${vPath}"`,
        { encoding: 'utf8' }
      ).trim();
      const sz = fs.statSync(vPath).size;
      console.log(`🎬 ${v}: duration = ${parseFloat(dur).toFixed(2)}s, size = ${(sz / 1024).toFixed(1)} KB`);
    } catch (e) {
      console.log(`🎬 ${v}: file size = ${fs.statSync(vPath).size} bytes`);
    }
  }
}

run().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
