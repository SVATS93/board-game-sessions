import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function ManagePollsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/god-mode" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to God Mode
        </Link>
        <div className="rounded-xl border border-border bg-surface-2 p-8 text-center">
          <h1 className="font-display text-3xl text-brand-amber mb-2">ManagePolls</h1>
          <p className="text-muted-foreground">Coming soon — building this screen next.</p>
        </div>
      </div>
    </div>
  )
}
