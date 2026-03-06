"use client"

import {
  FileText,
  Brain,
  MapPin,
  Download,
  Shield,
  Stethoscope,
  ScanLine,
  BarChart3
} from "lucide-react"

const features = [
  {
    icon: ScanLine,
    title: "Multi-Format Input",
    description: "Upload medical records in any format - PDFs, images, scanned documents. Our OCR + LLM pipeline extracts and structures the data automatically.",
  },
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Advanced rule-based and ML algorithms analyze patient data against trial inclusion/exclusion criteria for precise eligibility matching.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scores",
    description: "Every match comes with detailed confidence metrics, percentage scores, and transparent explanations of what criteria matched or didn't.",
  },
  {
    icon: MapPin,
    title: "Geographic Filters",
    description: "Filter clinical trials by location, distance, and region. Find trials that are accessible and convenient for patients.",
  },
  {
    icon: Stethoscope,
    title: "Long-term Impact Analysis",
    description: "AI-generated reports on potential long-term effects based on the drug being tested, helping patients make informed decisions.",
  },
  {
    icon: Shield,
    title: "Complete Anonymization",
    description: "Patient data is assigned UUIDs, with all PII stripped using regex patterns. Zero association between records and patient identity.",
  },
  {
    icon: Download,
    title: "Exportable Reports",
    description: "Download comprehensive reports in PDF, CSV, or JSON formats. Share findings with healthcare providers securely.",
  },
  {
    icon: FileText,
    title: "Medical Procedure Analysis",
    description: "Beyond trials - analyze medical reports to explore different treatment procedures with success rates and feasibility metrics.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-card/30 py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Comprehensive Trial Matching Platform
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to connect patients with the right clinical trials, powered by cutting-edge AI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-10 transition-all hover:border-primary/50 hover:bg-card/80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-semibold">{feature.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
