-- ============================================================
-- PLAYHOUSE SOCIAL — SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- ──────────────────────────────────────────────
-- 1. PROFILES (extends auth.users)
-- ──────────────────────────────────────────────
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique,
  first_name    text,
  last_name     text,
  mobile        text,
  avatar_url    text,
  joined_at     timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, first_name, last_name, username)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    lower(regexp_replace(
      coalesce(new.raw_user_meta_data->>'first_name', split_part(new.email, '@', 1)),
      '[^a-z0-9]', '', 'g'
    ))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ──────────────────────────────────────────────
-- 2. ADMIN USERS
-- ──────────────────────────────────────────────
create table public.admin_users (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null check (role in ('super_admin', 'game_master', 'volunteer')),
  created_by  uuid references auth.users(id),
  created_at  timestamptz not null default now(),
  unique(user_id)
);

-- Helper function — used in RLS policies
create or replace function public.is_admin(uid uuid)
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.admin_users where user_id = uid);
$$;


-- ──────────────────────────────────────────────
-- 3. GAMES (library)
-- ──────────────────────────────────────────────
create table public.games (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  publisher         text,
  year              int,
  description       text,
  bgg_id            int,
  bgg_rank          int,
  bgg_category      text,
  bgg_category_rank int,
  player_count_min  int,
  player_count_max  int,
  time_min          int,
  time_max          int,
  min_age           int,
  weight            numeric(3,2),
  status            text not null default 'available' check (status in ('available', 'wishlisted', 'ordered')),
  image_url         text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Seed the 5 games from the mock data
insert into public.games (name, publisher, year, description, bgg_rank, bgg_category, bgg_category_rank, player_count_min, player_count_max, time_min, time_max, min_age, weight, status) values
  ('Scythe',   'Stonemaier Games', 2016, 'Five factions vie for dominance in war-torn dieselpunk 1920s Europe.', 26,  'Strategy',    27, 1, 5, 90,  120, 14, 3.45, 'available'),
  ('Ark Nova', 'Capstone Games',   2021, 'Fund conservation projects, manage animals and build the best zoo.',  2,   'Strategy',    2,  1, 4, 120, 180, 14, 3.80, 'available'),
  ('Jaipur',   'Asmodee',          2009, 'Fast-paced trading card duel set in a vibrant Indian spice market.',  194, 'Card Game',   12, 2, 2, 25,  30,  10, 1.49, 'available'),
  ('Wyrmspan', 'Stonemaier Games', 2024, 'Build a cave sanctuary for dragons in this engine-building game.',   123, 'Engine Build', 14, 1, 5, 70,  110, 14, 2.83, 'available'),
  ('Catan',    'Catan Studio',     1995, 'Classic resource trading and settlement building on a modular island.', 312, 'Family',    8,  3, 4, 75,  120, 10, 2.33, 'wishlisted');


-- ──────────────────────────────────────────────
-- 4. SESSIONS (scheduled game events)
-- ──────────────────────────────────────────────
create table public.sessions (
  id          uuid primary key default gen_random_uuid(),
  game_id     uuid not null references public.games(id) on delete cascade,
  date        timestamptz not null,
  location    text not null,
  max_players int not null default 8,
  status      text not null default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  notes       text,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz not null default now()
);


-- ──────────────────────────────────────────────
-- 5. BOOKINGS
-- ──────────────────────────────────────────────
create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  session_id       uuid not null references public.sessions(id) on delete cascade,
  player_id        uuid not null references auth.users(id) on delete cascade,
  status           text not null default 'confirmed' check (status in ('confirmed', 'waitlisted', 'cancelled')),
  needs_teaching   boolean not null default false,
  waitlist_position int,
  created_at       timestamptz not null default now(),
  unique(session_id, player_id)
);

-- View: confirmed count per session (useful for checking capacity)
create or replace view public.session_capacity as
  select
    s.id as session_id,
    s.max_players,
    count(b.id) filter (where b.status = 'confirmed')  as confirmed_count,
    count(b.id) filter (where b.status = 'waitlisted') as waitlisted_count
  from public.sessions s
  left join public.bookings b on b.session_id = s.id
  group by s.id, s.max_players;


-- ──────────────────────────────────────────────
-- 6. SCORES
-- ──────────────────────────────────────────────
create table public.scores (
  id                     uuid primary key default gen_random_uuid(),
  session_id             uuid not null references public.sessions(id) on delete cascade,
  player_id              uuid not null references auth.users(id) on delete cascade,
  score                  int,
  is_winner              boolean not null default false,
  play_duration_minutes  int,
  notes                  text,
  created_at             timestamptz not null default now(),
  unique(session_id, player_id)
);

-- View: PHS leaderboard
create or replace view public.phs_leaderboard as
  with stats as (
    select
      p.id,
      p.first_name,
      p.last_name,
      p.username,
      p.joined_at,
      extract(epoch from (now() - p.joined_at)) / 604800 as weeks_active,  -- weeks since joined
      coalesce(sum(sc.play_duration_minutes), 0) / 60.0 as total_hours,
      count(distinct s.game_id) as unique_games,
      count(distinct b2.player_id) as unique_gamers
    from public.profiles p
    left join public.scores sc on sc.player_id = p.id
    left join public.sessions s on s.id = sc.session_id
    left join public.bookings b1 on b1.player_id = p.id and b1.status = 'confirmed'
    left join public.bookings b2 on b2.session_id = b1.session_id and b2.player_id != p.id and b2.status = 'confirmed'
    group by p.id, p.first_name, p.last_name, p.username, p.joined_at
  )
  select
    id,
    first_name,
    last_name,
    username,
    joined_at,
    round(total_hours::numeric, 1) as total_hours,
    unique_games,
    unique_gamers,
    round(
      (
        40 * sqrt(greatest(total_hours   / greatest(weeks_active, 1), 0)) +
        30 * sqrt(greatest(unique_games  / greatest(weeks_active, 1), 0)) +
        30 * sqrt(greatest(unique_gamers / greatest(weeks_active, 1), 0))
      ) * (1 + ln(1 + extract(day from (now() - joined_at)) / 30.0))
    )::int as phs_score,
    rank() over (order by
      (
        40 * sqrt(greatest(total_hours   / greatest(weeks_active, 1), 0)) +
        30 * sqrt(greatest(unique_games  / greatest(weeks_active, 1), 0)) +
        30 * sqrt(greatest(unique_gamers / greatest(weeks_active, 1), 0))
      ) * (1 + ln(1 + extract(day from (now() - joined_at)) / 30.0))
    desc) as rank
  from stats;


-- ──────────────────────────────────────────────
-- 7. POLLS & VOTES
-- ──────────────────────────────────────────────
create table public.polls (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('game', 'location', 'schedule')),
  title       text not null,
  description text,
  is_active   boolean not null default true,
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz not null default now()
);

create table public.poll_options (
  id        uuid primary key default gen_random_uuid(),
  poll_id   uuid not null references public.polls(id) on delete cascade,
  label     text not null,
  image_url text,
  sort_order int not null default 0
);

create table public.poll_votes (
  id         uuid primary key default gen_random_uuid(),
  poll_id    uuid not null references public.polls(id) on delete cascade,
  player_id  uuid not null references auth.users(id) on delete cascade,
  option_ids uuid[] not null,   -- supports multi-select
  voted_at   timestamptz not null default now(),
  unique(poll_id, player_id)    -- one vote per player per poll
);

-- View: vote counts per option
create or replace view public.poll_results as
  select
    po.poll_id,
    po.id as option_id,
    po.label,
    count(pv.id) filter (where po.id = any(pv.option_ids)) as vote_count
  from public.poll_options po
  left join public.poll_votes pv on pv.poll_id = po.poll_id
  group by po.poll_id, po.id, po.label;


-- ──────────────────────────────────────────────
-- 8. ANNOUNCEMENTS
-- ──────────────────────────────────────────────
create table public.announcements (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  is_pinned   boolean not null default false,
  created_by  uuid not null references auth.users(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

insert into public.announcements (title, body, is_pinned, created_by)
select 'Welcome to Playhouse Social!',
       'We''re thrilled to launch our community platform. Here you can check your game schedule, track scores, browse our game library, and stay updated with all things Playhouse Social. Kidulting made fun!',
       true,
       id
from auth.users limit 1;


-- ──────────────────────────────────────────────
-- 9. FAQs
-- ──────────────────────────────────────────────
create table public.faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.faqs (question, answer, sort_order) values
  ('How do I reserve a spot for a game session?', 'Go to Schedule → Upcoming Games. Click the chevron on any game row to expand the details, then click Reserve. Select whether you need a teaching session and confirm. You''ll appear in the players list once payment is confirmed.', 1),
  ('What does "Needs teaching" mean on the player tiles?', 'When you reserve a game, you can indicate whether you already know the rules or need a walkthrough. Green tiles = players who know the game. Amber tiles = players who need a teaching session.', 2),
  ('How is the PHS score calculated?', 'PHS Score = (40·√HR + 30·√GR + 30·√SR) × (1 + log(1 + D/30)), where HR = hours played per week, GR = unique games per week, SR = unique gamers met per week, D = days since joining.', 3),
  ('What happens if a session is full?', 'You can join the waitlist. Your position is shown in My Games. If a spot opens up you''ll be notified and bumped up automatically.', 4),
  ('How do I update my profile?', 'Click "My Profile" in the sidebar. Update your name, mobile, and hit the Update button.', 5),
  ('What games are available?', 'Browse the full collection in Game Library — BGG stats, player count, time, weight, and availability status are all shown.', 6),
  ('Can I cancel a booking?', 'Please reach out through WhatsApp or Instagram (links in Community Guidelines) to request a cancellation.', 7);


-- ──────────────────────────────────────────────
-- 10. COMMUNITY GUIDELINES
-- ──────────────────────────────────────────────
create table public.guidelines (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  bullets    jsonb not null default '[]',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.guidelines (title, bullets, sort_order) values
  ('🎲 Respect the game & fellow players', '["Treat all players with kindness and patience, especially those learning new games.","No unsolicited strategy advice unless asked — let people make their own moves.","Keep rules disputes civil; the session host''s decision is final."]', 1),
  ('📅 Honour your booking', '["If you''ve reserved a seat, show up or cancel at least 24 hours in advance.","No-shows without notice may affect your ability to book future sessions.","Payment is required to confirm a reservation — this holds your seat."]', 2),
  ('🏠 Respect the venue', '["Handle all game components with care. Damaged components must be reported to the host.","Keep noise to a social level — we''re guests in the venue.","Order something from the venue — it''s the least we can do for their hospitality!"]', 3),
  ('🌐 Community spirit', '["Playhouse Social is a welcoming space for all — no discrimination of any kind.","Introduce yourself to newcomers and help them feel included.","Share feedback constructively through the official channels."]', 4),
  ('📱 Content & privacy', '["You may take photos/videos at sessions but always ask before posting others.","Don''t share personal details of other players without consent.","Keep community channel discussions relevant to gaming and the community."]', 5);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles      enable row level security;
alter table public.admin_users   enable row level security;
alter table public.games         enable row level security;
alter table public.sessions      enable row level security;
alter table public.bookings      enable row level security;
alter table public.scores        enable row level security;
alter table public.polls         enable row level security;
alter table public.poll_options  enable row level security;
alter table public.poll_votes    enable row level security;
alter table public.announcements enable row level security;
alter table public.faqs          enable row level security;
alter table public.guidelines    enable row level security;

-- ── profiles ──
create policy "Users can view all profiles"       on public.profiles for select to authenticated using (true);
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- ── admin_users ──
create policy "Admins can view admin_users"  on public.admin_users for select to authenticated using (public.is_admin(auth.uid()));
create policy "Admins can manage admin_users" on public.admin_users for all    to authenticated using (public.is_admin(auth.uid()));

-- ── games ──
create policy "Anyone authenticated can view games" on public.games for select to authenticated using (true);
create policy "Admins can manage games"             on public.games for all    to authenticated using (public.is_admin(auth.uid()));

-- ── sessions ──
create policy "Anyone authenticated can view sessions" on public.sessions for select to authenticated using (true);
create policy "Admins can manage sessions"             on public.sessions for all    to authenticated using (public.is_admin(auth.uid()));

-- ── bookings ──
create policy "Users can view all bookings"       on public.bookings for select to authenticated using (true);
create policy "Users can manage their bookings"   on public.bookings for all    to authenticated using (auth.uid() = player_id);
create policy "Admins can manage all bookings"    on public.bookings for all    to authenticated using (public.is_admin(auth.uid()));

-- ── scores ──
create policy "Anyone authenticated can view scores" on public.scores for select to authenticated using (true);
create policy "Admins can manage scores"             on public.scores for all    to authenticated using (public.is_admin(auth.uid()));

-- ── polls ──
create policy "Anyone authenticated can view polls" on public.polls for select to authenticated using (true);
create policy "Admins can manage polls"             on public.polls for all    to authenticated using (public.is_admin(auth.uid()));

-- ── poll_options ──
create policy "Anyone authenticated can view poll options" on public.poll_options for select to authenticated using (true);
create policy "Admins can manage poll options"             on public.poll_options for all to authenticated using (public.is_admin(auth.uid()));

-- ── poll_votes ──
create policy "Anyone authenticated can view votes" on public.poll_votes for select to authenticated using (true);
create policy "Users can cast and update their vote" on public.poll_votes for all to authenticated using (auth.uid() = player_id);

-- ── announcements ──
create policy "Anyone authenticated can view announcements" on public.announcements for select to authenticated using (true);
create policy "Admins can manage announcements"             on public.announcements for all    to authenticated using (public.is_admin(auth.uid()));

-- ── faqs ──
create policy "Anyone authenticated can view faqs" on public.faqs for select to authenticated using (true);
create policy "Admins can manage faqs"             on public.faqs for all    to authenticated using (public.is_admin(auth.uid()));

-- ── guidelines ──
create policy "Anyone authenticated can view guidelines" on public.guidelines for select to authenticated using (true);
create policy "Admins can manage guidelines"             on public.guidelines for all    to authenticated using (public.is_admin(auth.uid()));
