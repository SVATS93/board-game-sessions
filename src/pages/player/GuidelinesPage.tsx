import Shell from "@/components/layout/Shell"

const GUIDELINES = [
  {
    title: "🎲 Respect the game & fellow players",
    bullets: [
      "Treat all players with kindness and patience, especially those learning new games.",
      "No unsolicited strategy advice unless asked — let people make their own moves.",
      "Keep rules disputes civil; the session host's decision is final.",
    ],
  },
  {
    title: "📅 Honour your booking",
    bullets: [
      "If you've reserved a seat, show up or cancel at least 24 hours in advance.",
      "No-shows without notice may affect your ability to book future sessions.",
      "Payment is required to confirm a reservation — this holds your seat.",
    ],
  },
  {
    title: "🏠 Respect the venue",
    bullets: [
      "Handle all game components with care. Damaged components must be reported to the host.",
      "Keep noise to a social level — we're guests in the venue.",
      "Order something from the venue — it's the least we can do for their hospitality!",
    ],
  },
  {
    title: "🌐 Community spirit",
    bullets: [
      "Playhouse Social is a welcoming space for all — no discrimination of any kind.",
      "Introduce yourself to newcomers and help them feel included.",
      "Share feedback constructively through the official channels.",
    ],
  },
  {
    title: "📱 Content & privacy",
    bullets: [
      "You may take photos/videos at sessions but always ask before posting others.",
      "Don't share personal details of other players without consent.",
      "Keep community channel discussions relevant to gaming and the community.",
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <Shell title="Community Guidelines">
      <div className="max-w-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl tracking-wider text-foreground">Community Guidelines</h1>
          <div className="flex gap-3 flex-wrap">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:-translate-y-0.5"
              style={{ color: "#25d366", borderColor: "rgba(37,211,102,0.3)", background: "rgba(37,211,102,0.08)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.534 5.858L0 24l6.334-1.507A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.663-.498-5.197-1.371l-.369-.22-3.762.895.945-3.668-.241-.381A9.96 9.96 0 012 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
              </svg>
              Join on WhatsApp
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:-translate-y-0.5"
              style={{ color: "#e1306c", borderColor: "rgba(225,48,108,0.25)", background: "rgba(225,48,108,0.08)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Follow on Instagram
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {GUIDELINES.map((g) => (
            <div key={g.title} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-brand-cyan/30">
              <h3 className="text-sm font-bold text-brand-cyan mb-3">{g.title}</h3>
              <ul className="space-y-1.5 pl-4 list-disc marker:text-brand-cyan/40">
                {g.bullets.map((b) => (
                  <li key={b} className="text-sm text-muted-foreground leading-relaxed">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}
