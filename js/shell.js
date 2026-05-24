/* ============================================================
   PLAYHOUSE SOCIAL — Sidebar + Header HTML template
   ============================================================ */

function buildShell(activePage = '') {
  const nav = [
    { id: 'profile',      icon: '👤', label: 'My Profile',          href: 'profile.html' },
    { id: 'schedule',     icon: '📅', label: 'Schedule',             href: 'schedule.html' },
    { id: 'scores',       icon: '🏆', label: 'Score & Leaderboard',  href: 'scores.html' },
    { id: 'library',      icon: '📚', label: 'Browse Library',       href: 'library.html' },
    { id: 'aides',        icon: '🎮', label: 'Player Aides',         href: 'aides.html' },
    { id: 'announcements',icon: '📣', label: 'Announcements',        href: 'announcements.html' },
    { id: 'faqs',         icon: '❓', label: 'FAQs',                 href: 'faqs.html' },
    { id: 'guidelines',   icon: 'ℹ️', label: 'Community Guidelines', href: 'guidelines.html' },
  ];

  const navHTML = nav.map(item => `
    <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-page="${item.id}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
    <!-- Mobile dim overlay -->
    <div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>

    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <img src="../assets/logo.png" alt="Playhouse Social">
      </div>
      <nav class="sidebar-nav">
        ${navHTML}
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-header">

        <!-- Hamburger (mobile only) -->
        <button class="hamburger" id="hamburger" onclick="toggleSidebar()" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Logo centred on mobile -->
        <div class="mobile-logo">
          <img src="../assets/logo.png" alt="Playhouse Social">
        </div>

        <!-- Right side: avatar + logout -->
        <div style="display:flex;align-items:center;gap:var(--sp-3)">
          <div class="header-user">
            <div class="avatar" id="header-avatar">SV</div>
            <span id="header-name" style="font-size:14px;font-weight:500"></span>
          </div>
          <button class="btn-logout" onclick="handleLogout()">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span class="logout-label">Logout</span>
          </button>
        </div>
      </header>
      <div id="page-content">
  `;
}

function closeShell() {
  return `</div></div>`;
}
