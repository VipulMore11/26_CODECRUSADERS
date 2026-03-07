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
  Sparkles,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  Heart,
  Brain,
  Clock,
  Beaker,
  Pill,
  Activity,
} from "lucide-react"
import type { ApiResponse, TrialMatch } from "@/lib/api"
import { analyzeFile, analyzePatient } from "@/lib/api"

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedTrial, setExpandedTrial] = useState<string | null>(null)
  const [apiData, setApiData] = useState<ApiResponse | null>(null)
  const [progressValue, setProgressValue] = useState(10)

  useEffect(() => {
    // Animate the progress bar while waiting
    const progressInterval = setInterval(() => {
      setProgressValue((prev) => (prev >= 90 ? 90 : prev + Math.random() * 8))
    }, 500)

    async function fetchData() {
      // If we already have a cached response, use it
      const cached = sessionStorage.getItem("apiResponse")
      if (cached) {
        setApiData(JSON.parse(cached))
        setProgressValue(100)
        setLoading(false)
        clearInterval(progressInterval)
        return
      }

      const analysisType = sessionStorage.getItem("analysisType")

      try {
        let response: ApiResponse | null = null

        if (analysisType === "file") {
          const dataUrl = sessionStorage.getItem("pendingFile")
          const fileName = sessionStorage.getItem("pendingFileName") || "upload"
          const fileType = sessionStorage.getItem("pendingFileType") || "application/octet-stream"
          if (dataUrl) {
            // Convert base64 data URL back to File
            const res = await fetch(dataUrl)
            const blob = await res.blob()
            const file = new File([blob], fileName, { type: fileType })
            response = await analyzeFile(file)
            sessionStorage.removeItem("pendingFile")
            sessionStorage.removeItem("pendingFileName")
            sessionStorage.removeItem("pendingFileType")
          }
        } else if (analysisType === "manual") {
          const pendingData = sessionStorage.getItem("pendingPatientData")
          if (pendingData) {
            const payload = JSON.parse(pendingData)
            response = await analyzePatient(payload)
            sessionStorage.removeItem("pendingPatientData")
          }
        }

        if (response) {
          sessionStorage.setItem("apiResponse", JSON.stringify(response))
          setApiData(response)
        }
      } catch (err) {
        setError("Failed to analyze patient data. Please try again.")
      } finally {
        setProgressValue(100)
        setLoading(false)
        clearInterval(progressInterval)
      }
    }

    fetchData()
    return () => clearInterval(progressInterval)
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
            <Progress value={progressValue} className="mx-auto w-64" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!apiData) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              {error || "No Analysis Data"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {error
                ? "The API could not be reached or returned an error."
                : "Please submit patient data from the dashboard first."}
            </p>
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const { patient, trial_matches, report, processing_time_ms, workflow_id } = apiData

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
            Found {trial_matches.length} potential clinical trial{trial_matches.length !== 1 ? "s" : ""} based on your patient profile
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Processed in {(processing_time_ms / 1000).toFixed(1)}s
            </span>
            <span className="font-mono">Workflow: {workflow_id}</span>
            <span className="font-mono">Report: {report.report_id}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Patient Summary Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-primary" />
                  Patient Summary
                </CardTitle>
                <CardDescription>
                  ID: <span className="font-mono font-semibold text-primary">{patient.patient_id}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{patient.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium capitalize text-foreground">{patient.gender}</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.conditions.map((condition, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Medications</p>
                  <div className="flex flex-wrap gap-1">
                    {patient.medications.map((med, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {med}
                      </Badge>
                    ))}
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">Allergies</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, i) => (
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

            {/* Executive Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.patient_summary}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trial Results */}
          <div className="space-y-4 lg:col-span-2">
            {/* Recommendations Banner */}
            <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="py-5">
                <h3 className="mb-3 font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {report.trial_recommendations.map((rec) => (
                    <div key={rec.trial_id} className="flex items-start gap-3 text-sm">
                      <Badge
                        variant={rec.recommendation === "Strongly Recommended" ? "default" : "secondary"}
                        className="shrink-0 text-xs"
                      >
                        {rec.recommendation}
                      </Badge>
                      <div>
                        <span className="font-medium text-foreground">{rec.trial_id}</span>
                        <span className="text-muted-foreground"> — {rec.rationale}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trial Cards */}
            {trial_matches.map((trial) => (
              <TrialMatchCard
                key={trial.trial_id}
                trial={trial}
                isExpanded={expandedTrial === trial.trial_id}
                onToggle={() =>
                  setExpandedTrial(expandedTrial === trial.trial_id ? null : trial.trial_id)
                }
              />
            ))}

            {/* Risk Summary Card */}
            <Card className="border-orange-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Risk Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {report.risk_summary}
                </p>
              </CardContent>
            </Card>

            {/* Conclusion Card */}
            <Card className="border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Conclusion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {report.conclusion}
                </p>
              </CardContent>
            </Card>

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
                      Browse active trials on our interactive map
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
  const matchPercent = Math.round(trial.match_score * 100)
  const confidencePercent = Math.round(trial.confidence_score * 100)

  const getMatchColor = (pct: number) => {
    if (pct >= 90) return "text-green-500"
    if (pct >= 80) return "text-blue-500"
    if (pct >= 70) return "text-yellow-500"
    return "text-orange-500"
  }

  const getPhaseColor = (phase: string) => {
    if (phase.includes("3")) return "bg-green-500"
    if (phase.includes("2")) return "bg-blue-500"
    if (phase.includes("4")) return "bg-purple-500"
    return "bg-indigo-500"
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {trial.trial_id}
              </Badge>
              <Badge className={`${getPhaseColor(trial.phase)} text-white`}>
                {trial.phase}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {trial.study_type}
              </Badge>
              {trial.is_eligible && (
                <Badge variant="default" className="gap-1 bg-green-600 text-xs">
                  <CheckCircle2 className="h-3 w-3" />
                  Eligible
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${getMatchColor(matchPercent)}`}>
                {matchPercent}%
              </p>
              <p className="text-xs text-muted-foreground">Match Score</p>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground">{trial.trial_name}</h3>
          <p className="mb-4 text-sm text-muted-foreground">{trial.details.study_summary}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {trial.location}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {trial.sponsor}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {trial.details.trial_duration}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Beaker className="h-4 w-4" />
              {trial.details.intervention}
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
              <TabsList className="w-full grid-cols-4">
                <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Eligibility Tab */}
              <TabsContent value="eligibility" className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Matched Criteria
                  </h4>
                  <ul className="space-y-1">
                    {trial.eligibility.matched_criteria.map((criteria, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground capitalize">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                {trial.eligibility.excluded_criteria.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                      Exclusion Criteria
                    </h4>
                    <ul className="space-y-1">
                      {trial.eligibility.excluded_criteria.map((criteria, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-500" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trial.eligibility.requires_verification.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      Requires Verification
                    </h4>
                    <ul className="space-y-1">
                      {trial.eligibility.requires_verification.map((criteria, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-yellow-500" />
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Detailed Explanations */}
                <div className="border-t pt-4">
                  <h4 className="mb-3 font-medium text-sm text-foreground">Detailed Criteria Analysis</h4>
                  <div className="space-y-3">
                    {trial.explanation.detailed_explanations.map((exp, i) => (
                      <div key={i} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-foreground">{exp.criterion}</span>
                          <div className="flex items-center gap-2">
                            {exp.status === "matched" ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {Math.round(exp.confidence * 100)}% confidence
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{exp.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Assessment Tab */}
              <TabsContent value="assessment" className="mt-4 space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Overall Assessment</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {trial.explanation.overall_assessment}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {trial.explanation.summary}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium text-foreground">Next Steps</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {trial.explanation.next_steps}
                  </p>
                </div>
              </TabsContent>

              {/* Risks Tab */}
              <TabsContent value="risks" className="mt-4 space-y-4">
                {trial.risks.side_effects.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Pill className="h-4 w-4 text-orange-500" />
                      Side Effects
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trial.risks.side_effects.map((effect, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-orange-500/30 text-orange-600">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {trial.risks.long_term_effects.length > 0 && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Activity className="h-4 w-4 text-red-500" />
                      Long-term Effects
                    </h4>
                    <ul className="space-y-1">
                      {trial.risks.long_term_effects.map((effect, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-red-400" />
                          {effect}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {trial.risks.potential_risks.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">Potential Risks</h4>
                    <ul className="space-y-1">
                      {trial.risks.potential_risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-orange-500" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium text-foreground">{trial.details.trial_duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Compensation</p>
                    <p className="font-medium text-foreground">
                      {trial.details.compensation || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="font-medium text-foreground">{confidencePercent}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{trial.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Intervention</p>
                    <p className="font-medium text-foreground">{trial.details.intervention}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disease Category</p>
                    <p className="font-medium text-foreground">{trial.disease_category}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex flex-wrap gap-3">
              {trial.actions.can_express_interest && (
                <Button className="gap-2">
                  Express Interest
                  <Heart className="h-4 w-4" />
                </Button>
              )}
              {trial.nct_id && (
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href={`https://clinicaltrials.gov/study/${trial.nct_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on ClinicalTrials.gov
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
