import Shell from "@/components/layout/Shell"
import { Pin } from "lucide-react"

// Phase 2: Supabase query from announcements table
const ANNOUNCEMENTS = [
  {
    pinned: true,
    title: "Welcome to Playhouse Social!",
    date: "1 Apr 2026",
    body: "We're thrilled to launch our community platform. Here you can check your game schedule, track scores, browse our game library, and stay updated with all things Playhouse Social. Kidulting made fun!",
  },
  {
    pinned: false,
    title: "New venue from May — Starbucks ECity",
    date: "15 Apr 2026",
    body: "We've secured a regular spot at Starbucks, Electronic City, Bengaluru every Friday from 6 PM onwards. Seats are limited, so make sure to reserve in advance through the Schedule section.",
  },
  {
    pinned: false,
    title: "Game of the Month: Ark Nova",
    date: "1 May 2026",
    body: "May's featured game is Ark Nova (2021). We'll be running multiple sessions throughout the month. Rated #2 on BoardGameGeek, this is a must-play for strategy enthusiasts. Look out for teaching sessions if you're new!",
  },
  {
    pinned: false,
    title: "PHS Leaderboard is live!",
    date: "5 May 2026",
    body: "The PlayHouse Social leaderboard scoring is now active. Your PHS score is calculated based on hours played, game diversity, and unique gamers you've met — all normalised so newcomers can still compete. Check the Score & Leaderboard section.",
  },
]

export default function AnnouncementsPage() {
  return (
    <Shell title="Announcements">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-3xl tracking-wider text-foreground">Announcements</h1>
        <div className="space-y-3">
          {ANNOUNCEMENTS.map((a, i) => (
            <div
              key={i}
              className={`rounded-xl border bg-card p-5 transition-all hover:shadow-md ${
                a.pinned
                  ? "border-l-4 border-l-brand-amber border-t-border border-r-border border-b-border"
                  : "border-border border-l-4 border-l-brand-cyan/30"
              }`}
            >
              {a.pinned && (
                <div className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-brand-amber mb-2">
                  <Pin className="h-3 w-3" /> Pinned
                </div>
              )}
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <p className="font-semibold text-foreground text-sm">{a.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{a.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
