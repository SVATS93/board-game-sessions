import { useState } from "react"
import Shell from "@/components/layout/Shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Phase 2: Supabase query from scores + sessions tables
const SCORECARDS = [
  { game: "Ark Nova (2021)", date: "06:00 PM, 2 May", location: "Starbucks, ECity", scores: [{ name: "Maximus", score: 87, winner: true }, { name: "Prashast", score: 85 }, { name: "Shivangi", score: 80 }, { name: "Shreyansh", score: 78 }] },
  { game: "Jaipur (2009)", date: "06:00 PM, 3 May", location: "Starbucks, ECity", scores: [{ name: "Shivangi", score: 80, winner: true }, { name: "Shreyansh", score: 78 }] },
  { game: "Scythe (2016)", date: "06:00 PM, 4 May", location: "Starbucks, ECity", scores: [{ name: "Maximus", score: 87, winner: true }, { name: "Prashast", score: 85 }, { name: "Shivangi", score: 80 }, { name: "Shreyansh", score: 78 }] },
]

const LEADERBOARD = [
  { name: "Maximus", phs: 316, rank: 1, hrs: 37, games: 163 },
  { name: "Perseus", phs: 308, rank: 2, hrs: 32, games: 123 },
  { name: "Loki", phs: 306, rank: 3, hrs: 29, games: 92 },
  { name: "Shreyansh Vats", phs: 298, rank: 4, hrs: 29, games: 92, isMe: true },
  { name: "Shivangi Tripathi", phs: 245, rank: 5, hrs: 24, games: 74 },
  { name: "Prashast Vats", phs: 243, rank: 6, hrs: 21, games: 32 },
  { name: "Nipun Verma", phs: 131, rank: 7, hrs: 18, games: 28 },
  { name: "Arijit Roy", phs: 111, rank: 8, hrs: 19, games: 28 },
]
const ME = LEADERBOARD.find(x => x.isMe)!

const HOURS_BREAKDOWN = [
  { game: "Ark Nova (2021)", sessions: 4, hours: 10 },
  { game: "Scythe (2016)", sessions: 3, hours: 7 },
  { game: "Jaipur (2009)", sessions: 5, hours: 4 },
  { game: "Wyrmspan (2024)", sessions: 2, hours: 5 },
  { game: "Catan (1995)", sessions: 2, hours: 3 },
]
const UNIQUE_GAMES = [
  { name: "Ark Nova", year: 2021 }, { name: "Scythe", year: 2016 },
  { name: "Jaipur", year: 2009 }, { name: "Wyrmspan", year: 2024 },
  { name: "Catan", year: 1995 }, { name: "Azul", year: 2017 },
]
const UNIQUE_GAMERS = [
  { name: "Maximus", games: 5 }, { name: "Perseus", games: 4 },
  { name: "Loki", games: 3 }, { name: "Shivangi", games: 6 },
  { name: "Prashast", games: 4 }, { name: "Nipun", games: 2 },
]
const BADGES = [
  { icon: "🎲", name: "First Roll", desc: "Played your first game session", earned: true, date: "Apr 2026" },
  { icon: "🔥", name: "On a Roll", desc: "Played 5 sessions in a row", earned: true, date: "May 2026" },
  { icon: "📚", name: "Game Explorer", desc: "Played 5 unique games", earned: true, date: "May 2026" },
  { icon: "🤝", name: "Social Butterfly", desc: "Met 5 unique gamers", earned: true, date: "May 2026" },
  { icon: "⏰", name: "Time Lord", desc: "Accumulated 25+ hours of play", earned: true, date: "May 2026" },
  { icon: "👑", name: "Top 5", desc: "Reached top 5 on the leaderboard", earned: false },
  { icon: "🏆", name: "Champion", desc: "Won 10 game sessions", earned: false },
  { icon: "🌟", name: "Veteran", desc: "Member for 6+ months", earned: false },
  { icon: "🎯", name: "Diverse Player", desc: "Played 15 unique games", earned: false },
]

type PopupType = "hours" | "games" | "gamers" | "badges" | null

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-brand-amber/15 text-brand-amber text-sm">🥇</span>
  if (rank === 2) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-border/30 text-gray-400 text-sm">🥈</span>
  if (rank === 3) return <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-border/20 text-yellow-700 text-sm">🥉</span>
  return <span className="text-muted-foreground text-sm px-1.5">{rank}</span>
}

export default function ScoresPage() {
  const [popup, setPopup] = useState<PopupType>(null)
  const maxHrs = Math.max(...HOURS_BREAKDOWN.map(x => x.hours))

  return (
    <Shell title="Score & Leaderboard">
      <div className="space-y-4">
        <h1 className="font-display text-3xl tracking-wider text-foreground">Score &amp; Leaderboard</h1>

        <Tabs defaultValue="scorecards">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="scorecards" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black data-[state=active]:font-semibold">My Scorecards</TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black data-[state=active]:font-semibold">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="scorecards" className="mt-4">
            <div className="rounded-xl border border-border bg-card overflow-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead><tr className="border-b border-border">
                  {["Game name", "Date", "Location", "Scores"].map(h => (
                    <th key={h} className="text-left p-3 pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {SCORECARDS.map((s, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 pl-4 font-semibold">{s.game}</td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap text-xs">{s.date}</td>
                      <td className="p-3 text-muted-foreground text-xs">{s.location}</td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          {s.scores.map(p => (
                            <div key={p.name} className={`text-xs ${p.winner ? "text-brand-amber font-semibold" : "text-muted-foreground"}`}>
                              {p.winner ? "👑 " : ""}{p.name} — {p.score}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4 space-y-5">
            {/* Clickable stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { key: "hours" as PopupType, value: `${ME.hrs} hrs`, label: "Total hours played" },
                { key: "games" as PopupType, value: String(UNIQUE_GAMES.length), label: "Unique games played" },
                { key: "gamers" as PopupType, value: String(UNIQUE_GAMERS.length), label: "Unique gamers met" },
                { key: "badges" as PopupType, value: "Apr 2026", label: "Gamer since" },
              ].map(card => (
                <button
                  key={card.key}
                  onClick={() => setPopup(card.key)}
                  className="group rounded-xl border border-border bg-card p-4 text-center card-hover-glow hover:border-brand-cyan/40"
                >
                  <div className="font-display text-2xl text-brand-cyan leading-none">{card.value}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1.5">{card.label}</div>
                  <div className="text-xs text-brand-cyan/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">tap to expand ↗</div>
                </button>
              ))}
            </div>

            {/* Leaderboard table */}
            <div className="rounded-xl border border-border bg-card overflow-auto">
              <table className="w-full text-sm min-w-[400px]">
                <thead><tr className="border-b border-border">
                  {["Rank", "Player", "PHS Score", "Hrs played", "Games played"].map(h => (
                    <th key={h} className="text-left p-3 pl-4 text-xs font-semibold uppercase tracking-wider text-brand-cyan/80">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {LEADERBOARD.map(p => (
                    <tr key={p.name} className={`border-b border-border/50 last:border-0 transition-colors ${p.isMe ? "bg-brand-cyan/5 border-l-2 border-l-brand-cyan" : "hover:bg-muted/30"}`}>
                      <td className="p-3 pl-4"><RankBadge rank={p.rank} /></td>
                      <td className={`p-3 font-${p.isMe ? "bold" : "medium"} ${p.isMe ? "text-brand-cyan" : "text-foreground"}`}>
                        {p.name}{p.isMe && <span className="text-xs text-brand-cyan/60 ml-1">(you)</span>}
                      </td>
                      <td className={`p-3 font-display text-lg ${p.rank <= 3 ? "text-brand-amber" : "text-foreground"}`}>{p.phs}</td>
                      <td className="p-3 text-muted-foreground">{p.hrs}</td>
                      <td className="p-3 text-muted-foreground">{p.games}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <span className="text-brand-cyan font-semibold">PHS Score formula: </span>
              (40·√HR + 30·√GR + 30·√SR) × (1 + log(1 + D/30)) — Normalised by weeks active so new players can compete fairly.
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Stat detail popup */}
      <Dialog open={!!popup} onOpenChange={() => setPopup(null)}>
        <DialogContent className="max-w-md bg-card border-border max-h-[80vh] overflow-y-auto">
          {popup === "hours" && (
            <div>
              <h3 className="font-display text-2xl text-foreground">Hours Played</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Breakdown · {HOURS_BREAKDOWN.reduce((s, x) => s + x.hours, 0)} hrs total</p>
              <div className="space-y-3">
                {HOURS_BREAKDOWN.map(g => (
                  <div key={g.game} className="flex items-center gap-4">
                    <div className="w-36 shrink-0">
                      <div className="text-sm font-medium text-foreground">{g.game}</div>
                      <div className="text-xs text-muted-foreground">{g.sessions} session{g.sessions > 1 ? "s" : ""}</div>
                    </div>
                    <Progress value={Math.round((g.hours / maxHrs) * 100)} className="flex-1 h-1.5 [&>div]:bg-brand-cyan" />
                    <span className="font-display text-brand-cyan whitespace-nowrap">{g.hours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {popup === "games" && (
            <div>
              <h3 className="font-display text-2xl text-foreground">Unique Games Played</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{UNIQUE_GAMES.length} games explored so far</p>
              <div className="flex flex-wrap gap-2">
                {UNIQUE_GAMES.map(g => (
                  <span key={g.name} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-sm font-medium text-foreground hover:border-brand-cyan/40 transition-colors">
                    🎲 {g.name} <span className="text-muted-foreground text-xs">{g.year}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {popup === "gamers" && (
            <div>
              <h3 className="font-display text-2xl text-foreground">Unique Gamers Met</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{UNIQUE_GAMERS.length} players you've gamed with</p>
              <div className="space-y-3">
                {UNIQUE_GAMERS.map(g => (
                  <div key={g.name} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                    <div className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-foreground uppercase shrink-0">
                      {g.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{g.name}</div>
                      <div className="text-xs text-muted-foreground">Played together in {g.games} session{g.games > 1 ? "s" : ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {popup === "badges" && (
            <div>
              <h3 className="font-display text-2xl text-foreground">My Badges</h3>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{BADGES.filter(b => b.earned).length} of {BADGES.length} earned · Gamer since Apr 2026</p>
              <div className="grid grid-cols-3 gap-3">
                {BADGES.map(b => (
                  <div key={b.name} className={`rounded-xl border p-3 text-center transition-all ${b.earned ? "border-brand-amber/40 bg-brand-amber/5" : "border-border bg-muted/30 opacity-50"}`}>
                    <div className="text-3xl mb-1.5">{b.icon}</div>
                    <div className="text-xs font-bold text-foreground mb-0.5">{b.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{b.desc}</div>
                    {b.earned
                      ? <div className="text-xs text-brand-amber font-bold mt-1.5">✓ {b.date}</div>
                      : <div className="text-xs text-muted-foreground mt-1.5">🔒 Locked</div>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Shell>
  )
}
