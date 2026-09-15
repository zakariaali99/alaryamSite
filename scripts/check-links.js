#!/usr/bin/env node

/**
 * Crawls all HTML files in dist/ and verifies that every internal href
 * resolves to an existing file in dist/.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`🔍 Checking internal links across ${htmlFiles.length} HTML files in dist/...`);

let brokenLinks = 0;
let checkedLinks = 0;

const hrefRegex = /href=["']([^"']+)["']/gi;

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;

  while ((match = hrefRegex.exec(content)) !== null) {
    const rawHref = match[1];

    // Ignore anchors, external URLs, mailto, tel, javascript, etc.
    if (
      rawHref.startsWith('#') ||
      rawHref.startsWith('mailto:') ||
      rawHref.startsWith('tel:') ||
      rawHref.startsWith('javascript:') ||
      rawHref.startsWith('http://') ||
      rawHref.startsWith('https://')
    ) {
      continue;
    }

    checkedLinks++;

    // Clean query params and hash
    const cleanHref = rawHref.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    // Resolve against distDir
    let targetPath;
    if (cleanHref.startsWith('/')) {
      targetPath = path.join(distDir, cleanHref.slice(1));
    } else {
      targetPath = path.resolve(path.dirname(filePath), cleanHref);
    }

    // Check possible file candidates:
    // 1. exact file exists (e.g. dist/sitemap.xml, dist/404.html)
    // 2. dir/index.html exists (e.g. dist/ar/index.html)
    // 3. file + '.html' exists
    const exists =
      (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) ||
      (fs.existsSync(path.join(targetPath, 'index.html')) && fs.statSync(path.join(targetPath, 'index.html')).isFile()) ||
      fs.existsSync(targetPath + '.html');

    if (!exists) {
      console.error(`❌ Broken link in ${path.relative(rootDir, filePath)}: ${rawHref} -> not found at ${path.relative(rootDir, targetPath)}`);
      brokenLinks++;
    }
  }
}

if (brokenLinks > 0) {
  console.error(`\n❌ Found ${brokenLinks} broken internal links.`);
  process.exit(1);
} else {
  console.log(`✅ check:links passed: ${checkedLinks} internal links verified with zero broken links.`);
  process.exit(0);
}
