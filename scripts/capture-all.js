import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('summaries/screenshots/02');
const baseUrl = 'http://localhost:4173';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log('🚀 Starting full audit & screenshot capture with Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Helper: wait for fonts & reveals
  async function preparePage() {
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 600));
    // Trigger reveals
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    });
    await new Promise((r) => setTimeout(r, 300));
  }

  // 1. Full-page screenshots (24 files)
  const pagesToCapture = [
    { name: 'home', ar: '/ar/', en: '/en/' },
    { name: 'services', ar: '/ar/services/', en: '/en/services/' },
    { name: 'services-software-development', ar: '/ar/services/software-development/', en: '/en/services/software-development/' },
    { name: 'about', ar: '/ar/about/', en: '/en/about/' },
    { name: 'contact', ar: '/ar/contact/', en: '/en/contact/' },
    { name: '404', ar: '/404/', en: '/404/' },
  ];

  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];

      // 1440px desktop
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await preparePage();
      const fn1440 = `${item.name}-${lang}-1440.png`;
      await page.screenshot({ path: path.join(outDir, fn1440), fullPage: true });
      console.log(`📸 Saved: ${fn1440}`);

      // 390px mobile
      await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      await preparePage();
      const fn390 = `${item.name}-${lang}-390.png`;
      await page.screenshot({ path: path.join(outDir, fn390), fullPage: true });
      console.log(`📸 Saved: ${fn390}`);
    }
  }

  // 2. Drawer open in Arabic (at 390, drawer on RIGHT)
  console.log('📸 Capturing drawer-open-ar-390.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Click hamburger button
  await page.click('button[aria-controls="mobile-drawer"]');
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: path.join(outDir, 'drawer-open-ar-390.png') });
  console.log('📸 Saved: drawer-open-ar-390.png');

  // 3. Drawer open in English (at 390, drawer on LEFT)
  console.log('📸 Capturing drawer-open-en-390.png...');
  await page.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.click('button[aria-controls="mobile-drawer"]');
  await new Promise((r) => setTimeout(r, 650));
  await page.screenshot({ path: path.join(outDir, 'drawer-open-en-390.png') });
  console.log('📸 Saved: drawer-open-en-390.png');

  // 4. Contact validation error (Arabic, 390px)
  console.log('📸 Capturing contact-validation-ar-390.png...');
  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Click submit with empty fields
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'contact-validation-ar-390.png') });
  console.log('📸 Saved: contact-validation-ar-390.png');

  // 5. Contact success (English, 1440px)
  console.log('📸 Capturing contact-success-en-1440.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${baseUrl}/en/contact/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Fill in required fields
  await page.type('#form-name', 'Test Visitor');
  await page.type('#form-email', 'visitor@example.com');
  await page.type('#form-message', 'This is an inquiry message with more than ten characters.');
  await page.click('button[type="submit"]');
  // Wait for submission completion
  await new Promise((r) => setTimeout(r, 1300));
  await page.screenshot({ path: path.join(outDir, 'contact-success-en-1440.png') });
  console.log('📸 Saved: contact-success-en-1440.png');

  // 6. No-JS Home page (JavaScript disabled, 1440px)
  console.log('📸 Capturing nojs-home-ar-1440.png...');
  const noJsPage = await browser.newPage();
  await noJsPage.setJavaScriptEnabled(false);
  await noJsPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await noJsPage.goto(`${baseUrl}/ar/`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 400));
  await noJsPage.screenshot({ path: path.join(outDir, 'nojs-home-ar-1440.png'), fullPage: true });
  console.log('📸 Saved: nojs-home-ar-1440.png');
  await noJsPage.close();

  // 7. Reduced motion Home page (1440px)
  console.log('📸 Capturing reduced-motion-home-en-1440.png...');
  const reducedMotionPage = await browser.newPage();
  await reducedMotionPage.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await reducedMotionPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await reducedMotionPage.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await reducedMotionPage.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 500));
  await reducedMotionPage.screenshot({ path: path.join(outDir, 'reduced-motion-home-en-1440.png'), fullPage: true });
  console.log('📸 Saved: reduced-motion-home-en-1440.png');
  await reducedMotionPage.close();

  // 8. Test horizontal scroll overflow at 360px on all pages
  console.log('\n--- Checking for horizontal overflow at 360px width ---');
  await page.setViewport({ width: 360, height: 740 });
  let overflowErrors = 0;
  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`❌ Overflow detected at 360px on ${urlPath}! scrollWidth: > 360px`);
        overflowErrors++;
      } else {
        console.log(`✅ No horizontal overflow on ${urlPath} at 360px`);
      }
    }
  }

  // 9. ScrollTrigger count stability test (5 round-trip navigations)
  console.log('\n--- Testing ScrollTrigger count stability across 5 round-trip navigations ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  const counts = [];
  for (let i = 1; i <= 5; i++) {
    // Navigate to About
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/ar/about/"]');
      if (link) link.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Navigate back to Home
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/ar/"]');
      if (link) link.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    const triggerCount = await page.evaluate(() => {
      // @ts-ignore
      const st = window.ScrollTrigger;
      return st ? st.getAll().length : 0;
    });
    counts.push(triggerCount);
    console.log(`  Round ${i}: ScrollTrigger count = ${triggerCount}`);
  }

  // 10. Frame sequences for screen recordings / interactions
  console.log('\n--- Capturing frame sequences for motion interactions ---');
  const frameDir = path.join(outDir, 'frames');
  if (!fs.existsSync(frameDir)) {
    fs.mkdirSync(frameDir, { recursive: true });
  }

  // Interaction 1: Hero intro + scroll down (AR)
  console.log('Capturing hero-intro-scroll sequence...');
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  for (let f = 1; f <= 6; f++) {
    await page.evaluate((frame) => {
      window.scrollTo({ top: (frame - 1) * 350, behavior: 'instant' });
    }, f);
    await new Promise((r) => setTimeout(r, 120));
    await page.screenshot({ path: path.join(frameDir, `hero-intro-frame-${f}.png`) });
  }

  // Interaction 2: Mobile drawer open/close (AR, 390px)
  console.log('Capturing drawer-toggle sequence...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(frameDir, 'drawer-frame-1-closed.png') });
  await page.click('button[aria-controls="mobile-drawer"]');
  for (let f = 2; f <= 5; f++) {
    await new Promise((r) => setTimeout(r, 110));
    await page.screenshot({ path: path.join(frameDir, `drawer-frame-${f}-animating.png`) });
  }
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(frameDir, 'drawer-frame-6-open.png') });

  // Interaction 3: Contact form submit -> success (AR)
  console.log('Capturing contact-submit sequence...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(frameDir, 'contact-frame-1-empty.png') });
  await page.type('#form-name', 'طارق محمد');
  await page.screenshot({ path: path.join(frameDir, 'contact-frame-2-name.png') });
  await page.type('#form-email', 'tareq@example.ly');
  await page.type('#form-message', 'رسالة استفسار تقني حول خدمات تطوير البرمجيات والأنظمة.');
  await page.screenshot({ path: path.join(frameDir, 'contact-frame-3-filled.png') });
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: path.join(frameDir, 'contact-frame-4-submitting.png') });
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: path.join(frameDir, 'contact-frame-5-success.png') });

  await browser.close();
  console.log('\n🎉 ALL SCREENSHOTS, AUDITS, AND FRAME SEQUENCES COMPLETED!');
}

run().catch((err) => {
  console.error('Capture script error:', err);
  process.exit(1);
});
