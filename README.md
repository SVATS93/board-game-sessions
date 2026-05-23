# Playhouse Social — Website

**"Kidulting made fun."**

Community platform for managing board game sessions, scores, and the game library.

---

## Project structure

```
playhouse-social/
├── index.html              ← Player login / signup
├── css/
│   └── design-system.css   ← All tokens, components, utilities
├── js/
│   ├── app.js              ← Shared utilities, mock data hooks
│   └── shell.js            ← Sidebar + header HTML template
├── assets/
│   └── logo.png            ← Place the Playhouse Social logo here
├── pages/                  ← All player-facing screens
│   ├── profile.html
│   ├── schedule.html
│   ├── scores.html
│   ├── library.html
│   ├── announcements.html
│   ├── faqs.html
│   └── guidelines.html
└── admin/                  ← Admin portal (placeholder)
    ├── index.html          ← Admin login
    └── god-mode.html       ← God Mode dashboard
```

---

## Design system

| Token | Value |
|-------|-------|
| Primary bg | `#0a0a0c` (near black) |
| Surface | `#13131a` |
| Amber (PLAYHOUSE) | `#F5A623` |
| Cyan (accent) | `#00D1DC` |
| Electric blue (Social script) | `#5B9CF6` |
| Neon green | `#39FF9C` |
| Pink | `#FF6BBA` |
| Display font | Bebas Neue |
| Script font | Caveat |
| Body font | DM Sans |

---

## Setup locally

```bash
# 1. Open VS Code, then open this folder
# 2. Install the Live Server extension
# 3. Right-click index.html → Open with Live Server
# 4. Site runs at http://127.0.0.1:5500
```

---

## Add your logo

Place the Playhouse Social logo PNG at:
```
assets/logo.png
```

It will appear in the sidebar. The current fallback uses the text wordmark.

---

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Initial Playhouse Social frontend"
git push origin main
# Then: GitHub repo → Settings → Pages → Source: main branch
```

Live at: `https://shreyanshvats.github.io/board-game-sessions` (or your repo name)

Admin portal: same URL + `/admin/`

---

## Phase 2 — Firebase integration

All `// Phase 2: Firebase` comments mark the exact spots to wire in:
- `index.html` → `signInWithEmailAndPassword`, `createUserWithEmailAndPassword`, `signInWithPopup`
- `pages/profile.html` → Firestore `users` collection
- `pages/schedule.html` → Firestore `sessions` + `bookings` collections
- `pages/scores.html` → Firestore `scores` + computed PHS score
- `pages/library.html` → Firestore `games` collection
- `pages/announcements.html` → Firestore `announcements` collection
- `pages/faqs.html` → Firestore `faqs` collection
- `pages/guidelines.html` → Firestore `guidelines` collection

---

## Player screens checklist

- [x] Login / Signup (email + Google)
- [x] My Profile
- [x] Schedule → My Games
- [x] Schedule → Upcoming Games
- [x] Game booking detail (My Games)
- [x] Game booking detail + Reserve (Upcoming Games)
- [x] Waitlist flow
- [x] Score & Leaderboard → My Scorecards
- [x] Score & Leaderboard → Leaderboard (with PHS formula)
- [x] Game Library
- [x] Announcements
- [x] FAQs (accordion)
- [x] Community Guidelines (with social links)
- [x] Admin login (placeholder)
- [x] God Mode dashboard (placeholder tiles)
