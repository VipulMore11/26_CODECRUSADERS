"use client"

import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    number: "01",
    title: "Upload Medical Records",
    description: "Upload patient health records in any format. Our system accepts PDFs, images, scans, and structured data files.",
  },
  {
    number: "02",
    title: "AI Data Extraction",
    description: "Our OCR + LLM pipeline extracts and anonymizes all relevant medical information, assigning a secure UUID.",
  },
  {
    number: "03",
    title: "Intelligent Matching",
    description: "ML algorithms analyze the data against thousands of clinical trial criteria to find the best matches.",
  },
  {
    number: "04",
    title: "Review & Export",
    description: "View ranked matches with confidence scores, eligibility explanations, and download comprehensive reports.",
  },
]

export function HowItWorks() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, secure, and{" "}
            <span className="text-primary">transparent process</span>
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From upload to match in minutes. Our streamlined workflow ensures 
            fast, accurate results while maintaining the highest privacy standards.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className="relative border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="mb-4 text-5xl font-bold text-primary/20">{step.number}</div>
                <h4 className="mb-2 text-lg font-semibold">{step.title}</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 hidden h-px w-8 bg-gradient-to-r from-primary/50 to-transparent lg:block" 
                  style={{ transform: 'translateX(100%) translateY(-50%)' }}
                />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
