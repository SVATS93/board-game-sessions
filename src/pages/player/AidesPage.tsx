import { useState } from "react"
import Shell from "@/components/layout/Shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const PLAYER_COLORS = [
  { text: "text-brand-cyan",  border: "border-brand-cyan/30",  bg: "bg-brand-cyan/10"  },
  { text: "text-brand-amber", border: "border-brand-amber/30", bg: "bg-brand-amber/10" },
  { text: "text-brand-pink",  border: "border-brand-pink/30",  bg: "bg-brand-pink/10"  },
  { text: "text-brand-green", border: "border-brand-green/30", bg: "bg-brand-green/10" },
  { text: "text-brand-blue",  border: "border-brand-blue/30",  bg: "bg-brand-blue/10"  },
  { text: "text-purple-400",  border: "border-purple-400/30",  bg: "bg-purple-400/10"  },
]

const SCORE_PRESETS: Record<string, { players: number; rounds: number }> = {
  Jaipur: { players: 2, rounds: 3 },
  "Ark Nova": { players: 4, rounds: 1 },
  Scythe: { players: 4, rounds: 1 },
  Catan: { players: 4, rounds: 1 },
  Wyrmspan: { players: 4, rounds: 1 },
  Azul: { players: 4, rounds: 5 },
}
const SUGGESTED = ["Shreyansh", "Shivangi", "Prashast", "Loki", "Perseus", "Maximus"]

/* ---------- First Player Selector ---------- */
function FirstPlayerSelector() {
  const [players, setPlayers] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [winner, setWinner] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const [flickerName, setFlickerName] = useState<string | null>(null)

  function add() {
    const name = input.trim()
    if (!name || players.includes(name)) return
    setPlayers(p => [...p, name])
    setInput("")
    setWinner(null)
  }

  function remove(name: string) {
    setPlayers(p => p.filter(n => n !== name))
    setWinner(null)
  }

  function spin() {
    if (players.length < 2) return
    setSpinning(true)
    setWinner(null)
    const chosen = players[Math.floor(Math.random() * players.length)]
    let count = 0
    const id = setInterval(() => {
      setFlickerName(players[Math.floor(Math.random() * players.length)])
      count++
      if (count >= 12) {
        clearInterval(id)
        setFlickerName(null)
        setWinner(chosen)
        setSpinning(false)
      }
    }, 80)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-brand-amber/10 border border-brand-amber/25 flex items-center justify-center text-xl shrink-0">🎲</div>
        <div>
          <p className="font-semibold text-foreground text-sm">First Player Selector</p>
          <p className="text-xs text-muted-foreground">Randomly pick who goes first</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Players</p>
        <div className="flex flex-wrap gap-1.5 min-h-[32px]">
          {players.length === 0
            ? <span className="text-xs text-muted-foreground italic">No players yet</span>
            : players.map(n => (
              <span key={n} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-medium text-foreground">
                {n}
                <button onClick={() => remove(n)} className="text-muted-foreground hover:text-destructive transition-colors"><X className="h-3 w-3" /></button>
              </span>
            ))
          }
        </div>
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Add player name…" className="bg-muted border-border text-sm h-8" />
          <Button size="sm" variant="outline" onClick={add} className="h-8 px-3 text-xs">+ Add</Button>
        </div>
      </div>

      <div className={`rounded-lg border p-4 flex flex-col items-center justify-center min-h-[80px] transition-all ${winner ? "border-brand-amber/40 bg-brand-amber/5 shadow-glow-sm-amber" : "border-border bg-muted/30"}`}>
        {spinning && flickerName && <div className="font-display text-2xl text-foreground">{flickerName}</div>}
        {!spinning && winner && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">🎲 First player is</p>
            <p className="font-display text-3xl text-brand-amber animate-fade-in">{winner}</p>
            <p className="text-xs text-muted-foreground">Good luck!</p>
          </>
        )}
        {!spinning && !winner && <p className="text-xs text-muted-foreground">Add players and spin!</p>}
      </div>

      <Button onClick={spin} disabled={spinning || players.length < 2} className="bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold w-full shadow-glow-sm-amber">
        {spinning ? "Spinning…" : winner ? "Spin again" : "🎲 Spin!"}
      </Button>
    </div>
  )
}

/* ---------- Dice Roller ---------- */
function DiceRoller() {
  const [die, setDie] = useState(6)
  const [count, setCount] = useState(2)
  const [results, setResults] = useState<number[]>([])
  const [rolling, setRolling] = useState(false)

  function roll() {
    setRolling(true)
    setTimeout(() => {
      setResults(Array.from({ length: count }, () => Math.floor(Math.random() * die) + 1))
      setRolling(false)
    }, 100)
  }

  const total = results.reduce((a, b) => a + b, 0)

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/25 flex items-center justify-center text-xl shrink-0">🎯</div>
        <div>
          <p className="font-semibold text-foreground text-sm">Dice Roller</p>
          <p className="text-xs text-muted-foreground">Roll any dice combination</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Die type</p>
        <div className="flex flex-wrap gap-1.5">
          {[4, 6, 8, 10, 12, 20].map(s => (
            <button
              key={s}
              onClick={() => setDie(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${s === die ? "bg-brand-cyan/15 border-brand-cyan text-brand-cyan shadow-glow-sm-cyan" : "bg-muted border-border text-muted-foreground hover:border-border/80 hover:text-foreground"}`}
            >
              d{s}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Number of dice</p>
        <div className="flex items-center gap-3">
          <button onClick={() => setCount(c => Math.max(1, c - 1))} className="h-8 w-8 rounded-full bg-muted border border-border text-foreground flex items-center justify-center hover:border-brand-cyan/50 transition-colors text-lg">−</button>
          <span className="font-display text-xl text-foreground w-6 text-center">{count}</span>
          <button onClick={() => setCount(c => Math.min(10, c + 1))} className="h-8 w-8 rounded-full bg-muted border border-border text-foreground flex items-center justify-center hover:border-brand-cyan/50 transition-colors text-lg">+</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[60px] items-center justify-center">
        {results.length === 0
          ? <span className="text-xs text-muted-foreground">Hit roll to throw the dice</span>
          : results.map((r, i) => (
            <div key={i} className={`h-12 w-12 rounded-lg bg-muted border-2 border-brand-cyan/40 flex items-center justify-center font-display text-xl text-brand-cyan shadow-glow-sm-cyan ${rolling ? "animate-bounce" : "animate-fade-in"}`}>
              {r}
            </div>
          ))
        }
      </div>

      {results.length > 1 && !rolling && (
        <p className="text-center text-sm text-muted-foreground">Total: <span className="font-display text-xl text-brand-cyan">{total}</span></p>
      )}

      <Button onClick={roll} className="bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold w-full shadow-glow-sm-cyan">
        🎯 Roll dice
      </Button>
    </div>
  )
}

/* ---------- Score Tracker ---------- */
function ScoreTracker() {
  const [players, setPlayers] = useState<string[]>([])
  const [rounds, setRounds] = useState(3)
  const [scores, setScores] = useState<Record<string, number[]>>({})
  const [winner, setWinner] = useState<{ name: string; score: number } | null>(null)
  const [playerInput, setPlayerInput] = useState("")

  function addPlayer() {
    const name = playerInput.trim()
    if (!name || players.includes(name) || players.length >= 6) return
    setPlayers(p => [...p, name])
    setScores(s => ({ ...s, [name]: Array(rounds).fill(0) }))
    setPlayerInput("")
    setWinner(null)
  }

  function removePlayer(name: string) {
    setPlayers(p => p.filter(n => n !== name))
    setScores(s => { const n = { ...s }; delete n[name]; return n })
    setWinner(null)
  }

  function loadPreset(game: string) {
    const p = SCORE_PRESETS[game]
    const newPlayers = SUGGESTED.slice(0, p.players)
    setPlayers(newPlayers)
    setRounds(p.rounds)
    setScores(Object.fromEntries(newPlayers.map(n => [n, Array(p.rounds).fill(0)])))
    setWinner(null)
  }

  function changeRounds(delta: number) {
    const nr = Math.max(1, rounds + delta)
    setRounds(nr)
    setScores(s => Object.fromEntries(players.map(n => [n, Array(nr).fill(0).map((_, i) => s[n]?.[i] ?? 0)])))
    setWinner(null)
  }

  function updateScore(player: string, round: number, val: string) {
    setScores(s => ({ ...s, [player]: s[player].map((v, i) => i === round ? (parseFloat(val) || 0) : v) }))
    setWinner(null)
  }

  function getTotal(name: string) {
    return (scores[name] ?? []).reduce((a, b) => a + b, 0)
  }

  function declare() {
    if (players.length < 2) return
    const totals = players.map(n => ({ name: n, score: getTotal(n) }))
    const top = totals.reduce((a, b) => a.score >= b.score ? a : b)
    setWinner(top)
    setTimeout(() => document.getElementById("winner-banner")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50)
  }

  const winnerIdx = players.length > 0 ? players.indexOf(players.reduce((a, b) => getTotal(a) >= getTotal(b) ? a : b)) : -1

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-xl shrink-0">📊</div>
        <div>
          <p className="font-semibold text-foreground text-sm">Score Tracker</p>
          <p className="text-xs text-muted-foreground">Track scores across rounds — or use a game preset</p>
        </div>
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Quick start</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.keys(SCORE_PRESETS).map(g => (
            <button key={g} onClick={() => loadPreset(g)} className="px-3 py-1 rounded-full text-xs font-semibold bg-muted border border-border text-muted-foreground hover:border-brand-amber/40 hover:text-brand-amber hover:bg-brand-amber/5 transition-all">
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Players + Rounds */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Players (max 6)</p>
          <div className="flex gap-2">
            <Input value={playerInput} onChange={e => setPlayerInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addPlayer()} placeholder="Add player…" className="bg-muted border-border text-sm h-8" />
            <Button size="sm" variant="outline" onClick={addPlayer} className="h-8 px-2 text-xs">+</Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {players.map((n, i) => {
              const c = PLAYER_COLORS[i % 6]
              return (
                <span key={n} className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.text} ${c.border} ${c.bg}`}>
                  {n}
                  <button onClick={() => removePlayer(n)} className="opacity-60 hover:opacity-100"><X className="h-2.5 w-2.5" /></button>
                </span>
              )
            })}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Rounds</p>
          <div className="flex items-center gap-3">
            <button onClick={() => changeRounds(-1)} className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center hover:border-brand-cyan/50 text-lg">−</button>
            <span className="font-display text-xl text-foreground w-6 text-center">{rounds}</span>
            <button onClick={() => changeRounds(1)} className="h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center hover:border-brand-cyan/50 text-lg">+</button>
          </div>
        </div>
      </div>

      {/* Score table */}
      {players.length < 2
        ? <div className="py-8 text-center text-sm text-muted-foreground">Add at least 2 players to start tracking.</div>
        : (
          <div className="overflow-auto rounded-lg border border-border">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 pl-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Round</th>
                  {players.map((n, i) => {
                    const c = PLAYER_COLORS[i % 6]
                    return <th key={n} className={`p-2 text-center text-xs font-bold ${c.text} ${i === winnerIdx ? "relative" : ""}`}>
                      {n}{i === winnerIdx && getTotal(n) > 0 ? " 👑" : ""}
                    </th>
                  })}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rounds }, (_, r) => (
                  <tr key={r} className="border-b border-border/50 last:border-0">
                    <td className="p-2 pl-3 text-xs text-muted-foreground font-semibold">Round {r + 1}</td>
                    {players.map((n, i) => {
                      const c = PLAYER_COLORS[i % 6]
                      return (
                        <td key={n} className="p-2 text-center">
                          <input
                            type="number"
                            min={0}
                            value={scores[n]?.[r] || ""}
                            onChange={e => updateScore(n, r, e.target.value)}
                            placeholder="—"
                            className={`w-16 bg-muted border border-border rounded text-center text-sm font-semibold focus:outline-none focus:border-brand-cyan py-1 ${c.text}`}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="bg-muted/40 font-bold">
                  <td className="p-2 pl-3 text-xs text-muted-foreground uppercase tracking-wider">Total</td>
                  {players.map((n, i) => {
                    const c = PLAYER_COLORS[i % 6]
                    return <td key={n} className={`p-2 text-center font-display text-xl ${c.text}`}>{getTotal(n)}</td>
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )
      }

      {/* Winner banner */}
      {winner && (
        <div id="winner-banner" className="rounded-xl border border-brand-amber/30 bg-brand-amber/8 p-4 text-center animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-amber">🏆 Winner!</p>
          <p className="font-display text-3xl text-foreground">{winner.name}</p>
          <p className="text-sm text-muted-foreground">{winner.score} points</p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button onClick={declare} disabled={players.length < 2} className="bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold shadow-glow-sm-amber">
          🏆 Declare winner
        </Button>
        <Button variant="ghost" onClick={() => { setPlayers([]); setScores({}); setWinner(null); setRounds(3) }}>
          Reset
        </Button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
export default function AidesPage() {
  return (
    <Shell title="Player Aides">
      <div className="space-y-4">
        <div>
          <h1 className="font-display text-3xl tracking-wider text-foreground">Player Aides</h1>
          <p className="text-sm text-muted-foreground mt-1">Tools to make your game nights run smoother.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FirstPlayerSelector />
          <DiceRoller />
        </div>
        <ScoreTracker />
      </div>
    </Shell>
  )
}
