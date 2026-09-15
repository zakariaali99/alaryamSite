#!/usr/bin/env node

/**
 * Generates public/sitemap.xml containing all 20 localized URLs
 * with xhtml:link alternates for ar, en, and x-default.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const baseUrl = 'https://alaryam.ly';
const today = new Date().toISOString().split('T')[0];

const serviceSlugs = [
  'software-development',
  'technical-support',
  'security-surveillance',
  'networks-infrastructure',
  'project-management',
  'iot',
];

const paths = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/services/', priority: '0.9', changefreq: 'weekly' },
  ...serviceSlugs.map((slug) => ({
    path: `/services/${slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
  { path: '/about/', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact/', priority: '0.8', changefreq: 'monthly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
xml += `        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

for (const p of paths) {
  for (const lang of ['ar', 'en']) {
    const loc = `${baseUrl}/${lang}${p.path === '/' ? '/' : p.path}`;
    const arHref = `${baseUrl}/ar${p.path === '/' ? '/' : p.path}`;
    const enHref = `${baseUrl}/en${p.path === '/' ? '/' : p.path}`;
    const defaultHref = arHref;

    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.changefreq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="ar" href="${arHref}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="en" href="${enHref}"/>\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>\n`;
    xml += `  </url>\n`;
  }
}

xml += `</urlset>\n`;

const sitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(sitemapPath, xml, 'utf8');

console.log(`✅ Generated sitemap at ${sitemapPath} with ${paths.length * 2} URLs.`);
