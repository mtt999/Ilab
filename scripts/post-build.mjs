import { readFileSync, mkdirSync, writeFileSync, existsSync, rmSync, copyFileSync } from 'fs'

// ─── SPA admin mirror ────────────────────────────────────────────────────────
const appSrc = readFileSync('docs/app/index.html', 'utf8')
const adminHtml = appSrc.replace('<title>LabHive — Intelligent Lab Platform</title>', '<title>LabHive — Admin</title>')
mkdirSync('docs/app/admin', { recursive: true })
writeFileSync('docs/app/admin/index.html', adminHtml)
console.log('✓ docs/app/admin/index.html recreated')

// ─── Backward-compat redirect: labhive.app/admin → labhive.app/app/admin ────
mkdirSync('docs/admin', { recursive: true })
writeFileSync('docs/admin/index.html', `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=/app/admin">
<title>LabHive — Admin</title>
</head><body>
<script>window.location.replace('/app/admin' + window.location.search + window.location.hash)</script>
</body></html>`)
console.log('✓ docs/admin/index.html (redirect → /app/admin) recreated')

// ─── Clean up old docs/assets/ (stale from builds before base change) ───────
if (existsSync('docs/assets')) {
  rmSync('docs/assets', { recursive: true, force: true })
  console.log('✓ docs/assets/ (stale) removed')
}

// ─── Copy logo to docs/ root so email template URL stays stable ──────────────
if (existsSync('docs/app/logo.svg')) {
  copyFileSync('docs/app/logo.svg', 'docs/logo.svg')
  console.log('✓ docs/logo.svg copied from docs/app/logo.svg')
}

// ─── OAuth callback page ──────────────────────────────────────────────────────
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

// ─── Root files ───────────────────────────────────────────────────────────────
writeFileSync('docs/CNAME', 'labhive.app')
console.log('✓ docs/CNAME recreated')

writeFileSync('docs/.nojekyll', '')
console.log('✓ docs/.nojekyll recreated')

// ─── Sitemap ──────────────────────────────────────────────────────────────────
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
      --teal: #1D9E75; --teal-dark: #178A66; --teal-light: #E1F5EE;
      --navy: #0C1140; --orange: #FF6B1A;
      --blue: #3b82f6; --blue-light: #F0F8FF; --blue-border: #bfdbfe;
      --text: #111827; --text2: #4B5563; --border: #e5e7eb;
      --surface: #ffffff; --bg: #f8faf9;
    }
    body { font-family: 'DM Sans', -apple-system, sans-serif; color: var(--text); background: var(--surface); line-height: 1.6; }

    /* ── Nav ── */
    nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.96); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 60px; }
    .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .nav-logo img { width: 36px; height: 36px; }
    .nav-logo span { font-size: 18px; font-weight: 700; color: var(--navy); letter-spacing: -0.3px; }
    .nav-links { display: flex; align-items: center; gap: 16px; }
    .nav-links a { font-size: 14px; color: var(--text2); text-decoration: none; font-weight: 500; }
    .nav-links a:hover { color: var(--teal); }
    .btn { display: inline-block; background: var(--teal); color: #fff !important; padding: 8px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: background 0.15s; }
    .btn:hover { background: var(--teal-dark) !important; }

    /* ── Hero with video ── */
    .hero { position: relative; overflow: hidden; color: #fff; padding: 88px 24px 96px; text-align: center; background: var(--navy); }
    .hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.55; z-index: 0; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(12,17,64,0.52) 0%, rgba(12,17,64,0.38) 100%); z-index: 1; }
    .hero-inner { position: relative; z-index: 2; max-width: 700px; margin: 0 auto; }
    .hero-badge { display: inline-block; background: rgba(29,158,117,0.22); color: #6ee7b7; border: 1px solid rgba(29,158,117,0.45); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; }
    .hero h1 { font-size: clamp(28px, 5vw, 50px); font-weight: 700; line-height: 1.14; letter-spacing: -0.5px; margin-bottom: 20px; }
    .hero h1 span { color: #6ee7b7; }
    .hero p { font-size: 17px; color: #cbd5e1; line-height: 1.7; margin-bottom: 36px; max-width: 560px; margin-left: auto; margin-right: auto; }
    .hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .btn-hero { display: inline-block; background: var(--teal); color: #fff; padding: 14px 36px; border-radius: 10px; font-size: 16px; font-weight: 700; text-decoration: none; transition: background 0.15s; }
    .btn-hero:hover { background: var(--teal-dark); }
    .btn-hero-outline { display: inline-block; background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.35); padding: 14px 28px; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; transition: border-color 0.15s; }
    .btn-hero-outline:hover { border-color: #fff; }
    .hero-demo { margin-top: 20px; font-size: 13px; color: #94a3b8; }
    .hero-demo code { background: rgba(255,255,255,0.12); padding: 2px 7px; border-radius: 4px; font-family: monospace; }

    /* ── Shared section ── */
    .section-inner { max-width: 1040px; margin: 0 auto; }
    .section-label { font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--teal); margin-bottom: 12px; }
    .section-title { font-size: clamp(22px, 4vw, 34px); font-weight: 700; color: var(--navy); letter-spacing: -0.3px; margin-bottom: 12px; }
    .section-sub { font-size: 16px; color: var(--text2); margin-bottom: 48px; }

    /* ── Features grid ── */
    .features { background: var(--bg); padding: 80px 24px; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    @media (max-width: 768px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .features-grid { grid-template-columns: 1fr; } }
    .feat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; cursor: pointer; transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s; }
    .feat-card:hover { box-shadow: 0 4px 20px rgba(29,158,117,0.15); transform: translateY(-2px); border-color: var(--teal); }
    .feat-card:hover .feat-hint { opacity: 1; }
    .feat-icon { font-size: 28px; margin-bottom: 12px; }
    .feat-card h3 { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
    .feat-card p { font-size: 14px; color: var(--text2); line-height: 1.6; }
    .feat-hint { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--teal); font-weight: 600; margin-top: 12px; opacity: 0; transition: opacity 0.15s; }

    /* ── Feature preview modal ── */
    .feat-modal-bg { display: none; position: fixed; inset: 0; background: rgba(12,17,64,0.7); z-index: 9999; align-items: center; justify-content: center; padding: 24px; }
    .feat-modal-bg.open { display: flex; }
    .feat-modal { background: #fff; border-radius: 16px; max-width: 720px; width: 100%; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.25); }
    .feat-modal-header { background: var(--navy); color: #fff; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
    .feat-modal-header h3 { font-size: 17px; font-weight: 700; }
    .feat-modal-close { background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; line-height: 1; padding: 0 4px; opacity: 0.7; }
    .feat-modal-close:hover { opacity: 1; }
    .feat-modal-body { padding: 0; }
    .feat-gif-wrap { background: #f1f5f9; min-height: 320px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; }
    .feat-gif-wrap img { max-width: 100%; max-height: 400px; object-fit: contain; border-radius: 0; display: block; }
    .feat-gif-placeholder { text-align: center; padding: 48px 32px; }
    .feat-gif-placeholder .ph-icon { font-size: 48px; margin-bottom: 12px; }
    .feat-gif-placeholder p { font-size: 14px; color: #64748b; }
    .feat-modal-desc { padding: 20px 24px; font-size: 15px; color: var(--text2); line-height: 1.7; border-top: 1px solid var(--border); }
    .feat-modal-cta { padding: 16px 24px 24px; text-align: center; }

    /* ── Plans ── */
    .plans { padding: 80px 24px; }
    .plans-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
    @media (max-width: 640px) { .plans-grid { grid-template-columns: 1fr; } }
    .plan-card { border: 1.5px solid var(--border); border-radius: 16px; padding: 32px; }
    .plan-card.team { border-color: #a7dcc9; background: var(--teal-light); }
    .plan-card.solo { border-color: var(--blue-border); background: var(--blue-light); }
    .plan-tag { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; border-radius: 6px; padding: 3px 10px; margin-bottom: 16px; }
    .plan-tag.team { color: #085041; background: rgba(29,158,117,0.15); }
    .plan-tag.solo { color: #1d4ed8; background: rgba(59,130,246,0.15); }
    .plan-card h3 { font-size: 22px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
    .plan-card .plan-desc { font-size: 14px; color: var(--text2); margin-bottom: 20px; }
    .plan-list { list-style: none; }
    .plan-list li { font-size: 14px; color: var(--text2); padding: 5px 0; display: flex; align-items: flex-start; gap: 8px; }
    .plan-list.team li::before { content: '✓'; color: var(--teal); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    .plan-list.solo li::before { content: '✓'; color: #3b82f6; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

    /* ── Pricing ── */
    .pricing { background: var(--bg); padding: 72px 24px; }
    .pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 40px; }
    @media (max-width: 640px) { .pricing-grid { grid-template-columns: 1fr; } }
    .price-card { background: var(--surface); border: 1.5px solid var(--border); border-radius: 14px; padding: 28px 28px 24px; }
    .price-card.team { border-color: #a7dcc9; }
    .price-card.solo { border-color: var(--blue-border); }
    .price-card h4 { font-size: 18px; font-weight: 700; color: var(--navy); margin-bottom: 6px; }
    .price-card p { font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 20px; }
    .price-cta { display: inline-block; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 8px; text-decoration: none; transition: background 0.15s; }
    .price-cta.team { background: var(--teal); color: #fff; }
    .price-cta.team:hover { background: var(--teal-dark); }
    .price-cta.solo { background: var(--blue); color: #fff; }
    .price-cta.solo:hover { background: #155a99; }

    /* ── CTA section ── */
    .cta-section { background: var(--navy); color: #fff; padding: 80px 24px; text-align: center; }
    .cta-section h2 { font-size: clamp(22px, 4vw, 36px); font-weight: 700; margin-bottom: 16px; }
    .cta-section p { font-size: 16px; color: #cbd5e1; margin-bottom: 36px; }

    /* ── About section ── */
    .about { padding: 72px 24px; }
    .about-inner { max-width: 720px; margin: 0 auto; }
    .about p { font-size: 15px; color: var(--text2); line-height: 1.8; margin-bottom: 16px; }

    /* ── Footer ── */
    footer { background: #0a0e2e; color: #64748b; padding: 32px 24px; text-align: center; font-size: 13px; }
    footer a { color: #64748b; text-decoration: none; }
    footer a:hover { color: #94a3b8; }
    .footer-links { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 12px; }
  </style>

  <script>
    /* Redirect deep links that predate the /app path */
    (function() {
      var s = window.location.search;
      if (s && /[?&](screen|eq|mat|support|tab)=/.test(s)) {
        window.location.replace('/app' + s + window.location.hash);
      }
    })();

    /* Feature card preview modal */
    var featData = {
      booking:     { title: 'Equipment Booking', icon: '📅', desc: 'Calendar-based equipment reservations with manager approval workflows, before/after condition photos, and automated email and calendar notifications. Drag existing bookings to reschedule them directly on the calendar.', gif: '/app/screenshots/booking.gif' },
      training:    { title: 'Training Records', icon: '🎓', desc: 'Track certifications, upload training documents, manage equipment operation approvals, and monitor expiry dates for every lab member — with a per-user hub view.', gif: '/app/screenshots/training.gif' },
      inspection:  { title: 'Supply Inspections', icon: '🔍', desc: 'Structured room and supply inspection checklists with low-stock alerts, last-count placeholders, full inspection history, and one-click export to PDF or Excel.', gif: '/app/screenshots/inspection.gif' },
      projects:    { title: 'Project & Material Tracking', icon: '🧪', desc: 'Organize research projects, track material samples with barcode and QR scanning, view storage details, and export test results and records in any format.', gif: '/app/screenshots/projects.gif' },
      maintenance: { title: 'Preventive Maintenance', icon: '🔧', desc: 'Schedule and track maintenance tasks with a built-in task board, deadline calendar, priority levels, team assignment, and out-of-lab day tracking.', gif: '/app/screenshots/maintenance.gif' },
      messaging:   { title: 'Team Messaging', icon: '💬', desc: 'Built-in staff-to-user messaging and a real-time notification bell — for booking updates, training approvals, task assignments, and direct messages.', gif: '/app/screenshots/messaging.gif' },
    };

    function openFeat(key) {
      var d = featData[key]; if (!d) return;
      document.getElementById('fm-title').textContent = d.icon + '  ' + d.title;
      document.getElementById('fm-desc').textContent = d.desc;
      var wrap = document.getElementById('fm-gif-wrap');
      wrap.innerHTML = '';
      var img = document.createElement('img');
      img.src = d.gif;
      img.alt = d.title + ' preview';
      img.onerror = function() {
        wrap.innerHTML = '<div class="feat-gif-placeholder"><div class="ph-icon">' + d.icon + '</div><p>Preview coming soon.<br>Add <code>' + d.gif + '</code> to public/screenshots/</p></div>';
      };
      wrap.appendChild(img);
      document.getElementById('feat-modal').classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeFeat() {
      document.getElementById('feat-modal').classList.remove('open');
      document.body.style.overflow = '';
    }
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeFeat(); });
  </script>
</head>
<body>

  <!-- Feature preview modal -->
  <div id="feat-modal" class="feat-modal-bg" onclick="if(event.target===this)closeFeat()">
    <div class="feat-modal">
      <div class="feat-modal-header">
        <h3 id="fm-title"></h3>
        <button class="feat-modal-close" onclick="closeFeat()">×</button>
      </div>
      <div class="feat-modal-body">
        <div class="feat-gif-wrap" id="fm-gif-wrap"></div>
        <div class="feat-modal-desc" id="fm-desc"></div>
        <div class="feat-modal-cta">
          <a href="/app" class="btn-hero" style="font-size:14px;padding:10px 28px;">Try it in LabHive →</a>
        </div>
      </div>
    </div>
  </div>

  <nav>
    <a href="/" class="nav-logo">
      <img src="/app/labhive_logo.svg" alt="LabHive">
      <span>LabHive</span>
    </a>
    <div class="nav-links">
      <a href="#about">About</a>
      <a href="#pricing">Pricing</a>
      <a href="/app?support=1">Contact</a>
      <a href="/app" class="btn">Launch App →</a>
    </div>
  </nav>

  <!-- Hero with video background -->
  <section class="hero">
    <video class="hero-video" autoplay muted loop playsinline poster="">
      <source src="/app/hero-video.mp4" type="video/mp4">
    </video>
    <div class="hero-overlay"></div>
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

  <!-- Feature cards (clickable → GIF preview) -->
  <section class="features">
    <div class="section-inner">
      <div class="section-label">Features</div>
      <div class="section-title">Everything your lab needs</div>
      <div class="section-sub">Built for the day-to-day reality of running a research or university lab. Click any card to see it in action.</div>
      <div class="features-grid">
        <div class="feat-card" onclick="openFeat('booking')">
          <div class="feat-icon">📅</div>
          <h3>Equipment Booking</h3>
          <p>Calendar-based reservations with manager approval workflows, before/after condition photos, and automated notifications.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
        <div class="feat-card" onclick="openFeat('training')">
          <div class="feat-icon">🎓</div>
          <h3>Training Records</h3>
          <p>Track certifications, upload training documents, manage equipment approvals, and monitor expiry dates for every member.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
        <div class="feat-card" onclick="openFeat('inspection')">
          <div class="feat-icon">🔍</div>
          <h3>Supply Inspections</h3>
          <p>Structured room and supply checklists with low-stock alerts, full inspection history, and PDF/Excel export.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
        <div class="feat-card" onclick="openFeat('projects')">
          <div class="feat-icon">🧪</div>
          <h3>Project &amp; Material Tracking</h3>
          <p>Organize research projects, track samples with barcode and QR scanning, and export test results in any format.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
        <div class="feat-card" onclick="openFeat('maintenance')">
          <div class="feat-icon">🔧</div>
          <h3>Preventive Maintenance</h3>
          <p>Task board with deadlines, priority levels, team assignment, and a deadline calendar with out-of-lab day tracking.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
        <div class="feat-card" onclick="openFeat('messaging')">
          <div class="feat-icon">💬</div>
          <h3>Team Messaging</h3>
          <p>Built-in staff-to-user messaging and a real-time notification system to keep your entire lab team in sync.</p>
          <div class="feat-hint">▶ See how it works</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Account type cards: Team (green) / Solo (blue) -->
  <section class="plans">
    <div class="section-inner">
      <div class="section-label">Account Types</div>
      <div class="section-title">Built for teams and individuals</div>
      <div class="plans-grid">
        <div class="plan-card team">
          <div class="plan-tag team">Team</div>
          <h3>LabHive Team</h3>
          <p class="plan-desc">Organisation-based accounts for labs with multiple members, managed by a lab administrator.</p>
          <ul class="plan-list team">
            <li>Multi-user with role-based access control</li>
            <li>Lab manager and lab user roles</li>
            <li>Equipment booking with approval workflows</li>
            <li>Training record management for the whole team</li>
            <li>Supply inspection and maintenance tracking</li>
            <li>Admin panel for full lab management</li>
          </ul>
        </div>
        <div class="plan-card solo">
          <div class="plan-tag solo">Solo</div>
          <h3>LabHive Solo</h3>
          <p class="plan-desc">Personal lab workspace for individual researchers who need to track their own projects and materials.</p>
          <ul class="plan-list solo">
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

  <!-- Pricing -->
  <section class="pricing" id="pricing">
    <div class="section-inner">
      <div class="section-label">Pricing</div>
      <div class="section-title">Simple, transparent pricing</div>
      <div class="section-sub">Contact us for a custom quote tailored to your lab size and needs.</div>
      <div class="pricing-grid">
        <div class="price-card team">
          <h4>Team Plan</h4>
          <p>For university and research labs with multiple members. Pricing is based on the number of users and active modules. Includes full admin panel, all features, and email support.</p>
          <a href="/app?support=1" class="price-cta team">Request a quote →</a>
        </div>
        <div class="price-card solo">
          <h4>Solo Plan</h4>
          <p>For individual researchers managing their own projects and materials. Free to get started — contact us for information about paid Solo features and extended storage.</p>
          <a href="/app?support=1" class="price-cta solo">Contact us →</a>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="section-inner">
      <h2>Ready to organize your lab?</h2>
      <p>Get started today — try the live demo with no sign-up required.</p>
      <a href="/app" class="btn-hero">Launch LabHive →</a>
      <div class="hero-demo" style="margin-top:16px;">Demo login — username: <code>demo</code> &nbsp; password: <code>demo</code></div>
    </div>
  </section>

  <!-- About -->
  <section class="about" id="about">
    <div class="section-inner">
      <div class="section-label">About LabHive</div>
      <div class="section-title">Built by researchers, for researchers</div>
      <div class="about-inner" style="max-width:800px;margin-top:24px;">
        <p>LabHive was designed from the ground up for the real challenges of running a university or research laboratory — from tracking who is trained on which equipment, to managing material samples with QR codes, to keeping supply rooms inspection-ready.</p>
        <p>The platform supports both team-based labs (with role-based access for lab managers and students) and individual researchers working independently through LabHive Solo. All data is securely stored in the cloud with full row-level security.</p>
        <p style="margin-bottom:0;">Have questions or want to request a feature? <a href="/app?support=1" style="color:var(--teal);font-weight:600;">Contact us</a> — we typically reply within one business day.</p>
      </div>
    </div>
  </section>

  <footer>
    <div class="footer-links">
      <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
      <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
      <a href="/app?support=1">Contact</a>
      <a href="#about">About</a>
      <a href="/app">Launch App</a>
    </div>
    <p>© 2026 LabHive. All rights reserved.</p>
  </footer>

</body>
</html>`)
console.log('✓ docs/index.html (landing page) written')

// ─── Privacy policy ───────────────────────────────────────────────────────────
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
    .back-btn { display: inline-block; margin-bottom: 32px; padding: 8px 18px; background: #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #0C1140; text-decoration: none; border: 1px solid #e2e8f0; }
    .back-btn:hover { background: #e2e8f0; }
  </style>
</head>
<body>
  <a href="/" class="back-btn">← Back to LabHive</a>
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
  <p style="margin-top:48px;font-size:13px;color:#aaa;">© 2026 LabHive. <a href="/" style="color:#aaa;">Back to home</a></p>
</body>
</html>`)
console.log('✓ docs/privacy/index.html recreated')

// ─── Terms of service ──────────────────────────────────────────────────────────
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
    .back-btn { display: inline-block; margin-bottom: 32px; padding: 8px 18px; background: #f1f5f9; border-radius: 8px; font-size: 14px; font-weight: 600; color: #0C1140; text-decoration: none; border: 1px solid #e2e8f0; }
    .back-btn:hover { background: #e2e8f0; }
  </style>
</head>
<body>
  <a href="/" class="back-btn">← Back to LabHive</a>
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

  <h2>5. Content You Upload</h5>
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
  <p style="margin-top:48px;font-size:13px;color:#aaa;">© 2026 LabHive. <a href="/" style="color:#aaa;">Back to home</a></p>
</body>
</html>`)
console.log('✓ docs/terms/index.html recreated')
