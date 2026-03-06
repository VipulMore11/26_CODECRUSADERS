"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building2,
  Calendar,
  Users,
  Sparkles,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Heart,
  Brain,
} from "lucide-react"

interface TrialMatch {
  id: string
  name: string
  phase: string
  matchPercentage: number
  confidenceScore: number
  location: string
  distance: string
  sponsor: string
  description: string
  matchedCriteria: string[]
  unmatchedCriteria: string[]
  potentialRisks: string[]
  timeline: string
  compensation: string
}

interface PatientSummary {
  patientId: string
  age: number
  gender: string
  conditions: string[]
  medications: string[]
  allergies: string[]
}

const mockTrials: TrialMatch[] = [
  {
    id: "NCT05123456",
    name: "STRIDE-DM: Novel GLP-1 Agonist for Type 2 Diabetes with Cardiovascular Benefits",
    phase: "Phase 3",
    matchPercentage: 94,
    confidenceScore: 92,
    location: "Boston, MA",
    distance: "12 miles",
    sponsor: "BioMedical Research Institute",
    description: "A randomized, double-blind study evaluating a novel GLP-1 receptor agonist in patients with Type 2 Diabetes and established cardiovascular disease.",
    matchedCriteria: [
      "Age 45-70 years",
      "Diagnosed with Type 2 Diabetes",
      "HbA1c between 7.0% and 10.0%",
      "Established cardiovascular risk factors",
    ],
    unmatchedCriteria: ["BMI > 40 (requires verification)"],
    potentialRisks: ["Mild to moderate nausea", "Injection site reactions"],
    timeline: "12 months",
    compensation: "$150 per visit",
  },
  {
    id: "NCT05234567",
    name: "HEART-SAFE: Combination Therapy for Diabetes and Hypertension",
    phase: "Phase 2",
    matchPercentage: 87,
    confidenceScore: 88,
    location: "Chicago, IL",
    distance: "45 miles",
    sponsor: "CardioMetabolic Research Center",
    description: "Evaluating a novel combination therapy targeting both blood glucose and blood pressure control in patients with comorbid diabetes and hypertension.",
    matchedCriteria: [
      "Type 2 Diabetes diagnosis",
      "Hypertension diagnosis",
      "Age 40-75 years",
    ],
    unmatchedCriteria: ["No history of heart failure (requires verification)"],
    potentialRisks: ["Dizziness from blood pressure changes", "Electrolyte imbalances"],
    timeline: "18 months",
    compensation: "$200 per visit",
  },
  {
    id: "NCT05345678",
    name: "LIPID-PLUS: Advanced Cholesterol Management in Diabetic Patients",
    phase: "Phase 3",
    matchPercentage: 82,
    confidenceScore: 85,
    location: "San Francisco, CA",
    distance: "Remote available",
    sponsor: "Lipid Research Foundation",
    description: "Testing a next-generation PCSK9 inhibitor combined with statin therapy for aggressive LDL reduction in high-risk diabetic patients.",
    matchedCriteria: [
      "Type 2 Diabetes",
      "High cardiovascular risk",
      "Age 45-80 years",
    ],
    unmatchedCriteria: ["No prior PCSK9 inhibitor use"],
    potentialRisks: ["Injection site reactions", "Muscle pain"],
    timeline: "24 months",
    compensation: "$175 per visit",
  },
  {
    id: "NCT05456789",
    name: "RENAL-PROTECT: Kidney Protection in Diabetic Patients",
    phase: "Phase 2",
    matchPercentage: 76,
    confidenceScore: 79,
    location: "Houston, TX",
    distance: "120 miles",
    sponsor: "Nephrology Research Institute",
    description: "Novel therapy targeting renal protection in patients with diabetes and early kidney involvement.",
    matchedCriteria: [
      "Type 2 Diabetes",
      "On ACE inhibitor or ARB therapy",
    ],
    unmatchedCriteria: ["Mild proteinuria (requires urine test)"],
    potentialRisks: ["Changes in kidney function markers", "Blood pressure fluctuations"],
    timeline: "36 months",
    compensation: "$250 per visit",
  },
]

const mockPatient: PatientSummary = {
  patientId: "PT-A7B3C9E2",
  age: 54,
  gender: "Male",
  conditions: ["Type 2 Diabetes", "Hypertension", "High Cholesterol"],
  medications: ["Metformin 500mg", "Lisinopril 10mg", "Atorvastatin 20mg"],
  allergies: ["Penicillin", "Sulfa drugs"],
}

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [expandedTrial, setExpandedTrial] = useState<string | null>(null)
  const [patientData, setPatientData] = useState<PatientSummary>(mockPatient)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Check for patient data in session storage
      const stored = sessionStorage.getItem("patientData")
      if (stored) {
        const data = JSON.parse(stored)
        setPatientData({
          patientId: data.patientId || mockPatient.patientId,
          age: data.age || mockPatient.age,
          gender: data.gender || mockPatient.gender,
          conditions: data.conditions || mockPatient.conditions,
          medications: data.medications || mockPatient.medications,
          allergies: data.allergies || mockPatient.allergies,
        })
      }
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-8 w-8 animate-pulse text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Analyzing Patient Data</h2>
            <p className="mb-6 text-muted-foreground">Finding the best clinical trial matches...</p>
            <Progress value={66} className="mx-auto w-64" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 gap-2">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Analysis Complete
          </Badge>
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Clinical Trial Matches
          </h1>
          <p className="text-muted-foreground">
            Found {mockTrials.length} potential clinical trials based on your patient profile
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Patient Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Patient Summary
                </CardTitle>
                <CardDescription>
                  Anonymized ID: <span className="font-mono font-semibold text-primary">{patientData.patientId}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{patientData.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize text-foreground">{patientData.gender}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {patientData.conditions.map((condition, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Medications</p>
                  <div className="flex flex-wrap gap-1">
                    {patientData.medications.map((med, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>

                {patientData.allergies.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {patientData.allergies.map((allergy, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <Button variant="outline" className="w-full gap-2" asChild>
                    <Link href="/report">
                      <FileText className="h-4 w-4" />
                      Generate Full Report
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trial Results */}
          <div className="space-y-4 lg:col-span-2">
            {mockTrials.map((trial) => (
              <TrialMatchCard
                key={trial.id}
                trial={trial}
                isExpanded={expandedTrial === trial.id}
                onToggle={() => setExpandedTrial(expandedTrial === trial.id ? null : trial.id)}
              />
            ))}

            {/* CTA Card */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Explore All Trials</h3>
                    <p className="text-sm text-muted-foreground">
                      Browse 2,800+ active trials on our interactive map
                    </p>
                  </div>
                </div>
                <Button asChild className="gap-2">
                  <Link href="/trials/map">
                    View Trial Map
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function TrialMatchCard({
  trial,
  isExpanded,
  onToggle,
}: {
  trial: TrialMatch
  isExpanded: boolean
  onToggle: () => void
}) {
  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-500"
    if (percentage >= 80) return "text-blue-500"
    if (percentage >= 70) return "text-yellow-500"
    return "text-orange-500"
  }

  const getPhaseColor = (phase: string) => {
    if (phase === "Phase 3") return "bg-green-500"
    if (phase === "Phase 2") return "bg-blue-500"
    return "bg-purple-500"
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {trial.id}
              </Badge>
              <Badge className={`${getPhaseColor(trial.phase)} text-white`}>
                {trial.phase}
              </Badge>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getMatchColor(trial.matchPercentage)}`}>
                {trial.matchPercentage}%
              </p>
              <p className="text-xs text-muted-foreground">Match Score</p>
            </div>
          </div>

          <Link href={`/results/briefinfo?id=${trial.id}`} className="hover:underline decoration-primary/50 underline-offset-4">
            <h3 className="mb-2 text-lg font-semibold text-foreground">{trial.name}</h3>
          </Link>
          <p className="mb-4 text-sm text-muted-foreground">{trial.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {trial.location}
              <span className="text-xs">({trial.distance})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {trial.sponsor}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {trial.timeline}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 border-t bg-muted/50 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {isExpanded ? (
            <>
              Hide Details
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              View Details
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t bg-muted/30 p-6">
            <Tabs defaultValue="eligibility" className="w-full">
              <TabsList className="w-full grid-cols-3">
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="eligibility" className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Matched Criteria
                  </h4>
                  <ul className="space-y-1">
                    {trial.matchedCriteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {trial.unmatchedCriteria.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      Requires Verification
                    </h4>
                    <ul className="space-y-1">
                      {trial.unmatchedCriteria.map((criteria, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="risks" className="mt-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Potential Risks</h4>
                  <ul className="space-y-1">
                    {trial.potentialRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">{trial.timeline}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compensation</p>
                    <p className="font-medium text-foreground">{trial.compensation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="font-medium text-foreground">{trial.confidenceScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{trial.location}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="gap-2">
                Express Interest
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                View on ClinicalTrials.gov
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
