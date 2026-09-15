import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
process.env.CHROME_PATH = chromePath;

const auditTargets = [
  { url: 'http://localhost:4173/ar/', label: '/ar/ (desktop)', preset: 'desktop' },
  { url: 'http://localhost:4173/ar/', label: '/ar/ (mobile)', preset: 'mobile' },
  { url: 'http://localhost:4173/en/services/', label: '/en/services/ (desktop)', preset: 'desktop' },
  { url: 'http://localhost:4173/en/services/', label: '/en/services/ (mobile)', preset: 'mobile' },
  { url: 'http://localhost:4173/ar/contact/', label: '/ar/contact/ (desktop)', preset: 'desktop' },
  { url: 'http://localhost:4173/ar/contact/', label: '/ar/contact/ (mobile)', preset: 'mobile' },
];

const results = [];
const tmpJson = path.resolve('scripts/tmp-lh.json');

console.log('🚦 Starting Lighthouse audits...\n');

for (const target of auditTargets) {
  const flags = [
    target.url,
    '--output=json',
    `--output-path="${tmpJson}"`,
    target.preset === 'desktop' ? '--preset=desktop' : '',
    '--chrome-flags="--headless=new --no-sandbox"',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--quiet',
  ].filter(Boolean).join(' ');

  try {
    execSync(`npx -y lighthouse ${flags}`, { stdio: 'pipe' });
    const data = JSON.parse(fs.readFileSync(tmpJson, 'utf8'));
    const perf = Math.round((data.categories.performance?.score || 0) * 100);
    const a11y = Math.round((data.categories.accessibility?.score || 0) * 100);
    const bp = Math.round((data.categories['best-practices']?.score || 0) * 100);
    const seo = Math.round((data.categories.seo?.score || 0) * 100);
    const cls = data.audits['cumulative-layout-shift']?.numericValue?.toFixed(3) || '0.000';

    results.push({
      target: target.label,
      performance: perf,
      accessibility: a11y,
      bestPractices: bp,
      seo: seo,
      cls: cls,
    });

    console.log(`✅ ${target.label.padEnd(26)} | Perf: ${perf} | A11y: ${a11y} | BestPrac: ${bp} | SEO: ${seo} | CLS: ${cls}`);
  } catch (err) {
    console.error(`❌ Failed auditing ${target.label}:`, err.message);
  }
}

if (fs.existsSync(tmpJson)) {
  fs.unlinkSync(tmpJson);
}

console.log('\n📊 Summary Table:');
console.table(results);
