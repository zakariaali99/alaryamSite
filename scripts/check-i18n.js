import fs from 'fs';
import path from 'path';

function getKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (obj[k] !== null && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      keys = keys.concat(getKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const arRaw = fs.readFileSync(path.resolve('src/locales/ar.json'), 'utf-8');
const enRaw = fs.readFileSync(path.resolve('src/locales/en.json'), 'utf-8');

const arObj = JSON.parse(arRaw);
const enObj = JSON.parse(enRaw);

const arKeys = getKeys(arObj);
const enKeys = getKeys(enObj);

const arSet = new Set(arKeys);
const enSet = new Set(enKeys);

const missingInEn = arKeys.filter(k => !enSet.has(k));
const missingInAr = enKeys.filter(k => !arSet.has(k));

if (missingInEn.length > 0 || missingInAr.length > 0) {
  console.error('❌ i18n keys mismatch!');
  if (missingInEn.length > 0) {
    console.error('Missing in en.json:', missingInEn);
  }
  if (missingInAr.length > 0) {
    console.error('Missing in ar.json:', missingInAr);
  }
  process.exit(1);
} else {
  console.log(`✅ i18n check passed: exactly ${arKeys.length} matching keys across ar.json and en.json.`);
  process.exit(0);
}
