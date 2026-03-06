import Link from "next/link"
import { Activity } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="mx-auto max-w-[1600px] px-8 py-20">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">TrialMatch<span className="text-primary">AI</span></span>
            </Link>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              AI-powered clinical trial eligibility and matching engine.
              Strengthening healthcare research infrastructure through automation, accuracy, and fairness.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold">Platform</h4>
            <ul className="mt-6 space-y-4 text-base text-muted-foreground">
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/trials" className="hover:text-primary transition-colors">Clinical Trials</Link></li>
              <li><Link href="/analyze" className="hover:text-primary transition-colors">Health Analysis</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold">Legal</h4>
            <ul className="mt-6 space-y-4 text-base text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">HIPAA Compliance</Link></li>
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
