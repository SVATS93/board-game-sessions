import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"

type Mode = "signin" | "signup" | "reset"

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate("/profile")
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { first_name: firstName, last_name: lastName } },
        })
        if (error) throw error
        toast({ title: "Check your email", description: "We've sent you a confirmation link." })
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/update-password`,
        })
        if (error) throw error
        toast({ title: "Reset email sent", description: "Check your inbox for a password reset link." })
        setMode("signin")
      }
    } catch (err: unknown) {
      toast({ variant: "destructive", title: "Error", description: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/profile` },
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand-amber/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-brand-cyan/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img src="/assets/logo.png" alt="Playhouse Social" className="h-16 w-16 object-contain" />
          </div>
          <div>
            <h1 className="font-display text-4xl tracking-widest text-brand-amber">PLAYHOUSE</h1>
            <p className="font-script text-2xl text-brand-cyan -mt-1">Social</p>
          </div>
          <p className="text-sm text-muted-foreground">Kidulting made fun.</p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-surface-2 p-6 space-y-5 card-glow-amber">
          {/* Mode toggle */}
          {mode !== "reset" && (
            <div className="flex rounded-lg border border-border bg-muted p-1 gap-1">
              {(["signin", "signup"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    mode === m
                      ? "bg-brand-amber text-black shadow-glow-sm-amber"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {mode === "reset" && (
            <div>
              <h2 className="font-semibold text-foreground">Reset password</h2>
              <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first">First name</Label>
                  <Input id="first" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Rohit" required className="bg-muted border-border" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last">Last name</Label>
                  <Input id="last" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="S." className="bg-muted border-border" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="bg-muted border-border" />
            </div>

            {mode !== "reset" && (
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-muted border-border pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {mode === "signin" && (
                  <button type="button" onClick={() => setMode("reset")} className="text-xs text-brand-cyan hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-brand-amber hover:bg-brand-amber/90 text-black font-semibold shadow-glow-sm-amber">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>

          {mode !== "reset" && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-surface-2 px-2">or</span></div>
              </div>
              <Button type="button" variant="outline" onClick={handleGoogle} className="w-full border-border hover:bg-muted">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </>
          )}

          {mode === "reset" && (
            <button type="button" onClick={() => setMode("signin")} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to sign in
            </button>
          )}
        </div>

        {/* Admin link */}
        <p className="text-center text-xs text-muted-foreground">
          Admin?{" "}
          <Link to="/admin" className="text-brand-amber/70 hover:text-brand-amber transition-colors">
            Sign in here →
          </Link>
        </p>
      </div>
    </div>
  )
}
