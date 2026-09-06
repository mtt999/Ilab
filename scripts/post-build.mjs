import { readFileSync, mkdirSync, writeFileSync, existsSync, rmSync, copyFileSync } from 'fs'

// ─── SPA admin mirror ────────────────────────────────────────────────────────
// Vite builds to docs/app/ — recreate docs/app/admin/index.html so that
// labhive.app/app/admin serves the same SPA (GitHub Pages 404 → SPA shell).
const appSrc = readFileSync('docs/app/index.html', 'utf8')
const adminHtml = appSrc.replace('<title>LabHive — Intelligent Lab Platform</title>', '<title>LabHive — Admin</title>')
mkdirSync('docs/app/admin', { recursive: true })
writeFileSync('docs/app/admin/index.html', adminHtml)
console.log('✓ docs/app/admin/index.html recreated')

// ─── Backward-compat redirect: labhive.app/admin → labhive.app/app/admin ───
mkdirSync('docs/admin', { recursive: true })
writeFileSync('docs/admin/index.html', `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=/app/admin">
<title>LabHive — Admin</title>
</head><body>
<script>window.location.replace('/app/admin' + window.location.search + window.location.hash)</script>
</body></html>`)
console.log('✓ docs/admin/index.html (redirect → /app/admin) recreated')

// ─── Clean up old docs/assets/ (left from builds before base change) ────────
if (existsSync('docs/assets')) {
  rmSync('docs/assets', { recursive: true, force: true })
  console.log('✓ docs/assets/ (stale) removed')
}

// ─── Copy logo to docs/ root so email template URL stays stable ─────────────
if (existsSync('docs/app/logo.svg')) {
  copyFileSync('docs/app/logo.svg', 'docs/logo.svg')
  console.log('✓ docs/logo.svg copied from docs/app/logo.svg')
}

// ─── OAuth callback page ─────────────────────────────────────────────────────
writeFileSync('docs/oauth-callback.html', `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>iLab — connecting…</title></head>
<body>
<p style="font-family:sans-serif;color:#555;margin:40px auto;text-align:center;">Completing sign-in…</p>
<script>
  var search = window.location.search;
  if (search) {
    window.location.href = 'ilab://oauth-callback' + search;
    setTimeout(function() {
      window.location.href = 'https://labhive.app/app' + search;
    }, 600);
  }
</script>
</body>
</html>`)
console.log('✓ docs/oauth-callback.html recreated')

// ─── Root files ──────────────────────────────────────────────────────────────
writeFileSync('docs/CNAME', 'labhive.app')
console.log('✓ docs/CNAME recreated')

writeFileSync('docs/.nojekyll', '')
console.log('✓ docs/.nojekyll recreated')

// ─── Sitemap ─────────────────────────────────────────────────────────────────
writeFileSync('docs/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://labhive.app/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>https://labhive.app/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>https://labhive.app/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`)
console.log('✓ docs/sitemap.xml recreated')

writeFileSync('docs/robots.txt', `User-agent: *
Allow: /
Disallow: /app/

Sitemap: https://labhive.app/sitemap.xml`)
console.log('✓ docs/robots.txt recreated')

// ─── Static landing page at labhive.app/ ─────────────────────────────────────
writeFileSync('docs/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LabHive — Lab Management Software for Research Labs</title>
  <meta name="description" content="LabHive helps university and research labs manage equipment bookings, training records, supply inspections, project materials, and team messaging — all in one place.">
  <meta name="google-site-verification" content="ZqA7Op3DexBzOSnBShAATuuqj061noL59V20SVMViNw">
  <meta property="og:title" content="LabHive — Lab Management Software">
  <meta property="og:description" content="Equipment bookings, training records, supply inspections, project tracking — purpose-built for research and university labs.">
  <meta property="og:url" content="https://labhive.app/">
  <meta property="og:type" content="website">
  <link rel="icon" type="image/svg+xml" href="/app/favicon.svg">
  <link rel="canonical" href="https://labhive.app/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --teal: #1D9E75;
      --teal-dark: #178A66;
      --teal-light: #E1F5EE;
      --navy: #0C1140;
      --orange: #FF6B1A;
      --text: #111827;
      --text2: #4B5563;
      --border: #e5e7eb;
      --surface: #ffffff;
      --bg: #f8faf9;
    }
    body { font-family: 'DM Sans', -apple-system, sans-serif; color: var(--text); background: var(--surface); line-height: 1.6; }

    /* Nav */
    nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .nav-logo img { width: 36px; height: 36px; }
    .nav-logo span { font-size: 18px; font-weight: 700; color: var(--navy); letter-spacing: -0.3px; }
    .nav-links { display: flex; align-items: center; gap: 16px; }
    .nav-links a { font-size: 14px; color: var(--text2); text-decoration: none; font-weight: 500; }
    .nav-links a:hover { color: var(--teal); }
    .btn { display: inline-block; background: var(--teal); color: #fff !important; padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
    .btn:hover { background: var(--teal-dark) !important; }

    /* Hero */
    .hero { background: var(--navy); color: #fff; padding: 80px 24px 88px; text-align: center; }
    .hero-inner { max-width: 680px; margin: 0 auto; }
    .hero-badge { display: inline-block; background: rgba(29,158,117,0.2); color: #6ee7b7; border: 1px solid rgba(29,158,117,0.4); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; }
    .hero h1 { font-size: clamp(28px, 5vw, 48px); font-weight: 700; line-height: 1.15; letter-spacing: -0.5px; margin-bottom: 20px; }
    .hero h1 span { color: #6ee7b7; }
    .hero p { font-size: 17px; color: #cbd5e1; line-height: 1.7; margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; }
    .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-hero { display: inline-block; background: var(--teal); color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 16px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
    .btn-hero:hover { background: var(--teal-dark); }
    .btn-hero-outline { display: inline-block; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.3); padding: 14px 28px; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; transition: border-color 0.15s, color 0.15s; }
    .btn-hero-outline:hover { border-color: #fff; color: #fff; }
    .hero-demo { margin-top: 20px; font-size: 13px; color: #94a3b8; }
    .hero-demo code { background: rgba(255,255,255,0.1); padding: 2px 7px; border-radius: 4px; font-family: monospace; }

    /* Features */
    .features { background: var(--bg); padding: 80px 24px; }
    .section-inner { max-width: 1040px; margin: 0 auto; }
    .section-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--teal); margin-bottom: 12px; }
    .section-title { font-size: clamp(22px, 4vw, 34px); font-weight: 700; color: var(--navy); letter-spacing: -0.3px; margin-bottom: 12px; }
    .section-sub { font-size: 16px; color: var(--text2); max-width: 500px; margin-bottom: 48px; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 768px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .features-grid { grid-template-columns: 1fr; } }
    .feat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
    .feat-icon { font-size: 28px; margin-bottom: 12px; }
    .feat-card h3 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
    .feat-card p { font-size: 14px; color: var(--text2); line-height: 1.6; }

    /* Plans */
    .plans { padding: 80px 24px; }
    .plans-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
    @media (max-width: 640px) { .plans-grid { grid-template-columns: 1fr; } }
    .plan-card { border: 1.5px solid var(--border); border-radius: 16px; padding: 32px; }
    .plan-card.featured { border-color: var(--teal); background: var(--teal-light); }
    .plan-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: var(--teal); background: rgba(29,158,117,0.12); border-radius: 6px; padding: 3px 10px; margin-bottom: 16px; }
    .plan-card h3 { font-size: 22px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
    .plan-card .plan-desc { font-size: 14px; color: var(--text2); margin-bottom: 20px; }
    .plan-list { list-style: none; }
    .plan-list li { font-size: 14px; color: var(--text2); padding: 5px 0; display: flex; align-items: flex-start; gap: 8px; }
    .plan-list li::before { content: '✓'; color: var(--teal); font-weight: 700; flex-shrink: 0; margin-top: 1px; }

    /* CTA section */
    .cta-section { background: var(--navy); color: #fff; padding: 80px 24px; text-align: center; }
    .cta-section h2 { font-size: clamp(22px, 4vw, 36px); font-weight: 700; margin-bottom: 16px; }
    .cta-section p { font-size: 16px; color: #cbd5e1; margin-bottom: 36px; }

    /* Footer */
    footer { background: #0a0e2e; color: #64748b; padding: 32px 24px; text-align: center; font-size: 13px; }
    footer a { color: #64748b; text-decoration: none; }
    footer a:hover { color: #94a3b8; }
    footer .footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
  </style>
  <script>
    // Redirect deep links that predate the /app path (QR codes, email links, etc.)
    (function() {
      var s = window.location.search;
      if (s && (/[?&](screen|eq|mat|support|tab)=/.test(s))) {
        window.location.replace('/app' + s + window.location.hash);
      }
    })();
  </script>
</head>
<body>

  <nav>
    <a href="/" class="nav-logo">
      <img src="/app/labhive_logo.svg" alt="LabHive">
      <span>LabHive</span>
    </a>
    <div class="nav-links">
      <a href="/privacy">Privacy</a>
      <a href="/app?support=1">Contact</a>
      <a href="/app" class="btn">Launch App →</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">Research Lab Platform</div>
      <h1>The smarter way to manage<br><span>your research lab</span></h1>
      <p>LabHive brings equipment booking, training records, supply inspections, project tracking, and team messaging into one purpose-built platform for university and research labs.</p>
      <div class="hero-ctas">
        <a href="/app" class="btn-hero">Launch LabHive →</a>
        <a href="/app" class="btn-hero-outline">Try the demo</a>
      </div>
      <div class="hero-demo">Demo login — username: <code>demo</code> &nbsp; password: <code>demo</code></div>
    </div>
  </section>

  <section class="features">
    <div class="section-inner">
      <div class="section-label">Features</div>
      <div class="section-title">Everything your lab needs</div>
      <div class="section-sub">Built for the day-to-day reality of running a research or university lab.</div>
      <div class="features-grid">
        <div class="feat-card">
          <div class="feat-icon">📅</div>
          <h3>Equipment Booking</h3>
          <p>Calendar-based equipment reservations with manager approval workflows, before/after condition photos, and automated email notifications.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon">🎓</div>
          <h3>Training Records</h3>
          <p>Track certifications, upload training documents, manage equipment operation approvals, and monitor expiry dates for every lab member.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon">🔍</div>
          <h3>Supply Inspections</h3>
          <p>Structured room and supply inspection checklists with low-stock alerts, full inspection history, and exportable PDF and Excel reports.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon">🧪</div>
          <h3>Project &amp; Material Tracking</h3>
          <p>Organize research projects, track material samples with barcode and QR scanning, and export test results and records in any format.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon">🔧</div>
          <h3>Preventive Maintenance</h3>
          <p>Schedule and track maintenance tasks with a built-in task board, deadlines, priority levels, and team assignment across your lab.</p>
        </div>
        <div class="feat-card">
          <div class="feat-icon">💬</div>
          <h3>Team Messaging</h3>
          <p>Built-in staff-to-user messaging and a real-time notification system to keep your entire lab team informed and in sync.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="plans">
    <div class="section-inner">
      <div class="section-label">Account Types</div>
      <div class="section-title">Built for teams and individuals</div>
      <div class="plans-grid">
        <div class="plan-card featured">
          <div class="plan-tag">Team</div>
          <h3>LabHive Team</h3>
          <p class="plan-desc">Organisation-based accounts for labs with multiple members, managed by a lab administrator.</p>
          <ul class="plan-list">
            <li>Multi-user with role-based access control</li>
            <li>Lab manager and lab user roles</li>
            <li>Equipment booking with approval workflows</li>
            <li>Training record management for the whole team</li>
            <li>Supply inspection and maintenance tracking</li>
            <li>Admin panel for full lab management</li>
          </ul>
        </div>
        <div class="plan-card">
          <div class="plan-tag">Solo</div>
          <h3>LabHive Solo</h3>
          <p class="plan-desc">Personal lab workspace for individual researchers who need to track their own projects and materials.</p>
          <ul class="plan-list">
            <li>Personal project and material management</li>
            <li>Barcode and QR scanning for sample tracking</li>
            <li>Workspace sharing with collaborators</li>
            <li>Cloud storage integration (Google Drive, OneDrive)</li>
            <li>Inspection and maintenance tracking</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="section-inner">
      <h2>Ready to organize your lab?</h2>
      <p>Get started today — try the live demo with no sign-up required.</p>
      <a href="/app" class="btn-hero">Launch LabHive →</a>
      <div class="hero-demo" style="margin-top:16px;">Demo login — username: <code>demo</code> &nbsp; password: <code>demo</code></div>
    </div>
  </section>

  <footer>
    <div class="footer-links">
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Service</a>
      <a href="/app?support=1">Contact</a>
      <a href="/app">Launch App</a>
    </div>
    <p>© 2026 LabHive. All rights reserved.</p>
  </footer>

</body>
</html>`)
console.log('✓ docs/index.html (landing page) written')

// ─── Privacy policy ──────────────────────────────────────────────────────────
mkdirSync('docs/privacy', { recursive: true })
writeFileSync('docs/privacy/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy — LabHive</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 720px; margin: 48px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.7; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    h2 { font-size: 18px; margin-top: 36px; }
    p, li { font-size: 15px; color: #333; }
    a { color: #1D9E75; }
    .updated { color: #888; font-size: 13px; margin-bottom: 32px; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <div class="updated">Last updated: June 2026</div>
  <p>LabHive ("the platform", "we", "us") is an all-in-one research lab management platform available at <strong>labhive.app</strong>. This policy explains what information we collect, how we use it, and your rights.</p>

  <h2>1. Information We Collect</h2>
  <ul>
    <li><strong>Account information:</strong> your name and email address, provided at sign-up (Solo accounts) or created by your lab administrator (Team accounts).</li>
    <li><strong>Profile data:</strong> optional avatar, photo, and display preferences you set in your profile.</li>
    <li><strong>Lab activity data:</strong> equipment bookings, inspection results, training certificates, project materials, maintenance records, and barcode/QR records you create within the platform.</li>
    <li><strong>Equipment photos:</strong> before/after condition photos uploaded as part of the booking process.</li>
    <li><strong>Files and documents:</strong> training certificates, project records, SOPs, floor plans, and other documents you upload, stored in your chosen storage provider.</li>
    <li><strong>Messages:</strong> messages sent between lab staff and users through the LabHive messaging feature.</li>
    <li><strong>Support requests:</strong> subject, message, and contact email you provide when submitting a customer service request.</li>
    <li><strong>Usage and error data:</strong> anonymous technical error reports used to improve platform stability. These do not contain personal information.</li>
  </ul>

  <h2>2. How We Use Your Information</h2>
  <ul>
    <li>To operate all lab management features: equipment booking &amp; approval, inspections, training records, projects, preventive maintenance, and messaging</li>
    <li>To send booking confirmations, reminders, and status notifications</li>
    <li>To allow lab managers and administrators to review and manage lab activity within their organisation</li>
    <li>To respond to customer service and support requests</li>
    <li>To detect and fix technical errors in the platform</li>
    <li>To notify the platform administrator of new user registrations and system alerts</li>
  </ul>

  <h2>3. Solo Workspace Sharing</h2>
  <p>LabHive Solo users may invite other users to view or collaborate on their personal workspace. When you accept an invitation, the workspace owner can see your name. You can leave a shared workspace at any time from your Profile settings.</p>

  <h2>4. Cloud Storage Integrations</h2>
  <p>LabHive supports optional personal cloud storage providers for file uploads. When you connect a provider, the following applies:</p>
  <ul>
    <li><strong>Google Drive:</strong> LabHive uses the Google Drive API to store and retrieve your files in a dedicated "LabHive Files" folder. We request only the permissions needed to manage files in that folder and do not read, modify, or delete any other content. You can revoke access at any time from your <a href="https://myaccount.google.com/permissions" target="_blank">Google Account permissions page</a>.</li>
    <li><strong>Microsoft OneDrive:</strong> Files are stored in the app's designated AppFolder. We access only LabHive-created files. You can revoke access from your Microsoft account settings.</li>
    <li><strong>WebDAV:</strong> Files are stored on the server you configure. LabHive does not store your WebDAV credentials beyond your device's local storage.</li>
  </ul>
  <p>Organisational files (SOPs, equipment photos, module images, floor plans) are always stored in LabHive's Supabase Storage regardless of your personal storage choice.</p>

  <h2>5. Data Storage</h2>
  <p>Platform data is stored in a Supabase database hosted in the United States. File uploads are stored either in Supabase Storage or in your chosen personal storage provider.</p>

  <h2>6. Data Sharing</h2>
  <p>We do not sell or share your personal data with third parties. Within the platform, data is accessible only to members of your organisation and authorised administrators. Support request content is accessible to the platform administrator for the purpose of responding to your request.</p>

  <h2>7. Data Retention &amp; Deletion</h2>
  <p>Your data is retained for as long as your account is active. To request deletion of your account and all associated data, contact your lab administrator or reach us at the address below.</p>

  <h2>8. Cookies &amp; Local Storage</h2>
  <p>LabHive uses browser local storage to maintain your login session, storage provider preferences, and dashboard settings. No third-party tracking cookies are used.</p>

  <h2>9. Contact</h2>
  <p>For privacy questions or data requests: <a href="mailto:motlagh999@gmail.com">motlagh999@gmail.com</a></p>
  <p style="margin-top:48px;font-size:13px;color:#aaa;">© 2026 LabHive. <a href="/app" style="color:#aaa;">Back to app</a></p>
</body>
</html>`)
console.log('✓ docs/privacy/index.html recreated')

// ─── Terms of service ─────────────────────────────────────────────────────────
mkdirSync('docs/terms', { recursive: true })
writeFileSync('docs/terms/index.html', `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Terms of Service — LabHive</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 720px; margin: 48px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.7; }
    h1 { font-size: 28px; margin-bottom: 4px; }
    h2 { font-size: 18px; margin-top: 36px; }
    p, li { font-size: 15px; color: #333; }
    a { color: #1D9E75; }
    .updated { color: #888; font-size: 13px; margin-bottom: 32px; }
  </style>
</head>
<body>
  <h1>Terms of Service</h1>
  <div class="updated">Last updated: June 2026</div>
  <p>By using LabHive ("the platform") at <strong>labhive.app</strong>, you agree to these terms. Please read them carefully.</p>

  <h2>1. About LabHive</h2>
  <p>LabHive is an all-in-one research lab management platform providing equipment booking, room and supply inspections, training records, project management, preventive maintenance, barcode/QR management, team messaging, and related tools for research laboratories.</p>

  <h2>2. Account Types &amp; Access</h2>
  <p>LabHive offers two account types:</p>
  <ul>
    <li><strong>LabHive Team:</strong> Organisation-based accounts managed by a lab administrator. Access is granted by your organisation and is subject to your organisation's policies.</li>
    <li><strong>LabHive Solo:</strong> Individual researcher accounts. You may create a free Solo account to manage your own lab resources independently.</li>
  </ul>
  <p>You are responsible for keeping your login credentials confidential. If you believe your account has been compromised, notify your lab administrator or contact us immediately. You may not share your account credentials with others.</p>

  <h2>3. Acceptable Use</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use the platform for any unlawful purpose</li>
    <li>Attempt to access accounts, data, or administrative functions you are not authorised to access</li>
    <li>Upload malicious files, scripts, or content of any kind</li>
    <li>Interfere with the operation of the platform or its infrastructure</li>
    <li>Use automated tools to scrape, overload, or abuse the platform</li>
    <li>Misrepresent your identity or organisational affiliation</li>
  </ul>

  <h2>4. Equipment Booking</h2>
  <p>Equipment bookings made through LabHive are subject to approval by lab administrators. Approved bookings create a commitment to use the equipment at the scheduled time. You agree to complete any required before/after condition photos where requested and to report equipment issues promptly.</p>

  <h2>5. Content You Upload</h2>
  <p>You retain ownership of files, photos, and documents you upload. By uploading content, you grant LabHive permission to store and display it as part of the platform's functionality. You are responsible for ensuring you have the right to upload any content you submit, and that it does not violate any laws or third-party rights.</p>

  <h2>6. Solo Workspace Sharing</h2>
  <p>Solo users may invite collaborators to their personal workspace. You are responsible for managing your invitations and the access you grant. LabHive is not responsible for actions taken by invited collaborators within your workspace.</p>

  <h2>7. Cloud Storage Integrations</h2>
  <p>If you connect a third-party storage provider (Google Drive, OneDrive, or WebDAV), your use of that service is also governed by that provider's terms of service. LabHive accesses only the files it creates in your designated folder and does not read or modify other content.</p>
  <ul>
    <li>Google Drive: subject to <a href="https://policies.google.com/terms" target="_blank">Google's Terms of Service</a></li>
    <li>Microsoft OneDrive: subject to <a href="https://www.microsoft.com/en-us/servicesagreement" target="_blank">Microsoft's Services Agreement</a></li>
  </ul>

  <h2>8. Customer Support</h2>
  <p>Support requests submitted through LabHive are reviewed by the platform administrator. We aim to respond within a reasonable timeframe but do not guarantee response times.</p>

  <h2>9. Availability</h2>
  <p>We aim to keep LabHive available at all times but do not guarantee uninterrupted access. We may update, modify, or perform maintenance on the platform at any time, with or without prior notice.</p>

  <h2>10. Limitation of Liability</h2>
  <p>LabHive is provided "as is" without warranties of any kind. We are not liable for any loss of data, missed bookings, equipment damage, or other damages arising from use of the platform.</p>

  <h2>11. Changes to These Terms</h2>
  <p>We may update these terms from time to time. Continued use of the platform after changes are posted constitutes acceptance of the updated terms.</p>

  <h2>12. Contact</h2>
  <p>Questions about these terms: <a href="mailto:motlagh999@gmail.com">motlagh999@gmail.com</a></p>
  <p style="margin-top:48px;font-size:13px;color:#aaa;">© 2026 LabHive. <a href="/app" style="color:#aaa;">Back to app</a></p>
</body>
</html>`)
console.log('✓ docs/terms/index.html recreated')
