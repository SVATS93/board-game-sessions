import Shell from "@/components/layout/Shell"
import { Badge } from "@/components/ui/badge"

// Phase 2: Supabase query from games table
const LIBRARY = [
  { name: "Scythe", year: 2016, publisher: "Stonemaier Games", brief: "Five factions vie for dominance in war-torn dieselpunk 1920s Europe.", overallRank: 26, category: "Strategy", catRank: 27, players: "1–5", time: 115, age: "14+", weight: 3.45, status: "available" },
  { name: "Ark Nova", year: 2021, publisher: "Capstone Games", brief: "Fund conservation projects, manage animals and build the best zoo.", overallRank: 2, category: "Strategy", catRank: 2, players: "1–4", time: 150, age: "14+", weight: 3.8, status: "available" },
  { name: "Jaipur", year: 2009, publisher: "Asmodee", brief: "Fast-paced trading card duel set in a vibrant Indian spice market.", overallRank: 194, category: "Card Game", catRank: 12, players: "2", time: 30, age: "10+", weight: 1.49, status: "available" },
  { name: "Wyrmspan", year: 2024, publisher: "Stonemaier Games", brief: "Build a cave sanctuary for dragons in this engine-building game.", overallRank: 123, category: "Engine Build", catRank: 14, players: "1–5", time: 90, age: "14+", weight: 2.83, status: "available" },
  { name: "Catan", year: 1995, publisher: "Catan Studio", brief: "Classic resource trading and settlement building on a modular island.", overallRank: 312, category: "Family", catRank: 8, players: "3–4", time: 90, age: "10+", weight: 2.33, status: "wishlisted" },
]

function WeightPips({ weight }: { weight: number }) {
  const filled = Math.round(weight)
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${i <= filled ? "bg-brand-cyan" : "bg-muted border border-border"}`}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{weight}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === "available") return <Badge className="bg-brand-green/15 text-brand-green border-brand-green/30 hover:bg-brand-green/20">Available</Badge>
  if (status === "wishlisted") return <Badge className="bg-brand-amber/15 text-brand-amber border-brand-amber/30 hover:bg-brand-amber/20">Wishlisted</Badge>
  return <Badge className="bg-brand-blue/15 text-brand-blue border-brand-blue/30 hover:bg-brand-blue/20">Ordered</Badge>
}

export default function LibraryPage() {
  return (
    <Shell title="Game Library">
      <div className="space-y-4">
        <h1 className="font-display text-3xl tracking-wider text-foreground">Game Library</h1>
        <div className="rounded-xl border border-border bg-card overflow-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 pl-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Game</th>
                <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Publisher</th>
                <th className="text-left p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">BGG Overall</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Players</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Age</th>
                <th className="text-center p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weight</th>
                <th className="text-center p-3 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {LIBRARY.map((g, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors last:border-0">
                  <td className="p-3 pl-4 font-semibold whitespace-nowrap">
                    {g.name} <span className="text-muted-foreground font-normal text-xs">({g.year})</span>
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">{g.publisher}</td>
                  <td className="p-3 text-muted-foreground text-xs max-w-[200px] leading-relaxed">{g.brief}</td>
                  <td className="p-3 text-center font-bold text-brand-cyan">#{g.overallRank}</td>
                  <td className="p-3 text-center">
                    <div className="font-semibold text-muted-foreground">#{g.catRank}</div>
                    <div className="text-xs text-muted-foreground/60">{g.category}</div>
                  </td>
                  <td className="p-3 text-center text-muted-foreground whitespace-nowrap">{g.players}</td>
                  <td className="p-3 text-center text-muted-foreground whitespace-nowrap">{g.time} min</td>
                  <td className="p-3 text-center text-muted-foreground">{g.age}</td>
                  <td className="p-3"><WeightPips weight={g.weight} /></td>
                  <td className="p-3 pr-4 text-center"><StatusBadge status={g.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  )
}
