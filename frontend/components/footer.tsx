import Link from "next/link"
import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">TrialMatch<span className="text-primary">AI</span></span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              AI-powered clinical trial eligibility and matching engine. 
              Strengthening healthcare research infrastructure through automation, accuracy, and fairness.
            </p>
          </div>

          <div>
            <h4 className="font-semibold">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              <li><Link href="/trials" className="hover:text-foreground">Clinical Trials</Link></li>
              <li><Link href="/analyze" className="hover:text-foreground">Health Analysis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-foreground">HIPAA Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 TrialMatchAI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for Healthcare Hackathon
          </p>
        </div>
      </div>
    </footer>
  )
}
