// scripts/run-lighthouse.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const urls = [
  { name: 'ar-home', url: 'http://localhost:4173/ar/' },
  { name: 'en-home', url: 'http://localhost:4173/en/' },
  { name: 'ar-services-detail', url: 'http://localhost:4173/ar/services/software-development/' },
];

const results = [];
const tmpDir = path.resolve(process.cwd(), 'scratch/lighthouse');
fs.mkdirSync(tmpDir, { recursive: true });

for (const item of urls) {
  for (const preset of ['desktop', 'mobile']) {
    const jsonPath = path.join(tmpDir, `${item.name}-${preset}.json`);
    const flags = preset === 'desktop'
      ? '--preset=desktop --throttling.rttMs=40 --throttling.throughputKbps=10240 --throttling.cpuSlowdownMultiplier=1'
      : '--throttling.rttMs=150 --throttling.throughputKbps=1638.4 --throttling.cpuSlowdownMultiplier=4';

    console.log(`Running Lighthouse on ${item.url} (${preset})...`);
    try {
      execSync(
        `npx lighthouse "${item.url}" --output=json --output-path="${jsonPath}" --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo ${flags} --quiet`,
        { stdio: 'inherit' }
      );
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const scores = {
        url: item.url,
        preset,
        perf: Math.round((data.categories.performance?.score || 0) * 100),
        a11y: Math.round((data.categories.accessibility?.score || 0) * 100),
        bp: Math.round((data.categories['best-practices']?.score || 0) * 100),
        seo: Math.round((data.categories.seo?.score || 0) * 100),
        cls: data.audits['cumulative-layout-shift']?.numericValue?.toFixed(3) || '0',
      };

      // Check audits that failed SEO or A11y or BP
      const failedAudits = [];
      for (const [key, audit] of Object.entries(data.audits || {})) {
        if (audit.score !== null && audit.score < 1 && ['is-on-https'].indexOf(key) === -1) {
          if (['crawlable-anchors', 'link-text', 'document-title', 'meta-description', 'viewport', 'color-contrast', 'button-name', 'label'].includes(key)) {
            failedAudits.push(`${key} (${audit.score})`);
          }
        }
      }
      scores.failed = failedAudits.join(', ');
      results.push(scores);
    } catch (err) {
      console.error(`Error running lighthouse for ${item.name} (${preset}):`, err.message);
    }
  }
}

console.log('\n--- LIGHTHOUSE RESULTS SUMMARY ---');
console.table(results);

fs.writeFileSync(path.join(tmpDir, 'summary.json'), JSON.stringify(results, null, 2));
