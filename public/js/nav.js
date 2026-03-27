(function () {
  const links = [
    { href: '/',              label: '首頁' },
    { href: '/services.html', label: '服務方案' },
    { href: '/trends.html',   label: '趨勢分析' },
    { href: '/process.html',  label: '接單流程' },
    { href: '/contact.html',  label: '立即諮詢', cta: true },
  ];

  const path = window.location.pathname.replace(/\/$/, '') || '/';

  function isActive(href) {
    if (href === '/') return path === '/' || path === '/index.html';
    return path === href || path.endsWith(href);
  }

  const desktopLinks = links.map(l => {
    const active = isActive(l.href);
    if (l.cta) {
      return `<a href="${l.href}" class="adlo-nav-cta">${l.label}</a>`;
    }
    return `<a href="${l.href}" class="adlo-nav-link${active ? ' adlo-nav-active' : ''}">${l.label}</a>`;
  }).join('');

  const mobileLinks = links.map(l => {
    const active = isActive(l.href);
    return `<a href="${l.href}" class="adlo-drawer-link${active ? ' adlo-drawer-active' : ''}">${l.label}</a>`;
  }).join('');

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Manrope:wght@500;600;700&display=swap');
    #adlo-nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 64px;
      background: rgba(248,250,252,0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(203,213,225,0.6);
      box-shadow: 0 1px 3px rgba(51,65,85,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      z-index: 9999;
      font-family: 'Manrope', sans-serif;
    }
    #adlo-nav .adlo-logo {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -1px;
      color: #1e293b;
      text-decoration: none;
      font-family: 'Playfair Display', serif;
    }
    #adlo-nav .adlo-desktop-links {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .adlo-nav-link {
      color: #64748b;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    .adlo-nav-link:hover { color: #1e293b; background: rgba(51,65,85,0.06); }
    .adlo-nav-active { color: #1e293b !important; font-weight: 700; }
    .adlo-nav-cta {
      color: #fff;
      background: #92400e;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 6px;
      margin-left: 8px;
      transition: opacity 0.15s;
      box-shadow: 0 4px 12px rgba(146,64,14,0.25);
    }
    .adlo-nav-cta:hover { opacity: 0.88; }
    #adlo-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 8px;
      background: none;
      border: none;
    }
    #adlo-hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: #334155;
      border-radius: 2px;
      transition: transform 0.25s, opacity 0.25s;
    }
    #adlo-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    #adlo-hamburger.open span:nth-child(2) { opacity: 0; }
    #adlo-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    #adlo-drawer {
      position: fixed;
      top: 64px; left: 0; right: 0;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 12px 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      transform: translateY(-110%);
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
      z-index: 9998;
      box-shadow: 0 8px 24px rgba(51,65,85,0.1);
    }
    #adlo-drawer.open { transform: translateY(0); }
    .adlo-drawer-link {
      color: #475569;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      padding: 13px 16px;
      border-radius: 8px;
      transition: color 0.15s, background 0.15s;
      font-family: 'Manrope', sans-serif;
    }
    .adlo-drawer-link:hover { color: #1e293b; background: rgba(51,65,85,0.06); }
    .adlo-drawer-active { color: #92400e !important; font-weight: 700; }
    @media (max-width: 768px) {
      .adlo-desktop-links { display: none !important; }
      #adlo-hamburger { display: flex !important; }
    }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.id = 'adlo-nav';
  nav.innerHTML = `
    <a href="/" class="adlo-logo">adlo</a>
    <div class="adlo-desktop-links">${desktopLinks}</div>
    <button id="adlo-hamburger" aria-label="選單">
      <span></span><span></span><span></span>
    </button>
  `;
  document.body.insertBefore(nav, document.body.firstChild);

  const drawer = document.createElement('div');
  drawer.id = 'adlo-drawer';
  drawer.innerHTML = mobileLinks;
  document.body.insertBefore(drawer, nav.nextSibling);

  document.body.style.paddingTop = '64px';

  const btn = document.getElementById('adlo-hamburger');
  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.classList.toggle('open', open);
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();
