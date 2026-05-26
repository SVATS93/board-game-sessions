import { useState } from "react"
import Shell from "@/components/layout/Shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"

export default function ProfilePage() {
  const { profile, user } = useAuth()
  const { toast } = useToast()

  const [firstName, setFirstName] = useState(profile?.first_name ?? "")
  const [lastName, setLastName] = useState(profile?.last_name ?? "")
  const [mobile, setMobile] = useState(profile?.mobile ?? "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?"
  const joinedDate = profile?.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "—"

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    try {
      // Phase 2: Supabase — types auto-generated via `npx supabase gen types` once project is live
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName, mobile, updated_at: new Date().toISOString() })
        .eq("id", user!.id)
      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      toast({ variant: "destructive", title: "Save failed", description: "Please try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Shell title="My Profile">
      <div className="max-w-lg space-y-8">
        {/* Avatar + name header */}
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 shrink-0 rounded-full bg-brand-amber/15 border-2 border-brand-amber flex items-center justify-center font-display text-2xl text-brand-amber shadow-glow-sm-amber">
            {initials}
          </div>
          <div>
            <p className="font-display text-2xl tracking-wide text-foreground">
              {[firstName, lastName].filter(Boolean).join(" ") || "Your Name"}
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">
              Gamer since <span className="text-brand-cyan">{joinedDate}</span>
            </p>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display text-xl tracking-wider text-foreground">My Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fname">First name</Label>
              <Input id="fname" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" className="bg-muted border-border" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lname">Last name</Label>
              <Input id="lname" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className="bg-muted border-border" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="mobile">Mobile number</Label>
            <Input id="mobile" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+91 98765 43210" className="bg-muted border-border" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email ?? ""} disabled className="bg-muted border-border opacity-60 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Email is managed through your account and cannot be changed here.</p>
          </div>
          <div className="flex items-center gap-4 pt-1">
            <Button type="submit" disabled={saving} className="bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold shadow-glow-sm-amber">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update profile
            </Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-brand-green animate-fade-in">
                <CheckCircle2 className="h-4 w-4" /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>
    </Shell>
  )
}
