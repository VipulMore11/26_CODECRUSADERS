"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  FileText,
  Download,
  Share2,
  Printer,
  Mail,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileBarChart,
  Stethoscope,
  MapPin,
  Calendar,
  User,
  Building2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"

const reportSections = [
  {
    id: "summary",
    name: "Executive Summary",
    description: "High-level overview of your medical profile and matching results",
    icon: FileBarChart,
    required: true,
  },
  {
    id: "conditions",
    name: "Medical Conditions",
    description: "Detailed breakdown of identified conditions and diagnoses",
    icon: Stethoscope,
    required: true,
  },
  {
    id: "trials",
    name: "Clinical Trial Matches",
    description: "List of recommended clinical trials with eligibility analysis",
    icon: FileText,
    required: false,
  },
  {
    id: "treatments",
    name: "Treatment Options",
    description: "Alternative treatment procedures and recommendations",
    icon: Building2,
    required: false,
  },
  {
    id: "locations",
    name: "Facility Locations",
    description: "Map and details of nearby treatment centers",
    icon: MapPin,
    required: false,
  },
  {
    id: "timeline",
    name: "Recommended Timeline",
    description: "Suggested action items and follow-up schedule",
    icon: Calendar,
    required: false,
  },
]

export default function ReportPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    reportSections.filter((s) => s.required).map((s) => s.id)
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [reportReady, setReportReady] = useState(false)
  const [includePersonalInfo, setIncludePersonalInfo] = useState(false)

  const toggleSection = (sectionId: string) => {
    const section = reportSections.find((s) => s.id === sectionId)
    if (section?.required) return

    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const generateReport = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setReportReady(true)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/treatments">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Report Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              HIPAA Compliant
            </Badge>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mx-auto max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Generate Your Medical Report
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create a comprehensive PDF report to share with your healthcare provider
            </p>
          </div>

          {!reportReady ? (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Section Selection */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Report Sections</CardTitle>
                    <CardDescription>
                      Choose which sections to include in your report
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {reportSections.map((section) => {
                      const Icon = section.icon
                      const isSelected = selectedSections.includes(section.id)

                      return (
                        <div
                          key={section.id}
                          className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${isSelected
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:border-muted-foreground/30"
                            } ${section.required ? "cursor-not-allowed" : "cursor-pointer"}`}
                          onClick={() => toggleSection(section.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={section.required}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="font-medium">{section.name}</span>
                              {section.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {section.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Options & Generate */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Options</CardTitle>
                    <CardDescription>
                      Control what personal information is included
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="personal-info"
                        checked={includePersonalInfo}
                        onCheckedChange={(checked) =>
                          setIncludePersonalInfo(checked as boolean)
                        }
                      />
                      <div>
                        <Label htmlFor="personal-info" className="cursor-pointer">
                          Include personal information
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Name, date of birth, and contact details
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {includePersonalInfo ? (
                          <>
                            <Eye className="h-4 w-4 text-warning" />
                            <span>Personal info will be visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                            <span>Personal info will be hidden</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span>Report is password protected</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Report Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Sections selected</span>
                      <span className="font-medium">{selectedSections.length} of 6</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Estimated pages</span>
                      <span className="font-medium">{selectedSections.length * 2 + 2}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">PDF</span>
                    </div>

                    <Separator />

                    {isGenerating ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 animate-spin text-primary" />
                          <span>Generating report...</span>
                        </div>
                        <Progress value={generationProgress} />
                        <p className="text-xs text-muted-foreground">
                          This may take a few moments
                        </p>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={generateReport}>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <ReportPreview
              sections={selectedSections}
              includePersonalInfo={includePersonalInfo}
              onReset={() => {
                setReportReady(false)
                setGenerationProgress(0)
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}

function ReportPreview({
  sections,
  includePersonalInfo,
  onReset,
}: {
  sections: string[]
  includePersonalInfo: boolean
  onReset: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Report Generated Successfully
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Your medical report is ready to download or share
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Medical Analysis Report</CardTitle>
              <CardDescription>
                Generated on {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </CardDescription>
            </div>
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              Encrypted
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Report Header Preview */}
          <div className="rounded-lg border bg-muted/30 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">TrialMatch AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Clinical Trial & Treatment Matching Report
                  </p>
                </div>
              </div>
              <div className="text-right text-sm">
                <p className="text-muted-foreground">Report ID</p>
                <p className="font-mono text-xs">RPT-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="font-medium">
                  {includePersonalInfo ? "John Smith" : "Anonymous Patient"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="font-medium">
                  {includePersonalInfo ? "March 15, 1980" : "Redacted"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Report Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pages</p>
                <p className="font-medium">{sections.length * 2 + 2} pages</p>
              </div>
            </div>
          </div>

          {/* Sections Included */}
          <div>
            <h4 className="mb-3 font-medium">Sections Included</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {reportSections
                .filter((s) => sections.includes(s.id))
                .map((section) => {
                  const Icon = section.icon
                  return (
                    <div
                      key={section.id}
                      className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm"
                    >
                      <Icon className="h-4 w-4 text-primary" />
                      <span>{section.name}</span>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Important Notice</p>
              <p className="text-muted-foreground">
                This report is generated by AI analysis and is intended for informational
                purposes only. Always consult with qualified healthcare professionals
                before making medical decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={onReset}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Modify Report
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Share with Provider */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Share with Healthcare Provider
          </CardTitle>
          <CardDescription>
            Send this report directly to your doctor or healthcare team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Secure Portal</p>
                  <p className="text-sm text-muted-foreground">
                    Send via encrypted health portal
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Direct Email</p>
                  <p className="text-sm text-muted-foreground">
                    Password-protected attachment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
