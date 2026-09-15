#!/usr/bin/env node

/**
 * Packages the production site:
 * 1. Runs all verification checks and build.
 * 2. Copies .htaccess and 404.html if needed.
 * 3. Compresses dist/ into release/alaryam-site-YYYYMMDD.zip.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const releaseDir = path.join(rootDir, 'release');

console.log('📦 Starting release packaging...');

// 1. Run all checks
console.log('\n--- Running quality checks ---');
execSync('npm run check:i18n', { cwd: rootDir, stdio: 'inherit' });
execSync('npm run check:hex', { cwd: rootDir, stdio: 'inherit' });
execSync('npm run check:gradients', { cwd: rootDir, stdio: 'inherit' });

// 2. Build production site
console.log('\n--- Building SSG production bundle ---');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

// 3. Ensure 404.html exists in dist root
const nested404 = path.join(distDir, '404', 'index.html');
const flat404 = path.join(distDir, '404.html');
if (fs.existsSync(nested404) && !fs.existsSync(flat404)) {
  fs.copyFileSync(nested404, flat404);
  console.log('✅ Copied 404/index.html -> 404.html');
}

// 4. Ensure .htaccess is in dist root
const publicHtaccess = path.join(rootDir, 'public', '.htaccess');
const distHtaccess = path.join(distDir, '.htaccess');
if (fs.existsSync(publicHtaccess)) {
  fs.copyFileSync(publicHtaccess, distHtaccess);
  console.log('✅ Ensured .htaccess is copied to dist/');
}

// 5. Run link crawler check
console.log('\n--- Running link integrity check ---');
execSync('npm run check:links', { cwd: rootDir, stdio: 'inherit' });

// 6. Create release archive
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const zipFileName = `alaryam-site-${dateStr}.zip`;
const zipFilePath = path.join(releaseDir, zipFileName);

if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

console.log(`\n--- Compressing dist/ into release/${zipFileName} ---`);
// Using zip command from dist directory so archive contains public root directly
execSync(`cd "${distDir}" && zip -r -9 "${zipFilePath}" . -x "*.DS_Store"`, { stdio: 'inherit' });

const stats = fs.statSync(zipFilePath);
const sizeKb = (stats.size / 1024).toFixed(1);
const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`\n🎉 Release package created successfully!`);
console.log(`📁 File: release/${zipFileName}`);
console.log(`⚖️  Size: ${stats.size} bytes (${sizeKb} KB / ${sizeMb} MB)`);
