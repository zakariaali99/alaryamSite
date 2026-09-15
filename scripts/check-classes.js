#!/usr/bin/env node

/**
 * Validates that all static CSS class tokens used in src/**\/*.tsx
 * exist in the compiled CSS bundle.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distAssetsDir = path.join(rootDir, 'dist', 'assets');

// List of classes that are purposefully unstyled hook identifiers, dynamically managed, or external
const ALLOWED_HOOK_CLASSES = new Set([
  'hero-text-block',
  'hero-eyebrow',
  'hero-heading',
  'hero-lead',
  'hero-buttons',
  'hero-visual-block',
  'hero-peaklines',
  'hero-mark',
  'hero-rule',
  'page-hero-peaklines',
  'page-hero-title',
  'page-hero-lead',
  'breadcrumbs-nav',
  'not-found-mark',
  'cta-band-box',
  'cta-peaklines',
  'magnetic-btn',
  'footer-peaklines',
  'why-us-icon',
  'peak-line-stroke',
  'peak-line-base',
  'split-word',
  'active',
  'is-active',
  'pending',
  'transitioning',
  'button-hover-fill',
  'button-content',
]);

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

// Find compiled CSS file
if (!fs.existsSync(distAssetsDir)) {
  console.error('❌ dist/assets directory not found. Run npm run build first.');
  process.exit(1);
}

const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.css'));
if (cssFiles.length === 0) {
  console.error('❌ No CSS file found in dist/assets.');
  process.exit(1);
}

let compiledCss = '';
for (const f of cssFiles) {
  compiledCss += fs.readFileSync(path.join(distAssetsDir, f), 'utf8') + '\n';
}

const tsxFiles = getAllTsxFiles(srcDir);
const usedClasses = new Map(); // className -> [files]

// Extract class tokens from className="..." and className={`...`}
const classNameRegex = /className=(?:["']([^"']+)["']|{`([^`]+)`})/g;

for (const file of tsxFiles) {
  const content = fs.readFileSync(file, 'utf8');
  let match;

  while ((match = classNameRegex.exec(content)) !== null) {
    const rawClassStr = match[1] || match[2] || '';
    // Strip out ${...} template variables
    const cleanStr = rawClassStr.replace(/\$\{[^}]+\}/g, ' ');
    const tokens = cleanStr
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);

    for (const token of tokens) {
      // Ignore ternary tokens or invalid symbols
      if (token.includes('?') || token.includes(':') && !token.includes('-') && !token.includes('/')) continue;
      if (token.startsWith('(') || token.endsWith(')')) continue;
      if (!usedClasses.has(token)) {
        usedClasses.set(token, new Set());
      }
      usedClasses.get(token).add(path.relative(rootDir, file));
    }
  }
}

// Check if token exists in CSS
function isClassInCss(token, css) {
  if (ALLOWED_HOOK_CLASSES.has(token)) return true;

  // Escape special chars for CSS selector matching
  const escaped = token
    .replace(/\\/g, '\\\\')
    .replace(/\//g, '\\/')
    .replace(/:/g, '\\:')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\./g, '\\.')
    .replace(/%/g, '\\%')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\+/g, '\\+')
    .replace(/,/g, '\\,');

  // Check for .escaped in CSS
  const selector = '.' + escaped;
  return css.includes(selector);
}

const missing = [];

for (const [token, files] of usedClasses.entries()) {
  if (!isClassInCss(token, compiledCss)) {
    missing.push({ token, files: Array.from(files) });
  }
}

if (missing.length > 0) {
  console.error(`❌ check:classes failed! Found ${missing.length} undefined class tokens:`);
  for (const item of missing) {
    console.error(`  - "${item.token}" in [${item.files.join(', ')}]`);
  }
  process.exit(1);
} else {
  console.log(`✅ check:classes passed: all ${usedClasses.size} class tokens verified in compiled CSS.`);
  process.exit(0);
}
