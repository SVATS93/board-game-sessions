/* ============================================================
   PLAYHOUSE SOCIAL — Shared JS Utilities
   Handles: sidebar nav, active states, modal helpers, mock data
   (Firebase will replace mock data in Phase 2)
   ============================================================ */

// ---- Mock current user (Phase 2: replace with Firebase Auth) ----
const PHS = {
  currentUser: {
    uid: 'user_shreyansh',
    displayName: 'Shreyansh Vats',
    initials: 'SV',
    email: 'shreyansh@example.com',
    phone: '+91 98765 43210',
    gamerSince: 'Apr 2026'
  }
};

// ---- Sidebar navigation ----
function initSidebar() {
  // Populate user in header
  const avatarEl = document.getElementById('header-avatar');
  const nameEl   = document.getElementById('header-name');
  if (avatarEl) avatarEl.textContent = PHS.currentUser.initials;
  if (nameEl)   nameEl.textContent   = PHS.currentUser.displayName;
}

// ---- Mobile sidebar toggle ----
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('mobile-open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('mobile-open');
    overlay && overlay.classList.add('visible');
    hamburger && hamburger.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scroll behind overlay
  }
}

function closeSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebar-overlay');
  const hamburger = document.getElementById('hamburger');
  sidebar && sidebar.classList.remove('mobile-open');
  overlay && overlay.classList.remove('visible');
  hamburger && hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

// Close sidebar on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

// ---- Logout ----
function handleLogout() {
  // Phase 2: Firebase signOut()
  window.location.href = '../index.html';
}

// ---- Modal helpers ----
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ---- Tab helper ----
function initTabs(tabGroupId) {
  const group = document.getElementById(tabGroupId);
  if (!group) return;
  const btns = group.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      const panels = group.closest('.tab-container')?.querySelectorAll('.tab-panel');
      panels?.forEach(p => {
        p.classList.toggle('hidden', p.id !== target);
      });
    });
  });
}

// ---- Capacity bar renderer ----
function renderCapacityBar(el, filled, total) {
  if (!el) return;
  const pct = Math.round((filled / total) * 100);
  const isFull = filled >= total;
  el.innerHTML = `
    <div class="capacity-bar-wrap">
      <div class="capacity-bar-track">
        <div class="capacity-bar-fill ${isFull ? 'full' : 'has-space'}"
             style="width:${pct}%"></div>
      </div>
      <span class="capacity-label">(${filled}/${total})</span>
    </div>
    ${isFull ? '<div style="margin-top:4px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--status-red)">Full — waitlist open</div>' : ''}
  `;
}

// ---- PHS Score formula ----
// PHS = (40√HR + 30√GR + 30√SR) × (1 + log(1 + D/30))
function calcPHSScore({ hoursTotal, uniqueGames, uniqueGamers, daysSinceJoined }) {
  const D   = daysSinceJoined;
  const HR  = hoursTotal   / (D / 7);
  const GR  = uniqueGames  / (D / 7);
  const SR  = uniqueGamers / (D / 7);
  const raw = (40 * Math.sqrt(HR) + 30 * Math.sqrt(GR) + 30 * Math.sqrt(SR))
              * (1 + Math.log10(1 + D / 30));
  return Math.round(raw);
}

// ---- DOMContentLoaded bootstrap ----
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
});
