// scripts/test-transitions.js
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outFramesDir = path.resolve('summaries/screenshots/04/frames');
fs.mkdirSync(outFramesDir, { recursive: true });

async function run() {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('--- Testing EN Page Transitions ---');
  await page.goto('http://localhost:4173/en/', { waitUntil: 'networkidle0' });

  // Inject counter before navigating
  await page.evaluate(() => {
    const o = document.startViewTransition.bind(document);
    window.__vt = 0;
    document.startViewTransition = (cb) => {
      window.__vt++;
      return o(cb);
    };
  });

  // Scroll to middle (white section)
  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 400));

  const aboutLinkEn = await page.$('header a[href="/en/about/"]');
  if (!aboutLinkEn) throw new Error('About link not found in EN header');

  // Trigger navigation and capture frames every 80ms
  const frameCapturesEn = [];
  const startEn = Date.now();
  
  // Click
  const clickPromise = aboutLinkEn.click();

  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0');
    await page.screenshot({ path: path.join(outFramesDir, `vt-en-${num}.png`) });
    await new Promise(r => setTimeout(r, 80));
  }

  await clickPromise;
  await new Promise(r => setTimeout(r, 500));

  const vtEn = await page.evaluate(() => window.__vt);
  console.log(`window.__vt (EN): ${vtEn}`);

  console.log('\n--- Testing AR Page Transitions ---');
  await page.goto('http://localhost:4173/ar/', { waitUntil: 'networkidle0' });

  await page.evaluate(() => {
    const o = document.startViewTransition.bind(document);
    window.__vt = 0;
    document.startViewTransition = (cb) => {
      window.__vt++;
      return o(cb);
    };
  });

  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise(r => setTimeout(r, 400));

  const aboutLinkAr = await page.$('header a[href="/ar/about/"]');
  if (!aboutLinkAr) throw new Error('About link not found in AR header');

  const clickPromiseAr = aboutLinkAr.click();

  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0');
    await page.screenshot({ path: path.join(outFramesDir, `vt-ar-${num}.png`) });
    await new Promise(r => setTimeout(r, 80));
  }

  await clickPromiseAr;
  await new Promise(r => setTimeout(r, 500));

  const vtAr = await page.evaluate(() => window.__vt);
  console.log(`window.__vt (AR): ${vtAr}`);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
