# AL-ARYAM Website — Deployment Guide (cPanel)

Follow these steps to deploy the production package to your cPanel hosting environment.

---

## 1. Prerequisites & Mailbox Setup
1. Log into your **cPanel** dashboard.
2. Under **Email Accounts**, confirm or create the primary mailbox:
   - **Email:** `Info@Alaryam.ly`
   - **Quota:** Set an appropriate size or unlimited.
3. Under **Email Deliverability**:
   - Verify that **DKIM** and **SPF** records are valid for `alaryam.ly` so automated form emails from `no-reply@alaryam.ly` are not marked as spam.

---

## 2. SSL & Domain Configuration
1. Under **SSL/TLS Status**, ensure **AutoSSL** is active and that certificates cover both `alaryam.ly` and `www.alaryam.ly`.
2. Under **MultiPHP Manager**, verify that PHP version is set to **PHP 7.4 or higher** (e.g. PHP 8.1 / 8.2).
3. Ensure PHP `mail()` function is enabled in `php.ini`.

---

## 3. Upload & Extract Package
1. Build and package the release locally:
   ```bash
   npm run package
   ```
   This generates `release/alaryam-site-YYYYMMDD.zip`.
2. Open **File Manager** in cPanel and navigate to `public_html/` (or the document root for `alaryam.ly`).
3. Upload `release/alaryam-site-YYYYMMDD.zip`.
4. Click **Extract** to extract all contents directly into `public_html/`.
5. Verify that `.htaccess` is extracted (enable *Show Hidden Files* in File Manager Settings).
6. Verify file permissions:
   - Directories: `0755`
   - Files: `0644`
   - `.htaccess`: `0644`
   - `api/contact.php`: `0644`

---

## 4. Verification & Testing
1. **Root Redirection:**
   - Visit `http://alaryam.ly/` → should redirect with 301 to `https://alaryam.ly/ar/`.
   - Visit `https://www.alaryam.ly/` → should redirect with 301 to `https://alaryam.ly/ar/`.
2. **Sitemap & Robots:**
   - Visit `https://alaryam.ly/sitemap.xml` → should display the 20 localized URLs.
   - Visit `https://alaryam.ly/robots.txt` → should reference the sitemap.
3. **404 Page:**
   - Visit `https://alaryam.ly/non-existent-page` → should display the bilingual 404 page.
4. **Contact Form:**
   - Visit `https://alaryam.ly/ar/contact/` and `https://alaryam.ly/en/contact/`.
   - Test submitting valid data → verify confirmation message and receipt in `Info@Alaryam.ly`.
   - Test client validation errors (empty required fields, short message).
   - Test honeypot (bots submitting `website`) → silently accepted without delivery.

---

## 5. Search Console
1. Open [Google Search Console](https://search.google.com/search-console).
2. Add or select the property `https://alaryam.ly/`.
3. Under **Sitemaps**, submit:
   ```
   https://alaryam.ly/sitemap.xml
   ```
4. Confirm successful discovery and indexing status.
