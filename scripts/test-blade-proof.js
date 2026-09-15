import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:4173';
const FRAMES_DIR = path.resolve(__dirname, '../summaries/screenshots/05/frames');

fs.mkdirSync(FRAMES_DIR, { recursive: true });

async function run() {
  console.log('🚀 Starting Blade Overlay Proof Tests...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // -------------------------------------------------------------
  // Test 1: Blade Counter 5 Navigations
  // /en/ -> Services -> About -> Contact, then /ar/ -> خدماتنا -> من نحن
  // -------------------------------------------------------------
  console.log('\n--- 1. Testing Blade Counter Sequence ---');
  await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle0' });

  let count = await page.evaluate(() => window.__blade || 0);
  console.log(`Initial /en/ blade counter: ${count}`);

  // 1. /en/ -> Services
  console.log('Navigating: /en/ -> Services');
  await page.evaluate(() => {
    const link = document.querySelector('nav a[href="/en/services/"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  count = await page.evaluate(() => window.__blade || 0);
  console.log(`Blade counter after Services: ${count}`);

  // 2. Services -> About
  console.log('Navigating: Services -> About');
  await page.evaluate(() => {
    const link = document.querySelector('nav a[href="/en/about/"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  count = await page.evaluate(() => window.__blade || 0);
  console.log(`Blade counter after About: ${count}`);

  // 3. About -> Contact
  console.log('Navigating: About -> Contact');
  await page.evaluate(() => {
    const link = document.querySelector('nav a[href="/en/contact/"]') || document.querySelector('a[href="/en/contact/"]');
    if (link) link.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  count = await page.evaluate(() => window.__blade || 0);
  console.log(`Blade counter after Contact: ${count}`);

  // Switch to AR or navigate to /ar/
  console.log('Navigating to /ar/');
  await page.goto(`${BASE_URL}/ar/`, { waitUntil: 'networkidle0' });
  const arInitialCount = await page.evaluate(() => window.__blade || 0);
  console.log(`Reset/new page on /ar/, blade counter: ${arInitialCount}`);

  // Let's test the 5-step continuous sequence in one SPA session!
  console.log('\n--- Testing continuous 5-step navigation in single session ---');
  await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { window.__blade = 0; });

  // Step 1: /en/ -> Services
  await page.evaluate(() => {
    document.querySelector('nav a[href="/en/services/"]')?.click();
  });
  await new Promise(r => setTimeout(r, 1300));
  const c1 = await page.evaluate(() => window.__blade || 0);
  console.log(`1. Navigated to Services -> __blade = ${c1}`);

  // Step 2: Services -> About
  await page.evaluate(() => {
    document.querySelector('nav a[href="/en/about/"]')?.click();
  });
  await new Promise(r => setTimeout(r, 1300));
  const c2 = await page.evaluate(() => window.__blade || 0);
  console.log(`2. Navigated to About -> __blade = ${c2}`);

  // Step 3: About -> Contact
  await page.evaluate(() => {
    document.querySelector('a[href="/en/contact/"]')?.click();
  });
  await new Promise(r => setTimeout(r, 1300));
  const c3 = await page.evaluate(() => window.__blade || 0);
  console.log(`3. Navigated to Contact -> __blade = ${c3}`);

  // Step 4: Contact -> AR services (via language switch to /ar/contact/, then خدماتنا)
  // Or click language switch to /ar/contact/
  console.log('Clicking Switch Language to Arabic...');
  await page.evaluate(() => {
    document.querySelector('a[aria-label="Switch Language"]')?.click();
  });
  await new Promise(r => setTimeout(r, 1300));
  const c4 = await page.evaluate(() => window.__blade || 0);
  console.log(`4. Language switch to /ar/contact/ -> __blade = ${c4}`);

  // Step 5: AR Contact -> خدماتنا
  await page.evaluate(() => {
    document.querySelector('nav a[href="/ar/services/"]')?.click();
  });
  await new Promise(r => setTimeout(r, 1300));
  const c5 = await page.evaluate(() => window.__blade || 0);
  console.log(`5. Navigated to خدماتنا -> __blade = ${c5}`);

  console.log(`\n>>> Final continuous blade counter: ${c5} <<<`);

  // -------------------------------------------------------------
  // Test 2: Back button check
  // -------------------------------------------------------------
  console.log('\n--- 2. Testing Back Button (popstate bypass) ---');
  await page.goBack();
  await new Promise(r => setTimeout(r, 800));
  const backCount = await page.evaluate(() => window.__blade || 0);
  console.log(`Blade counter after page.goBack(): ${backCount} (Should equal ${c5})`);
  console.log(`Current URL after goBack: ${page.url()}`);

  // -------------------------------------------------------------
  // Test 3: 60ms Frame Captures for EN Navigation
  // -------------------------------------------------------------
  console.log('\n--- 3. Capturing 60ms EN Blade Frames ---');
  await page.goto(`${BASE_URL}/en/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Trigger click and immediately capture 14 frames at 60ms intervals
  await page.evaluate(() => {
    document.querySelector('nav a[href="/en/services/"]')?.click();
  });

  for (let i = 1; i <= 14; i++) {
    const framePath = path.join(FRAMES_DIR, `blade-en-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 60));
  }
  console.log('✅ Captured 14 EN blade frames (60ms intervals)');

  // -------------------------------------------------------------
  // Test 4: 60ms Frame Captures for AR Navigation
  // -------------------------------------------------------------
  console.log('\n--- 4. Capturing 60ms AR Blade Frames ---');
  await page.goto(`${BASE_URL}/ar/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  await page.evaluate(() => {
    document.querySelector('nav a[href="/ar/services/"]')?.click();
  });

  for (let i = 1; i <= 14; i++) {
    const framePath = path.join(FRAMES_DIR, `blade-ar-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: framePath });
    await new Promise(r => setTimeout(r, 60));
  }
  console.log('✅ Captured 14 AR blade frames (60ms intervals)');

  await browser.close();
  console.log('\n🎉 Blade Proof Tests Completed Successfully!');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
