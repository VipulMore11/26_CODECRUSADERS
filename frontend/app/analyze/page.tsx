"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search,
  Pill,
  Stethoscope,
  Activity,
  Brain,
  Heart,
  Dna,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  FileText,
} from "lucide-react"

interface Treatment {
  id: string
  name: string
  category: string
  type: "Medication" | "Procedure" | "Therapy" | "Lifestyle" | "Device"
  description: string
  successRate: number
  duration: string
  costEstimate: string
  benefits: string[]
  risks: string[]
  sideEffects: string[]
  alternatives: string[]
  conditions: string[]
  aiInsight: string
}

const treatments: Treatment[] = [
  {
    id: "tx-001",
    name: "GLP-1 Receptor Agonists",
    category: "Diabetes",
    type: "Medication",
    description: "Injectable medications that help regulate blood sugar by mimicking the GLP-1 hormone. Includes options like semaglutide and tirzepatide.",
    successRate: 85,
    duration: "Ongoing treatment",
    costEstimate: "$800-1500/month",
    benefits: ["Significant weight loss", "Improved blood sugar control", "Cardiovascular protection", "Once-weekly dosing available"],
    risks: ["Gastrointestinal side effects", "Rare thyroid concerns", "Pancreatitis risk"],
    sideEffects: ["Nausea", "Vomiting", "Diarrhea", "Constipation"],
    alternatives: ["SGLT2 inhibitors", "DPP-4 inhibitors", "Insulin therapy"],
    conditions: ["Type 2 Diabetes", "Obesity", "Pre-diabetes"],
    aiInsight: "Based on recent clinical data, GLP-1 agonists show 20-30% better outcomes for patients with concurrent cardiovascular disease compared to traditional therapies.",
  },
  {
    id: "tx-002",
    name: "Immunotherapy (PD-1/PD-L1 Inhibitors)",
    category: "Oncology",
    type: "Medication",
    description: "Checkpoint inhibitors that help the immune system recognize and attack cancer cells. Includes pembrolizumab, nivolumab, and others.",
    successRate: 45,
    duration: "6-24 months typically",
    costEstimate: "$12,000-20,000/month",
    benefits: ["Durable responses", "Works across multiple cancer types", "May lead to long-term remission", "Better quality of life than chemo"],
    risks: ["Immune-related adverse events", "Pneumonitis", "Colitis", "Hepatitis"],
    sideEffects: ["Fatigue", "Skin rash", "Diarrhea", "Thyroid dysfunction"],
    alternatives: ["Chemotherapy", "Targeted therapy", "CAR-T cell therapy", "Radiation"],
    conditions: ["Non-Small Cell Lung Cancer", "Melanoma", "Renal Cell Carcinoma", "Bladder Cancer"],
    aiInsight: "Patients with high PD-L1 expression (>50%) show response rates up to 60%. Biomarker testing is recommended before treatment initiation.",
  },
  {
    id: "tx-003",
    name: "Cognitive Behavioral Therapy (CBT)",
    category: "Mental Health",
    type: "Therapy",
    description: "Structured psychotherapy that helps identify and change negative thought patterns and behaviors. Effective for anxiety, depression, and other conditions.",
    successRate: 75,
    duration: "12-20 weeks typically",
    costEstimate: "$100-250/session",
    benefits: ["No medication side effects", "Long-lasting results", "Teaches coping skills", "Can be combined with medication"],
    risks: ["Requires commitment", "May initially increase distress", "Results vary"],
    sideEffects: ["Temporary emotional discomfort", "Time commitment required"],
    alternatives: ["Medication (SSRIs)", "Dialectical Behavior Therapy", "Mindfulness-based therapy", "EMDR"],
    conditions: ["Depression", "Anxiety Disorders", "PTSD", "OCD", "Insomnia"],
    aiInsight: "CBT combined with medication shows 30% better outcomes for moderate-to-severe depression compared to either treatment alone.",
  },
  {
    id: "tx-004",
    name: "Transcatheter Aortic Valve Replacement (TAVR)",
    category: "Cardiovascular",
    type: "Procedure",
    description: "Minimally invasive procedure to replace a narrowed aortic valve without open-heart surgery.",
    successRate: 95,
    duration: "1-2 hour procedure, 3-5 day recovery",
    costEstimate: "$50,000-80,000",
    benefits: ["Minimally invasive", "Faster recovery", "Lower surgical risk", "Suitable for high-risk patients"],
    risks: ["Stroke", "Vascular complications", "Pacemaker requirement", "Valve leak"],
    sideEffects: ["Temporary fatigue", "Soreness at access site", "Irregular heartbeat"],
    alternatives: ["Open heart surgery (SAVR)", "Balloon valvuloplasty", "Medical management"],
    conditions: ["Aortic Stenosis", "Aortic Valve Disease"],
    aiInsight: "For patients over 70, TAVR shows similar long-term outcomes to surgical replacement with significantly shorter hospital stays.",
  },
  {
    id: "tx-005",
    name: "Deep Brain Stimulation (DBS)",
    category: "Neurology",
    type: "Device",
    description: "Surgical implant of electrodes in specific brain areas to deliver electrical stimulation for movement disorders.",
    successRate: 70,
    duration: "Permanent implant, battery replacement every 3-5 years",
    costEstimate: "$35,000-100,000",
    benefits: ["Significant symptom reduction", "Adjustable settings", "Reduces medication needs", "Reversible"],
    risks: ["Surgical complications", "Infection", "Hardware issues", "Speech problems"],
    sideEffects: ["Tingling sensations", "Mood changes", "Balance issues during adjustment"],
    alternatives: ["Medication optimization", "Physical therapy", "Focused ultrasound", "Lesioning surgery"],
    conditions: ["Parkinson's Disease", "Essential Tremor", "Dystonia", "OCD"],
    aiInsight: "Patients who receive DBS within 7 years of Parkinson's diagnosis show better motor outcomes than those treated later in disease progression.",
  },
  {
    id: "tx-006",
    name: "Mediterranean Diet Protocol",
    category: "Cardiovascular",
    type: "Lifestyle",
    description: "Evidence-based dietary pattern emphasizing olive oil, fish, nuts, fruits, vegetables, and whole grains.",
    successRate: 65,
    duration: "Lifelong lifestyle change",
    costEstimate: "$50-100/week additional",
    benefits: ["Heart disease risk reduction", "Weight management", "Anti-inflammatory effects", "Cognitive benefits"],
    risks: ["Requires dietary changes", "May not suit all preferences"],
    sideEffects: ["Initial adjustment period", "Increased cooking time"],
    alternatives: ["DASH diet", "Plant-based diet", "Low-carb diet", "Intermittent fasting"],
    conditions: ["Heart Disease", "Hypertension", "Type 2 Diabetes", "Cognitive Decline Prevention"],
    aiInsight: "Studies show 30% reduction in cardiovascular events for high-risk patients following Mediterranean diet with extra virgin olive oil supplementation.",
  },
]

const categories = [...new Set(treatments.map(t => t.category))]
const types = [...new Set(treatments.map(t => t.type))]

const categoryIcons: Record<string, React.ReactNode> = {
  Diabetes: <Activity className="h-5 w-5" />,
  Oncology: <Dna className="h-5 w-5" />,
  "Mental Health": <Brain className="h-5 w-5" />,
  Cardiovascular: <Heart className="h-5 w-5" />,
  Neurology: <Brain className="h-5 w-5" />,
}

export default function AnalyzePage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null)

  const filteredTreatments = treatments.filter(treatment => {
    if (search) {
      const searchLower = search.toLowerCase()
      if (!treatment.name.toLowerCase().includes(searchLower) &&
        !treatment.description.toLowerCase().includes(searchLower) &&
        !treatment.conditions.some(c => c.toLowerCase().includes(searchLower))) {
        return false
      }
    }
    if (selectedCategory !== "all" && treatment.category !== selectedCategory) {
      return false
    }
    return true
  })

  if (selectedTreatment) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <TreatmentDetail treatment={selectedTreatment} onBack={() => setSelectedTreatment(null)} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Analysis
          </Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Procedure Analysis Tool
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Evaluate medical procedures with AI-powered insights. Analyze success rates,
            recovery times, costs, and make informed decisions about your treatment options.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search treatments, conditions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Categories
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {categoryIcons[category]}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* CTA Banner */}
        <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Get Personalized Treatment Recommendations</h3>
                <p className="text-sm text-muted-foreground">Upload your medical records for AI-powered analysis</p>
              </div>
            </div>
            <Button asChild className="gap-2">
              <Link href="/analysisdashboard">
                Start Matching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Treatment Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTreatments.map(treatment => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              onClick={() => setSelectedTreatment(treatment)}
            />
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-foreground">No treatments found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function TreatmentCard({ treatment, onClick }: { treatment: Treatment; onClick: () => void }) {
  const typeColors: Record<string, string> = {
    Medication: "bg-blue-500",
    Procedure: "bg-green-500",
    Therapy: "bg-purple-500",
    Lifestyle: "bg-orange-500",
    Device: "bg-cyan-500",
  }

  return (
    <Card className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{treatment.category}</Badge>
            <Badge className={`${typeColors[treatment.type]} text-white`}>{treatment.type}</Badge>
          </div>
        </div>

        <h3 className="mb-2 text-lg font-semibold text-foreground">{treatment.name}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{treatment.description}</p>

        <div className="mb-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-medium text-foreground">{treatment.successRate}%</span>
          </div>
          <Progress value={treatment.successRate} className="h-2" />
        </div>

        <div className="flex flex-wrap gap-1">
          {treatment.conditions.slice(0, 2).map(condition => (
            <Badge key={condition} variant="outline" className="text-xs">
              {condition}
            </Badge>
          ))}
          {treatment.conditions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{treatment.conditions.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TreatmentDetail({ treatment, onBack }: { treatment: Treatment; onBack: () => void }) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowRight className="h-4 w-4 rotate-180" />
        Back to treatments
      </Button>

      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{treatment.category}</Badge>
                <Badge className="bg-primary text-primary-foreground">{treatment.type}</Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl">{treatment.name}</CardTitle>
              <CardDescription className="mt-2 text-base">{treatment.description}</CardDescription>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-4xl font-bold text-primary">{treatment.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-medium text-foreground">{treatment.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cost Estimate</p>
                <p className="font-medium text-foreground">{treatment.costEstimate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Evidence Level</p>
                <p className="font-medium text-foreground">High Quality</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insight */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Insight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{treatment.aiInsight}</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-success">
              <CheckCircle2 className="h-5 w-5" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {treatment.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 rounded-lg bg-success/5 p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Risks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Risks & Side Effects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="risks">
              <AccordionItem value="risks" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium">Potential Risks</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {treatment.risks.map((risk, index) => (
                      <li key={index} className="flex items-start gap-2 rounded-lg bg-destructive/5 p-3">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span className="text-foreground">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="side-effects" className="border-none">
                <AccordionTrigger className="py-2 text-sm font-medium">Common Side Effects</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {treatment.sideEffects.map((effect, index) => (
                      <Badge key={index} variant="secondary">{effect}</Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Applicable Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Applicable Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {treatment.conditions.map((condition, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {condition}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alternatives */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alternative Treatments</CardTitle>
          <CardDescription>Other options you may want to discuss with your healthcare provider</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {treatment.alternatives.map((alt, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  {index + 1}
                </div>
                <span className="font-medium text-foreground">{alt}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex items-start gap-4 py-4">
          <Shield className="h-6 w-6 shrink-0 text-warning" />
          <div>
            <p className="font-medium text-foreground">Medical Disclaimer</p>
            <p className="text-sm text-muted-foreground">
              This information is for educational purposes only and should not replace professional medical advice.
              Always consult with a qualified healthcare provider before starting any treatment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild className="flex-1 gap-2">
          <Link href="/analysisdashboard">
            <FileText className="h-4 w-4" />
            Check Compatibility with My Records
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 gap-2">
          <Link href="/trials">
            <Search className="h-4 w-4" />
            Find Related Clinical Trials
          </Link>
        </Button>
      </div>
    </div>
  )
}
