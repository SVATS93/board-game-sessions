import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import {
  Users, CalendarDays, ClipboardList, Trophy,
  Library, Megaphone, HelpCircle, BookMarked, Vote, LogOut,
} from "lucide-react"

const TILES = [
  { to: "/admin/manage-profiles",  label: "Manage Profiles",          icon: Users,         color: "amber" },
  { to: "/admin/schedule-updates", label: "Schedule Updates",         icon: CalendarDays,  color: "cyan"  },
  { to: "/admin/check-bookings",   label: "Check Bookings",           icon: ClipboardList, color: "blue"  },
  { to: "/admin/manage-scores",    label: "Manage Scores",            icon: Trophy,        color: "amber" },
  { to: "/admin/library",          label: "Library Updation",         icon: Library,       color: "cyan"  },
  { to: "/admin/announcements",    label: "Announcements Push",       icon: Megaphone,     color: "pink"  },
  { to: "/admin/faqs",             label: "FAQs Updation",            icon: HelpCircle,    color: "blue"  },
  { to: "/admin/guidelines",       label: "Community Guidelines",     icon: BookMarked,    color: "green" },
  { to: "/admin/polls",            label: "Manage Polls & Votes",     icon: Vote,          color: "pink"  },
]

const COLOR_MAP: Record<string, string> = {
  amber: "text-brand-amber border-brand-amber/20 hover:border-brand-amber/50 hover:shadow-glow-sm-amber",
  cyan:  "text-brand-cyan  border-brand-cyan/20  hover:border-brand-cyan/50  hover:shadow-glow-sm-cyan",
  blue:  "text-brand-blue  border-brand-blue/20  hover:border-brand-blue/50",
  pink:  "text-brand-pink  border-brand-pink/20  hover:border-brand-pink/50",
  green: "text-brand-green border-brand-green/20 hover:border-brand-green/50",
}

export default function GodModePage() {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-widest text-gradient-amber">GOD MODE</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {profile?.first_name ?? "Admin"} · <span className="text-brand-cyan">Full access</span>
            </p>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {/* Tile grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TILES.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`group flex flex-col items-center justify-center gap-3 rounded-xl border bg-surface-2 p-6 text-center transition-all duration-300 card-hover-glow ${COLOR_MAP[color]}`}
            >
              <Icon className="h-8 w-8" />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
