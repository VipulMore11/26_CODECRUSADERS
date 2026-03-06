"use client"

const steps = [
  {
    step: "01",
    title: "Upload Patient Records",
    description: "Securely upload medical records in any format. Our system automatically anonymizes data using UUID assignment and PII stripping.",
  },
  {
    step: "02",
    title: "AI Analysis & Extraction",
    description: "OpenOCR + LLM pipeline extracts structured data from documents. Semi-structured and unstructured data is normalized for matching.",
  },
  {
    step: "03",
    title: "Trial Matching Engine",
    description: "Rule-based and ML algorithms evaluate eligibility against inclusion/exclusion criteria from thousands of clinical trials.",
  },
  {
    step: "04",
    title: "Results & Reports",
    description: "View ranked trial recommendations with match percentages, confidence scores, and detailed explanations. Download comprehensive reports.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From document upload to trial recommendations in four simple steps
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute top-12 left-0 right-0 hidden h-0.5 bg-border lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary bg-background text-3xl font-bold text-primary">
                    {step.step}
                  </div>
                  <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-full hidden w-full lg:block">
                    <div className="h-0.5 w-full bg-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
