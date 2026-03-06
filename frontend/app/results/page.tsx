"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MatchResultCard, type MatchResult } from "@/components/match-result-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Download,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Brain,
  Shield,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

// Mock results data
const mockResults: MatchResult[] = [
  {
    trialId: "NCT001",
    trialTitle: "A Phase 3 Study of Novel CAR-T Cell Therapy for Advanced Non-Small Cell Lung Cancer",
    sponsor: "National Cancer Institute",
    phase: "Phase 3",
    location: "Boston, MA",
    matchScore: 94,
    confidenceScore: 91,
    enrollmentStatus: "Recruiting",
    estimatedDuration: "24 months",
    criteriaMatches: [
      { criterion: "Age 18-75 years", matched: true, explanation: "Patient age of 52 falls within required range" },
      { criterion: "Confirmed NSCLC diagnosis", matched: true, explanation: "Medical records confirm Stage IIIB NSCLC" },
      { criterion: "ECOG Performance Status 0-2", matched: true, explanation: "Based on reported activity levels, estimated ECOG 1" },
      { criterion: "No prior CAR-T therapy", matched: true, explanation: "No CAR-T treatment history found in records" },
      { criterion: "Adequate organ function", matched: "partial", explanation: "Recent labs needed for confirmation" },
    ],
    longTermEffects: [
      "Potential cytokine release syndrome (CRS) - typically manageable with tocilizumab",
      "Risk of neurotoxicity (ICANS) - usually reversible",
      "Long-term B-cell aplasia requiring immunoglobulin replacement",
      "Unknown long-term efficacy beyond 5 years - ongoing monitoring recommended",
    ],
    drugInfo: {
      name: "CTL019-Modified CAR-T",
      mechanism: "Genetically modified T-cells targeting CD19 antigen on cancer cells",
      knownSideEffects: ["Fever", "Fatigue", "Hypotension", "Neurological effects"],
    },
  },
  {
    trialId: "NCT002",
    trialTitle: "Efficacy of GLP-1 Receptor Agonist in Type 2 Diabetes with Cardiovascular Comorbidities",
    sponsor: "Novo Nordisk",
    phase: "Phase 2",
    location: "New York, NY",
    matchScore: 87,
    confidenceScore: 88,
    enrollmentStatus: "Recruiting",
    estimatedDuration: "18 months",
    criteriaMatches: [
      { criterion: "Type 2 Diabetes diagnosis", matched: true, explanation: "Confirmed T2D diagnosis in records" },
      { criterion: "HbA1c 7.0-10.0%", matched: true, explanation: "Last recorded HbA1c: 8.2%" },
      { criterion: "BMI 25-40 kg/m2", matched: true, explanation: "Calculated BMI: 32.4 kg/m2" },
      { criterion: "History of cardiovascular event", matched: false, explanation: "No CVD history found - may limit eligibility" },
      { criterion: "Age 40-75 years", matched: true, explanation: "Patient age meets criteria" },
    ],
    longTermEffects: [
      "Sustained weight loss typically maintained while on therapy",
      "Potential thyroid C-cell tumor risk (observed in rodent studies)",
      "Possible gallbladder-related adverse events",
      "Cardiovascular benefits may persist beyond treatment period",
    ],
    drugInfo: {
      name: "Semaglutide Extended",
      mechanism: "GLP-1 receptor agonist enhancing insulin secretion and reducing appetite",
      knownSideEffects: ["Nausea", "Diarrhea", "Constipation", "Injection site reactions"],
    },
  },
  {
    trialId: "NCT003",
    trialTitle: "Immunotherapy Combination Trial for Triple-Negative Breast Cancer",
    sponsor: "Memorial Sloan Kettering",
    phase: "Phase 2",
    location: "Houston, TX",
    matchScore: 72,
    confidenceScore: 76,
    enrollmentStatus: "Recruiting",
    estimatedDuration: "36 months",
    criteriaMatches: [
      { criterion: "Triple-negative breast cancer", matched: "partial", explanation: "Breast cancer confirmed; receptor status verification needed" },
      { criterion: "Prior chemotherapy", matched: true, explanation: "Records show prior paclitaxel treatment" },
      { criterion: "Measurable disease per RECIST 1.1", matched: "partial", explanation: "Recent imaging required for confirmation" },
      { criterion: "No autoimmune disease", matched: true, explanation: "No autoimmune conditions found in history" },
      { criterion: "Adequate bone marrow function", matched: true, explanation: "Recent CBC values within normal limits" },
    ],
    longTermEffects: [
      "Risk of immune-related adverse events affecting any organ system",
      "Potential for long-term thyroid dysfunction",
      "Possible development of type 1 diabetes (rare)",
      "Durable responses possible in subset of patients",
    ],
    drugInfo: {
      name: "Pembrolizumab + Olaparib",
      mechanism: "PD-1 checkpoint inhibitor combined with PARP inhibitor",
      knownSideEffects: ["Fatigue", "Anemia", "Pneumonitis", "Hepatitis"],
    },
  },
]

export default function ResultsPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("match")
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<MatchResult[]>([])

  useEffect(() => {
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setResults(mockResults)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore
    if (sortBy === "confidence") return b.confidenceScore - a.confidenceScore
    return 0
  })

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex min-h-[calc(100vh-200px)] items-center justify-center pt-20">
          <Card className="w-full max-w-lg mx-6">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-8 w-8 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl">Analyzing Patient Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={progress} className="h-3" />

              <div className="space-y-3">
                {[
                  { label: "Extracting medical data", done: progress > 20 },
                  { label: "Anonymizing patient records", done: progress > 40 },
                  { label: "Matching against clinical trials", done: progress > 60 },
                  { label: "Calculating confidence scores", done: progress > 80 },
                  { label: "Generating recommendations", done: progress >= 100 },
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {step.done ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <Clock className="h-5 w-5 text-muted-foreground animate-spin" />
                    )}
                    <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-muted-foreground">
                This may take a few moments...
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="mx-auto max-w-[1440px] px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Match Results</h1>
                <p className="mt-2 text-muted-foreground">
                  {results.length} clinical trials matched for patient analysis
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="match">Match Score</SelectItem>
                    <SelectItem value="confidence">Confidence Score</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export All
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{results.filter(r => r.matchScore >= 80).length}</p>
                  <p className="text-sm text-muted-foreground">High Matches (80%+)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(results.reduce((acc, r) => acc + r.confidenceScore, 0) / results.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg. Confidence</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-sm text-muted-foreground">Data Anonymized</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Patient Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Anonymous ID</p>
                  <Badge variant="secondary" className="mt-1 font-mono">PT-X8K2M9F4</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Primary Conditions</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline">Cancer</Badge>
                    <Badge variant="outline">Type 2 Diabetes</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Boston, MA</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Analysis Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results List */}
          <div className="space-y-6">
            {sortedResults.map((result, index) => (
              <MatchResultCard key={result.trialId} result={result} rank={index + 1} />
            ))}
          </div>

          {/* Download Full Report */}
          <Card className="mt-8 border-primary/30 bg-primary/5">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Download className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">Download Complete Report</h3>
                <p className="mt-1 text-muted-foreground">
                  Get a comprehensive PDF report with all match details, explanations, and recommendations
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </Button>
                <Button size="lg" variant="outline">
                  Export as CSV
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
