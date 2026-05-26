import { useState } from "react"
import Shell from "@/components/layout/Shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight } from "lucide-react"

interface Player { name: string; knows: boolean }
interface GameSession {
  id: string; name: string; year: number; date: string; location: string
  bggRank: number; weight: number; age: string; hype: string; players: Player[]
  status?: "confirmed" | "waitlisted" | "cancelled"; waitlistPos?: number
  filled?: number; total?: number; waitlist?: number
}

// Phase 2: Supabase query from sessions + bookings tables
const MY_GAMES: GameSession[] = [
  { id: "g1", name: "Ark Nova", year: 2021, date: "06:00 PM, 2 May", location: "Starbucks, ECity", bggRank: 2, weight: 3.8, age: "14+", status: "confirmed", hype: "Build the most successful ark by funding conservation projects across the globe. Engine-building at its finest.", players: [{ name: "Shreyansh", knows: true }, { name: "Shivangi", knows: false }, { name: "Prashast", knows: false }, { name: "Loki", knows: true }, { name: "Perseus", knows: true }] },
  { id: "g2", name: "Scythe", year: 2016, date: "06:00 PM, 2 May", location: "Starbucks, ECity", bggRank: 26, weight: 3.45, age: "14+", status: "confirmed", hype: "Five factions vie for dominance in a war-torn, dieselpunk 1920s Europe. Area control meets engine building.", players: [{ name: "Shreyansh", knows: true }, { name: "Loki", knows: true }, { name: "Maximus", knows: false }] },
  { id: "g3", name: "Wyrmspan", year: 2024, date: "06:00 PM, 2 May", location: "Starbucks, ECity", bggRank: 123, weight: 2.83, age: "14+", status: "waitlisted", waitlistPos: 2, hype: "A lush cave for dragons to roost and thrive. Wingspan meets fantasy in this card-driven engine builder.", players: [{ name: "Perseus", knows: true }, { name: "Shivangi", knows: false }] },
]

const UPCOMING_GAMES: GameSession[] = [
  { id: "u1", name: "Ark Nova", year: 2021, date: "06:00 PM, 9 May", location: "Starbucks, ECity", bggRank: 2, weight: 3.8, age: "14+", filled: 5, total: 8, hype: "Build the most successful ark by funding conservation projects across the globe. Engine-building at its finest.", players: [{ name: "Maximus", knows: true }, { name: "Perseus", knows: true }, { name: "Loki", knows: false }, { name: "Shivangi", knows: false }, { name: "Prashast", knows: true }] },
  { id: "u2", name: "Scythe", year: 2016, date: "06:00 PM, 9 May", location: "Starbucks, ECity", bggRank: 26, weight: 3.45, age: "14+", filled: 5, total: 8, hype: "Five factions vie for dominance in a war-torn, dieselpunk 1920s Europe. Area control meets engine building.", players: [{ name: "Maximus", knows: true }, { name: "Perseus", knows: false }] },
  { id: "u3", name: "Wyrmspan", year: 2024, date: "06:00 PM, 16 May", location: "Starbucks, ECity", bggRank: 123, weight: 2.83, age: "14+", filled: 8, total: 8, waitlist: 3, hype: "A lush cave for dragons to roost and thrive. Wingspan meets fantasy in this card-driven engine builder.", players: [{ name: "Maximus", knows: true }, { name: "Loki", knows: true }, { name: "Shivangi", knows: false }, { name: "Prashast", knows: true }, { name: "Perseus", knows: false }, { name: "Nipun", knows: true }, { name: "Arijit", knows: false }, { name: "Shruti", knows: true }] },
]

function StatusBadge({ g }: { g: GameSession }) {
  if (g.status === "confirmed") return <Badge className="bg-brand-green/15 text-brand-green border-brand-green/30 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-green inline-block" />Paid, Confirmed</Badge>
  if (g.status === "waitlisted") return <Badge className="bg-brand-amber/15 text-brand-amber border-brand-amber/30 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand-amber inline-block" />Paid, Waitlisted ({g.waitlistPos})</Badge>
  return <Badge variant="destructive">Cancelled</Badge>
}

function PlayerPill({ player }: { player: Player }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${player.knows ? "bg-brand-green/10 text-brand-green border-brand-green/25" : "bg-brand-amber/10 text-brand-amber border-brand-amber/25"}`}>
      {player.name}
    </span>
  )
}

export default function SchedulePage() {
  const [selected, setSelected] = useState<{ game: GameSession; type: "my" | "upcoming" } | null>(null)
  const [reserveGame, setReserveGame] = useState<{ game: GameSession; isWaitlist: boolean } | null>(null)
  const [needsTeach, setNeedsTeach] = useState(false)

  function openDetail(game: GameSession, type: "my" | "upcoming") {
    setSelected({ game, type })
  }

  function openReserve(game: GameSession, isWaitlist: boolean) {
    setSelected(null)
    setTimeout(() => setReserveGame({ game, isWaitlist }), 150)
  }

  function confirmReservation() {
    setReserveGame(null)
    setNeedsTeach(false)
    // Phase 2: Supabase insert into bookings
  }

  return (
    <Shell title="Schedule">
      <div className="space-y-4">
        <h1 className="font-display text-3xl tracking-wider text-foreground">Schedule</h1>

        <Tabs defaultValue="my-games">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="my-games" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black data-[state=active]:font-semibold">My Games</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-brand-amber data-[state=active]:text-black data-[state=active]:font-semibold">Upcoming Games</TabsTrigger>
          </TabsList>

          <TabsContent value="my-games" className="mt-4">
            <div className="rounded-xl border border-border bg-card overflow-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead><tr className="border-b border-border">
                  {["Game name", "Date & time", "Location", "BGG stats", "My status", ""].map(h => (
                    <th key={h} className="text-left p-3 pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MY_GAMES.map(g => (
                    <tr key={g.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 pl-4 font-semibold">{g.name} <span className="text-muted-foreground font-normal text-xs">({g.year})</span></td>
                      <td className="p-3 text-muted-foreground whitespace-nowrap text-xs">{g.date}</td>
                      <td className="p-3 text-muted-foreground text-xs">{g.location}</td>
                      <td className="p-3">
                        <div className="font-bold text-brand-cyan text-sm">#{g.bggRank}</div>
                        <div className="text-xs text-muted-foreground">{g.weight}/5 · {g.age}</div>
                      </td>
                      <td className="p-3"><StatusBadge g={g} /></td>
                      <td className="p-3 pr-4">
                        <button onClick={() => openDetail(g, "my")} className="text-muted-foreground hover:text-brand-cyan transition-colors">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            <div className="rounded-xl border border-border bg-card overflow-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead><tr className="border-b border-border">
                  {["Game name", "Date & time", "Location", "BGG stats", "Availability", ""].map(h => (
                    <th key={h} className="text-left p-3 pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {UPCOMING_GAMES.map(g => {
                    const pct = Math.round(((g.filled ?? 0) / (g.total ?? 1)) * 100)
                    const full = (g.filled ?? 0) >= (g.total ?? 0)
                    return (
                      <tr key={g.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-3 pl-4 font-semibold">{g.name} <span className="text-muted-foreground font-normal text-xs">({g.year})</span></td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap text-xs">{g.date}</td>
                        <td className="p-3 text-muted-foreground text-xs">{g.location}</td>
                        <td className="p-3">
                          <div className="font-bold text-brand-cyan text-sm">#{g.bggRank}</div>
                          <div className="text-xs text-muted-foreground">{g.weight}/5 · {g.age}</div>
                        </td>
                        <td className="p-3 min-w-[140px]">
                          <Progress value={pct} className={`h-1.5 mb-1 ${full ? "[&>div]:bg-destructive" : "[&>div]:bg-brand-cyan"}`} />
                          <span className={`text-xs font-semibold ${full ? "text-destructive" : "text-brand-cyan"}`}>
                            {g.filled}/{g.total}{full ? " — Full" : " seats"}
                          </span>
                          {g.waitlist ? <div className="text-xs text-destructive font-bold mt-0.5">Waitlist: {g.waitlist}</div> : null}
                        </td>
                        <td className="p-3 pr-4">
                          <button onClick={() => openDetail(g, "upcoming")} className="text-muted-foreground hover:text-brand-cyan transition-colors">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking detail dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="sr-only">Game detail</DialogTitle>
          </DialogHeader>
          {selected && (() => {
            const { game: g, type } = selected
            const isUpcoming = type === "upcoming"
            const full = isUpcoming && (g.filled ?? 0) >= (g.total ?? 0)
            const pct = isUpcoming ? Math.round(((g.filled ?? 0) / (g.total ?? 1)) * 100) : 0
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:border-r sm:border-border sm:pr-6">
                  <h2 className="font-display text-3xl tracking-wide text-foreground mb-1">{g.name}</h2>
                  <p className="text-sm font-bold tracking-widest text-muted-foreground">{g.date}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">{g.location}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Players</p>
                  <div className="flex flex-wrap gap-1.5">{g.players.map(p => <PlayerPill key={p.name} player={p} />)}</div>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span><span className="text-brand-green">●</span> Knows the game</span>
                    <span><span className="text-brand-amber">●</span> Needs teaching</span>
                  </div>
                </div>
                <div>
                  {!isUpcoming && <div className="mb-4"><StatusBadge g={g} /></div>}
                  <p className="text-xs font-bold tracking-widest uppercase text-brand-amber mb-3">BoardGameGeek Stats</p>
                  <div className="flex gap-6 mb-4">
                    {[{ val: `#${g.bggRank}`, label: "Global rank" }, { val: `${g.weight}/5`, label: "Weight" }, { val: g.age, label: "Age" }].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="font-display text-xl text-brand-amber">{s.val}</div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{g.hype}</p>
                  {isUpcoming && (
                    <>
                      <Progress value={pct} className={`h-2 mb-2 ${full ? "[&>div]:bg-destructive" : "[&>div]:bg-brand-cyan"}`} />
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <span className={`text-sm font-semibold ${full ? "text-destructive" : "text-brand-cyan"}`}>
                          ({g.filled}/{g.total}) {full ? "— Full" : "seats available"}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => openReserve(g, full)}
                          className={full ? "bg-muted text-foreground hover:bg-muted/80" : "bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold shadow-glow-sm-amber"}
                        >
                          {full ? "Join waitlist" : "Reserve seat"}
                        </Button>
                      </div>
                      {g.waitlist ? <p className="text-xs text-destructive font-bold mt-2">Current waitlist: {g.waitlist}</p> : null}
                    </>
                  )}
                </div>
              </div>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* Reserve dialog */}
      <Dialog open={!!reserveGame} onOpenChange={() => setReserveGame(null)}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {reserveGame?.isWaitlist ? "Join the waitlist" : "Reserve your seat"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground -mt-2">
            {reserveGame?.isWaitlist ? "You'll be notified if a spot opens up." : "Confirm your booking details below."}
          </p>
          <div className="space-y-3 mt-2">
            <p className="text-sm font-semibold text-foreground">Do you need a teach / walkthrough?</p>
            <div className="flex gap-4">
              {[{ val: false, label: "No, I know this game" }, { val: true, label: "Yes, please teach me" }].map(opt => (
                <label key={String(opt.val)} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="teach" checked={needsTeach === opt.val} onChange={() => setNeedsTeach(opt.val)} className="accent-brand-amber" />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="ghost" onClick={() => setReserveGame(null)}>Cancel</Button>
            <Button onClick={confirmReservation} className="bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold shadow-glow-sm-amber">
              {reserveGame?.isWaitlist ? "Join waitlist" : "Confirm reservation"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  )
}
