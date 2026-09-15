import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = path.resolve('summaries/screenshots/01');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // 1. Home AR 1440
  console.log('Capturing home-ar-1440.png...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173/ar/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Trigger reveal classes
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal-visible'));
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outDir, 'home-ar-1440.png'),
    fullPage: true,
  });

  // 2. Home EN 1440
  console.log('Capturing home-en-1440.png...');
  await page.goto('http://localhost:4173/en/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal-visible'));
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outDir, 'home-en-1440.png'),
    fullPage: true,
  });

  // 3. Home AR 390
  console.log('Capturing home-ar-390.png...');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto('http://localhost:4173/ar/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal-visible'));
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outDir, 'home-ar-390.png'),
    fullPage: true,
  });

  // 4. Home EN 390
  console.log('Capturing home-en-390.png...');
  await page.goto('http://localhost:4173/en/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('reveal-visible'));
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({
    path: path.join(outDir, 'home-en-390.png'),
    fullPage: true,
  });

  // 5. Header mobile menu open AR 390
  console.log('Capturing header-mobile-menu-open-ar-390.png...');
  await page.goto('http://localhost:4173/ar/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Click hamburger button
  const hamburger = await page.$('button[aria-controls="mobile-menu"]');
  if (hamburger) {
    await hamburger.click();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(outDir, 'header-mobile-menu-open-ar-390.png'),
      clip: { x: 0, y: 0, width: 390, height: 480 },
    });
  } else {
    console.error('Hamburger button not found!');
  }

  // 6. Check horizontal scroll at 360px
  console.log('Checking horizontal scroll at 360px...');
  await page.setViewport({ width: 360, height: 640 });
  await page.goto('http://localhost:4173/ar/', { waitUntil: 'networkidle0' });
  const scrollWidthAr = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidthAr = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`AR at 360px: scrollWidth = ${scrollWidthAr}, clientWidth = ${clientWidthAr}`);

  await page.goto('http://localhost:4173/en/', { waitUntil: 'networkidle0' });
  const scrollWidthEn = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidthEn = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`EN at 360px: scrollWidth = ${scrollWidthEn}, clientWidth = ${clientWidthEn}`);

  if (scrollWidthAr > 360 || scrollWidthEn > 360) {
    console.error('❌ Horizontal scroll detected at 360px!');
  } else {
    console.log('✅ No horizontal scroll at 360px.');
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
