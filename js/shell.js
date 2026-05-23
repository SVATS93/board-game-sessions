/* ============================================================
   PLAYHOUSE SOCIAL — Sidebar + Header HTML template
   Usage: document.getElementById('sidebar-mount').innerHTML = buildShell(activePage)
   ============================================================ */

function buildShell(activePage = '') {
  const nav = [
    { id: 'profile',     icon: '👤', label: 'My Profile',          href: 'profile.html' },
    { id: 'schedule',    icon: '📅', label: 'Schedule',             href: 'schedule.html' },
    { id: 'scores',      icon: '🏆', label: 'Score & Leaderboard',  href: 'scores.html' },
    { id: 'library',     icon: '📚', label: 'Browse Library',       href: 'library.html' },
    { id: 'announcements',icon:'📣', label: 'Announcements',        href: 'announcements.html' },
    { id: 'faqs',        icon: '❓', label: 'FAQs',                 href: 'faqs.html' },
    { id: 'guidelines',  icon: 'ℹ️', label: 'Community Guidelines', href: 'guidelines.html' },
  ];

  const navHTML = nav.map(item => `
    <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-page="${item.id}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <img src="../assets/logo.png" alt="Playhouse Social" onerror="this.style.display='none'">
        <div class="logo-text">PLAY<br>HOUSE <span>Social</span></div>
      </div>
      <nav class="sidebar-nav">
        ${navHTML}
      </nav>
    </aside>

    <div class="main-content">
      <header class="top-header">
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
          Logout
        </button>
      </header>
      <div id="page-content">
  `;
}

function closeShell() {
  return `</div></div>`; // closes #page-content and .main-content
}
