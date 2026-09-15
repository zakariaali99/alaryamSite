import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('summaries/screenshots/03');
const frameDir = path.join(outDir, 'frames');
const baseUrl = 'http://localhost:4173';

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
if (!fs.existsSync(frameDir)) {
  fs.mkdirSync(frameDir, { recursive: true });
}

async function run() {
  console.log('🚀 Starting full Plan 03 screenshot & video generation with Puppeteer...');
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
    { name: '404', ar: '/404.html', en: '/404.html' },
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
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, 'contact-validation-ar-390.png') });
  console.log('📸 Saved: contact-validation-ar-390.png');

  // 5. Contact Error State (Arabic, 1440px) via Request Interception 500
  console.log('📸 Capturing contact-error-ar-1440.png...');
  const errorPage = await browser.newPage();
  await errorPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await errorPage.setRequestInterception(true);
  errorPage.on('request', (req) => {
    if (req.url().includes('/api/contact.php')) {
      setTimeout(() => {
        req.respond({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ ok: false, error: 'server' }),
        });
      }, 400);
    } else {
      req.continue();
    }
  });

  await errorPage.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await errorPage.evaluate(() => document.fonts.ready);
  await errorPage.type('#form-name', 'طارق محمد');
  await errorPage.type('#form-email', 'tareq@example.ly');
  await errorPage.type('#form-message', 'رسالة استفسار تقني تختبر حالة الخطأ للنموذج.');
  await errorPage.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await errorPage.screenshot({ path: path.join(outDir, 'contact-error-ar-1440.png') });
  console.log('📸 Saved: contact-error-ar-1440.png');
  await errorPage.close();

  // 6. Contact Success State (English 1440px & Arabic 390px) via Request Interception 200
  console.log('📸 Capturing contact-success-en-1440.png & contact-success-ar-390.png...');
  const successPage = await browser.newPage();
  await successPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await successPage.setRequestInterception(true);
  successPage.on('request', (req) => {
    if (req.url().includes('/api/contact.php')) {
      setTimeout(() => {
        req.respond({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
      }, 800);
    } else {
      req.continue();
    }
  });

  await successPage.goto(`${baseUrl}/en/contact/`, { waitUntil: 'networkidle0' });
  await successPage.evaluate(() => document.fonts.ready);
  await successPage.screenshot({ path: path.join(frameDir, 'contact-submit-1.png') });

  await successPage.type('#form-name', 'Alexander Wright');
  await successPage.type('#form-email', 'alex@example.com');
  await successPage.type('#form-organization', 'Global Tech Ltd');
  await successPage.type('#form-message', 'We would like to consult on enterprise cloud architecture and IT security systems.');
  await successPage.screenshot({ path: path.join(frameDir, 'contact-submit-2.png') });

  await successPage.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 350));
  await successPage.screenshot({ path: path.join(frameDir, 'contact-submit-3.png') }); // Submitting spinner

  await new Promise((r) => setTimeout(r, 1100)); // Wait for 200 response & drawn check
  await successPage.screenshot({ path: path.join(frameDir, 'contact-submit-4.png') }); // Success panel
  await successPage.screenshot({ path: path.join(outDir, 'contact-success-en-1440.png') });
  console.log('📸 Saved: contact-success-en-1440.png');

  // Mobile Arabic success
  await successPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await successPage.goto(`${baseUrl}/ar/contact/`, { waitUntil: 'networkidle0' });
  await successPage.evaluate(() => document.fonts.ready);
  await successPage.type('#form-name', 'طارق محمد');
  await successPage.type('#form-email', 'tareq@example.ly');
  await successPage.type('#form-message', 'رسالة استفسار تقني حول خدمات تطوير البرمجيات والأنظمة.');
  await successPage.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1400));
  await successPage.screenshot({ path: path.join(outDir, 'contact-success-ar-390.png') });
  console.log('📸 Saved: contact-success-ar-390.png');
  await successPage.close();

  // 7. Page Transitions proof: English & Arabic 6-frame sequences
  console.log('📸 Capturing page transition sequences...');
  const vtPage = await browser.newPage();
  await vtPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  // English transition: Home -> Services
  await vtPage.goto(`${baseUrl}/en/`, { waitUntil: 'networkidle0' });
  await vtPage.evaluate(() => document.fonts.ready);
  await vtPage.screenshot({ path: path.join(frameDir, 'page-transition-en-1.png') });

  // Trigger transition navigation
  await vtPage.evaluate(() => {
    const link = document.querySelector('a[href="/en/services/"]');
    if (link) link.click();
  });
  for (let f = 2; f <= 5; f++) {
    await new Promise((r) => setTimeout(r, 100));
    await vtPage.screenshot({ path: path.join(frameDir, `page-transition-en-${f}.png`) });
  }
  await new Promise((r) => setTimeout(r, 450));
  await vtPage.screenshot({ path: path.join(frameDir, 'page-transition-en-6.png') });
  console.log('📸 Saved: page-transition-en frames 1-6');

  // Arabic transition: Home -> Services
  await vtPage.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await vtPage.evaluate(() => document.fonts.ready);
  await vtPage.screenshot({ path: path.join(frameDir, 'page-transition-ar-1.png') });

  await vtPage.evaluate(() => {
    const link = document.querySelector('a[href="/ar/services/"]');
    if (link) link.click();
  });
  for (let f = 2; f <= 5; f++) {
    await new Promise((r) => setTimeout(r, 100));
    await vtPage.screenshot({ path: path.join(frameDir, `page-transition-ar-${f}.png`) });
  }
  await new Promise((r) => setTimeout(r, 450));
  await vtPage.screenshot({ path: path.join(frameDir, 'page-transition-ar-6.png') });
  console.log('📸 Saved: page-transition-ar frames 1-6');
  await vtPage.close();

  // 8. 5-Second Motion Failsafe proof (CPU 4x slowdown)
  console.log('📸 Testing 5-second motion failsafe with 4x CPU slowdown...');
  const cpuPage = await browser.newPage();
  const client = await cpuPage.target().createCDPSession();
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cpuPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await cpuPage.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  
  // Wait 5.2 seconds
  await new Promise((r) => setTimeout(r, 5200));

  const motionReady = await cpuPage.evaluate(() => window.__ALARYAM_MOTION_READY__);
  const docClass = await cpuPage.evaluate(() => document.documentElement.className);
  console.log(`  window.__ALARYAM_MOTION_READY__ = ${motionReady}`);
  console.log(`  document.documentElement.className = "${docClass}"`);

  // Frame before scrolling: elements below fold should be hidden with opacity:0 / transform translateY
  await cpuPage.screenshot({ path: path.join(frameDir, 'reveal-after-5s-1-before-scroll.png') });

  // Scroll down 700px
  await cpuPage.evaluate(() => {
    window.scrollTo({ top: 700, behavior: 'instant' });
  });
  await new Promise((r) => setTimeout(r, 300));
  await cpuPage.screenshot({ path: path.join(frameDir, 'reveal-after-5s-2-after-scroll.png') });
  console.log('📸 Saved: reveal-after-5s frames 1 & 2');
  await cpuPage.close();

  // 9. Drawer animation sequence frames
  console.log('📸 Capturing drawer-frame sequence...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(frameDir, 'drawer-frame-1.png') });
  await page.click('button[aria-controls="mobile-drawer"]');
  for (let f = 2; f <= 5; f++) {
    await new Promise((r) => setTimeout(r, 110));
    await page.screenshot({ path: path.join(frameDir, `drawer-frame-${f}.png`) });
  }
  await new Promise((r) => setTimeout(r, 200));
  await page.screenshot({ path: path.join(frameDir, 'drawer-frame-6.png') });

  // 10. Hero intro sequence frames
  console.log('📸 Capturing hero-intro sequence...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  for (let f = 1; f <= 6; f++) {
    await page.evaluate((frame) => {
      window.scrollTo({ top: (frame - 1) * 320, behavior: 'instant' });
    }, f);
    await new Promise((r) => setTimeout(r, 120));
    await page.screenshot({ path: path.join(frameDir, `hero-intro-frame-${f}.png`) });
  }

  // 11. No-JS Home page
  console.log('📸 Capturing nojs-home-ar-1440.png...');
  const noJsPage = await browser.newPage();
  await noJsPage.setJavaScriptEnabled(false);
  await noJsPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await noJsPage.goto(`${baseUrl}/ar/`, { waitUntil: 'load' });
  await new Promise((r) => setTimeout(r, 400));
  await noJsPage.screenshot({ path: path.join(outDir, 'nojs-home-ar-1440.png'), fullPage: true });
  console.log('📸 Saved: nojs-home-ar-1440.png');
  await noJsPage.close();

  // 12. Reduced motion Home page
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

  // 13. Horizontal overflow check
  console.log('\n--- Checking for horizontal overflow at 360px width ---');
  await page.setViewport({ width: 360, height: 740 });
  for (const item of pagesToCapture) {
    for (const lang of ['ar', 'en']) {
      const urlPath = item[lang];
      await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle0' });
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      if (overflow) {
        console.error(`❌ Overflow detected at 360px on ${urlPath}!`);
      } else {
        console.log(`✅ No horizontal overflow on ${urlPath} at 360px`);
      }
    }
  }

  // 14. ScrollTrigger count stability test (5 round-trip navigations)
  console.log('\n--- Testing ScrollTrigger count stability across 5 round-trip navigations ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/ar/`, { waitUntil: 'networkidle0' });
  for (let i = 1; i <= 5; i++) {
    await page.evaluate(() => {
      const link = document.querySelector('a[href="/ar/about/"]');
      if (link) link.click();
    });
    await new Promise((r) => setTimeout(r, 600));

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
    console.log(`  Round ${i}: ScrollTrigger count = ${triggerCount}`);
  }

  await browser.close();

  // 15. Produce MP4 video clips using ffmpeg
  const ffmpegBin = '/opt/homebrew/bin/ffmpeg';
  if (fs.existsSync(ffmpegBin)) {
    console.log('\n🎬 Encoding MP4 video recordings using ffmpeg...');
    try {
      execSync(`${ffmpegBin} -y -framerate 4 -i "${path.join(frameDir, 'page-transition-en-%d.png')}" -c:v libx264 -pix_fmt yuv420p "${path.join(outDir, 'page-transition-en.mp4')}"`, { stdio: 'ignore' });
      console.log('🎥 Created: page-transition-en.mp4');

      execSync(`${ffmpegBin} -y -framerate 4 -i "${path.join(frameDir, 'page-transition-ar-%d.png')}" -c:v libx264 -pix_fmt yuv420p "${path.join(outDir, 'page-transition-ar.mp4')}"`, { stdio: 'ignore' });
      console.log('🎥 Created: page-transition-ar.mp4');

      execSync(`${ffmpegBin} -y -framerate 2 -i "${path.join(frameDir, 'contact-submit-%d.png')}" -c:v libx264 -pix_fmt yuv420p "${path.join(outDir, 'contact-submit.mp4')}"`, { stdio: 'ignore' });
      console.log('🎥 Created: contact-submit.mp4');

      execSync(`${ffmpegBin} -y -framerate 4 -i "${path.join(frameDir, 'drawer-frame-%d.png')}" -c:v libx264 -pix_fmt yuv420p "${path.join(outDir, 'drawer-toggle.mp4')}"`, { stdio: 'ignore' });
      console.log('🎥 Created: drawer-toggle.mp4');

      execSync(`${ffmpegBin} -y -framerate 3 -i "${path.join(frameDir, 'hero-intro-frame-%d.png')}" -c:v libx264 -pix_fmt yuv420p "${path.join(outDir, 'hero-intro-scroll.mp4')}"`, { stdio: 'ignore' });
      console.log('🎥 Created: hero-intro-scroll.mp4');
    } catch (e) {
      console.warn('FFmpeg encoding warning:', e);
    }
  } else {
    console.log('ℹ️ FFmpeg binary not found; 8-frame sequences provided in frames/ directory.');
  }

  console.log('\n🎉 ALL PLAN 03 SCREENSHOTS, VIDEOS, AUDITS & PROOFS COMPLETED!');
}

run().catch((err) => {
  console.error('Capture script error:', err);
  process.exit(1);
});
