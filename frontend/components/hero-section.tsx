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

      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-6 py-3 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-muted-foreground">AI-Powered Healthcare Research Infrastructure</span>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-7xl lg:text-8xl mb-8">
            Match Patients to
            <span className="block text-primary"> Clinical Trials</span>
            <span className="block">with AI Precision</span>
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-pretty text-lg text-muted-foreground md:text-xl">
            Intelligent analysis of anonymized patient records matched against clinical trial criteria.
            Rule-based and ML-powered matching with transparent explanations and confidence scores.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="px-10 py-7 text-lg gap-2">
                Start Matching <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/trials">
              <Button size="lg" variant="outline" className="px-10 py-7 text-lg gap-2">
                <FileSearch className="h-5 w-5" />
                Explore Trials
              </Button>
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-base text-muted-foreground">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-success" />
              <span>UUID-Based Anonymization</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span>Explainable AI</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: "98%", label: "Match Accuracy" },
            { value: "10K+", label: "Clinical Trials" },
            { value: "500ms", label: "Avg. Analysis Time" },
            { value: "100%", label: "Data Anonymization" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
              <div className="mt-2 text-base text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
