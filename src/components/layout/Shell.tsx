import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import {
  User, Calendar, Trophy, BookOpen, Gamepad2,
  Megaphone, HelpCircle, BookMarked, Menu, X,
  LogOut, ChevronRight, Vote,
} from "lucide-react"

const NAV_ITEMS = [
  { to: "/profile",       label: "My Profile",           icon: User },
  { to: "/schedule",      label: "Schedule",             icon: Calendar },
  { to: "/scores",        label: "Score & Leaderboard",  icon: Trophy },
  { to: "/library",       label: "Browse Library",       icon: BookOpen },
  { to: "/aides",         label: "Player Aides",         icon: Gamepad2 },
  { to: "/polls",         label: "Polls & Votes",        icon: Vote },
  { to: "/announcements", label: "Announcements",        icon: Megaphone },
  { to: "/faqs",          label: "FAQs",                 icon: HelpCircle },
  { to: "/guidelines",    label: "Community Guidelines", icon: BookMarked },
]

interface ShellProps {
  children: React.ReactNode
  title?: string
}

export default function Shell({ children, title }: ShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?"

  async function handleSignOut() {
    await signOut()
    navigate("/")
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-surface border-r border-border",
        "transition-transform duration-300 ease-out lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0 animate-slide-in-left" : "-translate-x-full",
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-border shrink-0">
          <img src="/assets/logo.png" alt="Playhouse Social" className="h-8 w-8 object-contain" />
          <div className="leading-tight">
            <span className="font-display text-xl tracking-wider text-brand-amber">PLAYHOUSE</span>
            <span className="font-script text-base text-brand-cyan ml-1.5">Social</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-brand-amber/15 text-brand-amber shadow-glow-sm-amber"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-brand-amber" : "group-hover:text-brand-cyan")} />
                  <span className="truncate">{label}</span>
                  {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-brand-amber/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-amber/20 text-brand-amber text-xs font-semibold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name ?? ""}`.trim() : "Player"}
              </p>
              <p className="text-xs text-muted-foreground truncate">@{profile?.username ?? "—"}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-surface px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex lg:hidden flex-1 justify-center">
            <span className="font-display text-lg tracking-wider text-brand-amber">PLAYHOUSE</span>
            <span className="font-script text-base text-brand-cyan ml-1.5">Social</span>
          </div>

          {/* Desktop title */}
          {title && (
            <h1 className="hidden lg:block font-display text-xl tracking-wider text-foreground">{title}</h1>
          )}

          <div className="ml-auto flex items-center gap-3">
            {/* Mobile close when open */}
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
