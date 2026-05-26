# Playhouse Social — Claude Code Context

## Project overview

**Playhouse Social** is a community platform for managing board game sessions in Bengaluru, India. Tagline: *"Kidulting made fun."*

Built by Shreyansh Vats (co-founder, Hiveblue Labs). This is a side project — a website for his tabletop gaming community.

The site is **live on GitHub Pages** at:
`https://svats93.github.io/board-game-sessions`

GitHub repo: `https://github.com/SVATS93/board-game-sessions`

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | Plain HTML + CSS + JS | No framework, no build step |
| Hosting | GitHub Pages | Free, static |
| Backend (Phase 2) | Supabase | PostgreSQL, Auth, Realtime |
| BGG data (Phase 2) | Cached in Supabase | Fetched via BGG XML API, stored on add |

**No npm, no bundler, no React.** Everything runs directly in the browser. Live Server extension in VS Code is used for local development.

---

## Project structure

```
playhouse-social/
├── index.html                  ← Player login / signup (entry point)
├── .gitignore                  ← Ignores .DS_Store
├── assets/
│   └── logo.png                ← Transparent bg logo (user supplied)
├── css/
│   └── design-system.css       ← ALL tokens, components, utilities, responsive
├── js/
│   ├── app.js                  ← Shared utilities, mock auth, sidebar toggle
│   └── shell.js                ← Sidebar + header HTML template (buildShell/closeShell)
├── pages/                      ← All player-facing screens
│   ├── profile.html
│   ├── schedule.html
│   ├── scores.html
│   ├── library.html
│   ├── aides.html
│   ├── announcements.html
│   ├── faqs.html
│   └── guidelines.html
└── admin/                      ← Admin portal
    ├── index.html              ← Admin login
    └── god-mode.html           ← God Mode dashboard (8 tile placeholders)
```

---

## Design system

Derived from the neon logo (dark background, amber + cyan + electric blue).

### Colour tokens (in `css/design-system.css`)
```css
--black:        #0a0a0c      /* page background */
--surface:      #13131a      /* sidebar, header */
--surface-2:    #1c1c27      /* cards */
--surface-3:    #252535      /* inputs, inner elements */
--amber:        #F5A623      /* PLAYHOUSE — primary brand */
--cyan:         #00D1DC      /* accent, buttons, active states */
--blue:         #5B9CF6      /* electric blue */
--pink:         #FF6BBA      /* neon pink */
--green-neon:   #39FF9C      /* neon green */
```

### Typography
- **Display:** Bebas Neue (headings, page titles, stat numbers)
- **Script:** Caveat (the "Social" wordmark feel)
- **Body:** DM Sans (all body text, labels, UI)

### Key CSS patterns
- `.card` / `.card-glow` — surface cards
- `.btn`, `.btn-primary`, `.btn-amber`, `.btn-ghost` — buttons
- `.form-input`, `.form-label`, `.form-group` — form elements
- `.data-table` — styled tables
- `.badge`, `.badge-green`, `.badge-yellow`, `.badge-red` — status pills
- `.modal-overlay` + `.modal` — popup modals (toggle with `.open` class)
- `.tab-btn` + `.tabs` — tab navigation
- `.player-pill.knows-game` / `.needs-teaching` — green/amber player name tags

### Shell pattern
Every player page uses this pattern:
```javascript
// At bottom of each page
document.getElementById('shell').innerHTML = buildShell('page-id') + `
  <div class="page-body">
    <!-- page content here -->
  </div>
  <!-- any modals here -->
` + closeShell();
```
`buildShell(activePage)` renders the sidebar + top header. `closeShell()` closes the wrapper divs.

---

## Navigation (sidebar)

Current nav items in `js/shell.js`:
```
👤 My Profile        → profile.html
📅 Schedule          → schedule.html
🏆 Score & Leaderboard → scores.html
📚 Browse Library    → library.html
🎮 Player Aides      → aides.html
📣 Announcements     → announcements.html
❓ FAQs              → faqs.html
ℹ️ Community Guidelines → guidelines.html
```

Mobile nav: hamburger button (top-left) slides sidebar in. Dim overlay closes it. Logo shown centred in mobile header.

---

## Pages — what's built

### `index.html` — Player login
- Toggle between Sign in / Create account
- Google login button (Phase 2: Firebase → Supabase)
- Email + password forms
- Forgot password link
- **"Admin? Sign in here →"** subtle link at bottom → `admin/index.html`

### `pages/profile.html` — My Profile
- Large avatar with initials
- Editable: First name, Last name, Mobile, Email
- Update button with save confirmation toast

### `pages/schedule.html` — Schedule
Two tabs:
1. **My Games** — table of booked sessions, status badge (Paid Confirmed / Paid Waitlisted(X) / Cancelled), chevron opens booking detail modal
2. **Upcoming Games** — table with capacity progress bar, chevron opens game detail + Reserve/Join Waitlist flow

Booking detail modal shows:
- Game name, date, location
- Player pills (green = knows game, amber = needs teaching)
- BGG stats (rank, weight, age)
- Hype text
- My Status badge (My Games) or capacity bar + Reserve button (Upcoming)

Reserve modal: asks if teach/walkthrough needed before confirming.

### `pages/scores.html` — Score & Leaderboard
Two tabs:
1. **My Scorecards** — table of past games with scores and winner (👑)
2. **Leaderboard** — 4 clickable stat cards + ranked table

**Clickable stat cards** (each opens a popup modal):
- **Total hours played** → bar chart breakdown by game + sessions
- **Unique games played** → pill grid of all games played
- **Unique gamers met** → list with avatars and sessions together
- **Gamer since** → badge collection (earned + locked)

PHS Score formula displayed at bottom:
`PHS = (40·√HR + 30·√GR + 30·√SR) × (1 + log(1 + D/30))`

### `pages/library.html` — Game Library
Full table with: Game Name, Publisher, Year, Brief Description, BGG Overall Rank, BGG Category + Category Rank, Player Count, Time (mins), Age, Weight (pip visualisation), Status.

Status values: **Available** / **In use** ← *needs updating to Available / Wishlisted / Ordered*

### `pages/aides.html` — Player Aides
Three interactive tools:
1. **First Player Selector** — add players, spin with flicker animation, reveals first player
2. **Dice Roller** — d4/d6/d8/d10/d12/d20, 1–10 dice, animated roll, shows total
3. **Score Tracker** — game presets (Jaipur, Ark Nova, Scythe, Catan, Wyrmspan, Azul) or custom, add up to 6 players, rounds, live totals, winner declaration banner

### `pages/announcements.html` — Announcements
Card list, pinned post support (amber left border), date, title, body.

### `pages/faqs.html` — FAQs
Accordion — click to expand/collapse, one open at a time.

### `pages/guidelines.html` — Community Guidelines
5 guideline sections as cards. WhatsApp + Instagram social buttons (links to be updated).

### `admin/index.html` — Admin Login
Separate dark page with amber branding. Login ID + Password. "Back to player login" link.

### `admin/god-mode.html` — God Mode Dashboard
3×3 tile grid. All 8 tiles are placeholders linking to `comingSoon()`.

---

## Admin screens — TO BE BUILT

This is the next phase of work. All 8 God Mode tiles need their own screens under `admin/`.

### Confirmed spec for each:

**1. `admin/manage-profiles.html` — Manage Profiles**
- For admin-side users only: volunteers, game masters (NOT player profiles)
- Add, edit, deactivate admin users
- Permission levels TBD (kept simple for now — all admins get full access)

**2. `admin/schedule-updates.html` — Schedule Updates**
- Create new game sessions: game name, date, time, location, max players
- View and edit existing upcoming sessions
- Delete/cancel sessions

**3. `admin/check-bookings.html` — Check Bookings**
- View all bookings per session
- See confirmed / waitlisted / cancelled players
- Manually add players (walk-ins) or remove (cancellations)
- Waitlist promotion management

**4. `admin/manage-scores.html` — Manage Score & Leaderboard**
- All completed sessions listed
- Admin selects a session → enters/edits scores per player
- Includes session start time + end time (to calculate play duration for PHS hours)
- Player management within a session:
  - See all registered players
  - Add existing PHS player (search by username, dropdown)
  - Add new player (username + email mandatory, mobile optional)

**5. `admin/library-updation.html` — Library Updation**
Full game form with these exact fields:
- Game Name
- Publisher
- Publish Year
- Short Description
- BGG Ranking → Overall Rank, Category, Category Rank
- Player Count
- Time (in minutes)
- Age
- Weight (out of 5)
- Status: **Available** / **Wishlisted** / **Ordered**

*Note: frontend `library.html` status values also need updating from Available/In use → Available/Wishlisted/Ordered*

**6. `admin/announcements-push.html` — Announcements Push**
- Write new announcement (title, body, date, pin toggle)
- List existing announcements with edit/delete/pin controls

**7. `admin/faqs-updation.html` — FAQs Updation**
- Add new FAQ (question + answer)
- Edit existing FAQs inline
- Reorder (drag or up/down arrows)
- Delete

**8. `admin/community-guidelines.html` — Community Guidelines Updation**
- Edit guideline sections (title + bullet points)
- Add new sections
- Delete sections

---

## Mock data pattern (Phase 2: replace with Supabase)

All data is currently hardcoded as JS arrays/objects at the top of each page. Comments mark every spot to wire up Supabase:

```javascript
// Phase 2: Supabase query
const { data } = await supabase.from('sessions').select('*')
```

Key Supabase tables to design (Phase 2):
- `users` — player profiles
- `admin_users` — volunteers, game masters
- `sessions` — game sessions (schedule)
- `bookings` — player ↔ session (confirmed/waitlisted/cancelled)
- `scores` — per-player per-session scores + play time
- `games` — game library with BGG stats
- `announcements`
- `faqs`
- `guidelines`

BGG data will be fetched via BGG XML API (`boardgamegeek.com/xmlapi2`) when admin adds a game, cached in Supabase `games` table, refreshed weekly.

---

## PHS Score formula

```
PHS Score = (40·√HR + 30·√GR + 30·√SR) × (1 + log(1 + D/30))

Where (all normalised per week):
  HR = Hours Rate      = Total hours played / (Days since joined / 7)
  GR = Game Diversity  = Unique games played / (Days since joined / 7)
  SR = Social Rate     = Unique gamers met / (Days since joined / 7)
  D  = Days since joining Playhouse Social

Weights: Hours 40%, Game diversity 30%, Social 30%
Consistency multiplier: (1 + log(1 + D/30)) — rewards tenure without punishing newcomers
```

---

## Known issues / pending updates

- [ ] `pages/library.html` — status values need updating: Available / In use → **Available / Wishlisted / Ordered**
- [ ] `pages/guidelines.html` — WhatsApp and Instagram links need real URLs
- [ ] All `// Phase 2: Supabase` comments throughout codebase mark backend integration points
- [ ] Admin screens (8 tiles) — not yet built
- [ ] God Mode tiles — currently all show `comingSoon()` alert

---

## Coding conventions

- **No frameworks** — vanilla HTML/CSS/JS only
- **No external JS libraries** — no jQuery, no lodash
- **CSS variables** for all colours, spacing, typography — never hardcode hex values
- **`buildShell(pageId)`** must be called on every player page for consistent nav
- **Admin pages** do NOT use `buildShell()` — they have their own simpler header
- **Mock data** at top of each file, clearly marked for Phase 2 replacement
- **`// Phase 2: Supabase`** comment convention for all backend integration points
- Responsive breakpoint: `768px` (mobile gets hamburger nav)
- Font imports via Google Fonts in `design-system.css` — no local font files

---

## How to run locally

```bash
# Open the playhouse-social folder in VS Code
# Install Live Server extension (Ritwick Dey)
# Right-click index.html → Open with Live Server
# Site runs at http://127.0.0.1:5500
```

## How to deploy

```bash
git add .
git commit -m "describe your changes"
git push origin main
# GitHub Pages auto-deploys from main branch within 2 minutes
```
