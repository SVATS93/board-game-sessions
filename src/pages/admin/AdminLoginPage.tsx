import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // Check if this user has an admin role
      const { data: adminData } = await supabase.auth.getUser()
      if (!adminData.user) throw new Error("Login failed")

      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("role")
        .eq("user_id", adminData.user.id)
        .single()

      if (!adminRow) {
        await supabase.auth.signOut()
        throw new Error("You don't have admin access.")
      }

      navigate("/admin/god-mode")
    } catch (err: unknown) {
      toast({ variant: "destructive", title: "Access denied", description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-brand-cyan/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded-full bg-brand-amber/10 flex items-center justify-center border border-brand-amber/20">
              <ShieldCheck className="h-7 w-7 text-brand-amber" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-widest text-brand-amber">ADMIN</h1>
            <p className="font-script text-xl text-brand-cyan -mt-1">God Mode</p>
          </div>
          <p className="text-sm text-muted-foreground">Authorised access only</p>
        </div>

        <div className="rounded-xl border border-border bg-surface-2 p-6 space-y-4 card-glow-cyan">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required className="bg-muted border-border" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="bg-muted border-border pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold shadow-glow-sm-cyan">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enter God Mode
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          <Link to="/" className="text-brand-cyan/70 hover:text-brand-cyan transition-colors">
            ← Back to player login
          </Link>
        </p>
      </div>
    </div>
  )
}
