"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Sparkles, FileSearch } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">AI-Powered Healthcare Research Infrastructure</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Match Patients to
            <span className="block text-primary"> Clinical Trials</span>
            <span className="block">with AI Precision</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Intelligent analysis of anonymized patient records matched against clinical trial criteria. 
            Rule-based and ML-powered matching with transparent explanations and confidence scores.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Start Matching <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/trials">
              <Button size="lg" variant="outline" className="gap-2">
                <FileSearch className="h-4 w-4" />
                Explore Trials
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span>UUID-Based Anonymization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Explainable AI</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: "98%", label: "Match Accuracy" },
            { value: "10K+", label: "Clinical Trials" },
            { value: "500ms", label: "Avg. Analysis Time" },
            { value: "100%", label: "Data Anonymization" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
