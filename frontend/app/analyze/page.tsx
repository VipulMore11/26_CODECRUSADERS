"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FileUpload } from "@/components/file-upload"
import { ProcedureCard, type Procedure } from "@/components/procedure-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Stethoscope,
  Brain,
  FileText,
  ArrowRight,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react"

// Mock procedure data
const mockProcedures: Procedure[] = [
  {
    id: "proc1",
    name: "Minimally Invasive Robotic Surgery",
    type: "Surgical",
    description: "Robot-assisted surgery using small incisions with enhanced precision and visualization for tumor removal.",
    successRate: 92,
    feasibilityScore: 88,
    estimatedCost: "$45,000 - $65,000",
    recoveryTime: "2-4 weeks",
    hospitalStay: "1-2 days",
    recommended: true,
    pros: [
      "Smaller incisions leading to less scarring",
      "Reduced blood loss during procedure",
      "Shorter hospital stay compared to open surgery",
      "Faster return to normal activities",
      "Lower risk of infection",
    ],
    cons: [
      "Requires specialized surgical team",
      "Not available at all medical centers",
      "Higher upfront cost than traditional surgery",
      "Longer operative time in some cases",
    ],
    risks: [
      "Bleeding or hematoma (2-5% risk)",
      "Nerve damage (1-3% risk)",
      "Conversion to open surgery if complications arise",
      "Anesthesia-related complications",
    ],
    longTermOutcomes: [
      "5-year survival rate: 85-90% for early-stage cases",
      "Recurrence rate: 10-15% within first 5 years",
      "Quality of life generally maintained post-recovery",
      "Regular follow-up imaging recommended every 6 months",
    ],
    alternatives: ["Open Surgery", "Radiation Therapy", "Chemotherapy", "Watchful Waiting"],
  },
  {
    id: "proc2",
    name: "Immunotherapy Treatment Protocol",
    type: "Medical",
    description: "Checkpoint inhibitor therapy that helps the immune system recognize and attack cancer cells more effectively.",
    successRate: 75,
    feasibilityScore: 82,
    estimatedCost: "$100,000 - $150,000/year",
    recoveryTime: "Ongoing treatment",
    hospitalStay: "Outpatient",
    recommended: false,
    pros: [
      "Non-invasive treatment option",
      "Can be combined with other therapies",
      "Potential for durable long-term responses",
      "Outpatient administration",
      "May shrink tumors significantly",
    ],
    cons: [
      "High cost of treatment",
      "Not all patients respond to therapy",
      "Can take weeks to months to see response",
      "Requires regular infusions over extended period",
    ],
    risks: [
      "Immune-related adverse events (20-30% risk)",
      "Fatigue and weakness (50% of patients)",
      "Skin reactions and rashes",
      "Potential thyroid dysfunction",
      "Rare but serious: pneumonitis, colitis, hepatitis",
    ],
    longTermOutcomes: [
      "Complete response rate: 15-25% depending on cancer type",
      "Responses can be durable for years in responders",
      "Some patients achieve long-term disease control",
      "Quality of life generally preserved during treatment",
    ],
    alternatives: ["Targeted Therapy", "Chemotherapy", "Radiation", "Clinical Trials"],
  },
  {
    id: "proc3",
    name: "Stereotactic Body Radiation Therapy (SBRT)",
    type: "Radiation",
    description: "Highly focused radiation beams delivered with extreme precision to target tumors while minimizing damage to surrounding tissue.",
    successRate: 85,
    feasibilityScore: 78,
    estimatedCost: "$20,000 - $40,000",
    recoveryTime: "1-2 weeks",
    hospitalStay: "Outpatient",
    recommended: false,
    pros: [
      "Non-invasive treatment",
      "Completed in 3-5 sessions",
      "Minimal recovery time needed",
      "Precise targeting reduces side effects",
      "Good option for patients not fit for surgery",
    ],
    cons: [
      "Limited by tumor size and location",
      "Radiation exposure concerns",
      "May not be suitable for all cancer types",
      "Single-use in same area typically",
    ],
    risks: [
      "Fatigue during and after treatment",
      "Skin irritation in treatment area",
      "Damage to nearby organs (location dependent)",
      "Rare: radiation pneumonitis for lung tumors",
    ],
    longTermOutcomes: [
      "Local control rate: 80-95% for small tumors",
      "3-year survival comparable to surgery for eligible patients",
      "Low rate of serious late complications",
      "Can be combined with systemic therapy",
    ],
    alternatives: ["Surgery", "Conventional Radiation", "Proton Therapy", "Cryotherapy"],
  },
]

export default function AnalyzePage() {
  const [step, setStep] = useState<"upload" | "details" | "analyzing" | "results">("upload")
  const [progress, setProgress] = useState(0)
  const [condition, setCondition] = useState("")
  const [stage, setStage] = useState("")
  const [notes, setNotes] = useState("")

  const handleStartAnalysis = () => {
    setStep("analyzing")
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setStep("results"), 500)
          return 100
        }
        return prev + 4
      })
    }, 120)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="mx-auto max-w-[1440px] px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Medical Procedure Analysis</h1>
            <p className="mt-4 text-base text-muted-foreground">
              Upload your medical records to get AI-powered recommendations for treatment procedures
            </p>
          </div>

          {/* Privacy Notice */}
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="flex items-start gap-4 p-6">
              <Shield className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="text-lg font-bold">Your Data is Protected</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  All medical records are processed with complete anonymization. No personal information
                  is stored or associated with your analysis. Results are generated locally and securely.
                </p>
              </div>
            </CardContent>
          </Card>

          {step === "upload" && (
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <FileText className="h-6 w-6" />
                    Upload Medical Records
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Upload your diagnosis reports, imaging results, and lab work for comprehensive analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFilesUploaded={() => { }} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <Stethoscope className="h-6 w-6" />
                    Condition Details
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Provide information about your diagnosis to improve recommendation accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="condition" className="text-base font-semibold">Primary Condition</Label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger id="condition" className="h-12 text-base rounded-xl border-2">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lung-cancer">Lung Cancer</SelectItem>
                          <SelectItem value="breast-cancer">Breast Cancer</SelectItem>
                          <SelectItem value="prostate-cancer">Prostate Cancer</SelectItem>
                          <SelectItem value="colorectal-cancer">Colorectal Cancer</SelectItem>
                          <SelectItem value="pancreatic-cancer">Pancreatic Cancer</SelectItem>
                          <SelectItem value="liver-cancer">Liver Cancer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="stage" className="text-base font-semibold">Stage (if applicable)</Label>
                      <Select value={stage} onValueChange={setStage}>
                        <SelectTrigger id="stage" className="h-12 text-base rounded-xl border-2">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stage-1">Stage I</SelectItem>
                          <SelectItem value="stage-2">Stage II</SelectItem>
                          <SelectItem value="stage-3">Stage III</SelectItem>
                          <SelectItem value="stage-4">Stage IV</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-base font-semibold">Additional Information</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any relevant medical history, previous treatments, current symptoms, or specific concerns..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={6}
                      className="text-base rounded-xl border-2 p-4"
                    />
                  </div>

                  <Button onClick={handleStartAnalysis} className="w-full gap-3 py-8 text-lg font-bold rounded-2xl" size="lg">
                    <Brain className="h-6 w-6" />
                    Analyze Treatment Options
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === "analyzing" && (
            <Card className="max-w-lg mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <CardTitle className="text-2xl">Analyzing Your Records</CardTitle>
                <CardDescription>
                  Our AI is reviewing your medical data and comparing treatment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Progress value={progress} className="h-3" />

                <div className="space-y-3">
                  {[
                    { label: "Processing medical records", done: progress > 15 },
                    { label: "Extracting diagnosis information", done: progress > 35 },
                    { label: "Analyzing treatment options", done: progress > 55 },
                    { label: "Calculating success rates", done: progress > 75 },
                    { label: "Generating recommendations", done: progress >= 100 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground animate-spin" />
                      )}
                      <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step === "results" && (
            <div className="space-y-8">
              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Condition Analyzed</p>
                      <p className="mt-1 font-semibold">Stage II Lung Cancer (NSCLC)</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Procedures Evaluated</p>
                      <p className="mt-1 font-semibold">{mockProcedures.length} Treatment Options</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <p className="text-sm text-muted-foreground">Best Match Success Rate</p>
                      <p className="mt-1 font-semibold text-success">92%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <Card className="border-warning/30 bg-warning/5">
                <CardContent className="flex items-start gap-4 p-6">
                  <AlertTriangle className="h-6 w-6 shrink-0 text-warning" />
                  <div>
                    <h3 className="font-semibold">Medical Disclaimer</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      This analysis is for informational purposes only and should not replace professional medical advice.
                      Always consult with qualified healthcare providers before making treatment decisions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Procedure Results */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Recommended Procedures</h2>
                {mockProcedures.map((procedure, index) => (
                  <ProcedureCard key={procedure.id} procedure={procedure} rank={index + 1} />
                ))}
              </div>

              {/* Action Buttons */}
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                  <h3 className="text-xl font-semibold">Download Complete Analysis</h3>
                  <p className="text-muted-foreground">
                    Get a comprehensive PDF report with all procedure details, comparisons, and recommendations
                  </p>
                  <div className="flex gap-2">
                    <Button size="lg">Download PDF Report</Button>
                    <Button size="lg" variant="outline">Export as CSV</Button>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Start New Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
