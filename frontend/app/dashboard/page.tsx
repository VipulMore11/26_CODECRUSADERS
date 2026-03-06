"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUpload } from "@/components/file-upload"
import { PatientInfoForm, type PatientData } from "@/components/patient-info-form"
import { PrivacyWarningModal } from "@/components/privacy-warning-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  FileText,
  ClipboardList,
  Activity,
  TrendingUp,
  Users,
  Clock
} from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([])

  const handleFilesUploaded = (files: { id: string; name: string }[]) => {
    setUploadedFiles(files)
  }

  const handleFormSubmit = (data: PatientData) => {
    // Store data in sessionStorage for the results page
    sessionStorage.setItem("patientData", JSON.stringify(data))
    sessionStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles))
    router.push("/results")
  }

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-8">
      <PrivacyWarningModal />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Patient Analysis Dashboard</h1>
        <p className="mt-4 text-base text-muted-foreground">
          Upload medical records and enter patient information for clinical trial matching
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-black">2,847</p>
              <p className="text-base font-medium text-muted-foreground">Active Trials</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-7 w-7 text-success" />
            </div>
            <div>
              <p className="text-3xl font-black">94.7%</p>
              <p className="text-base font-medium text-muted-foreground">Match Accuracy</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-black">15,420</p>
              <p className="text-base font-medium text-muted-foreground">Patients Matched</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex items-center gap-6 p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-7 w-7 text-warning" />
            </div>
            <div>
              <p className="text-3xl font-black">{"<"}2s</p>
              <p className="text-base font-medium text-muted-foreground">Avg. Analysis Time</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Notice */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-6">
          <Shield className="h-6 w-6 shrink-0 text-primary" />
          <div>
            <h3 className="text-lg font-bold">Data Security Guaranteed</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              All patient data is anonymized using UUID assignment. Personal identifiers are automatically
              removed using regex pattern matching. Your data never leaves your browser during processing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-14 rounded-xl">
              <TabsTrigger value="upload" className="gap-2 text-base font-semibold">
                <FileText className="h-5 w-5" />
                Upload Documents
              </TabsTrigger>
              <TabsTrigger value="manual" className="gap-2 text-base font-semibold">
                <ClipboardList className="h-5 w-5" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <FileUpload onFilesUploaded={handleFilesUploaded} />

              {uploadedFiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Data Extraction</CardTitle>
                    <CardDescription>
                      Our OCR + LLM pipeline will extract structured data from your documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <span className="text-sm">Document Analysis</span>
                        <Badge variant="secondary">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <span className="text-sm">PII Detection & Removal</span>
                        <Badge variant="secondary">Ready</Badge>
                      </div>
                      <div className="flex items-center justify-between rounded-lg border border-border p-3">
                        <span className="text-sm">Data Structuring</span>
                        <Badge variant="secondary">Ready</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <PatientInfoForm onSubmit={handleFormSubmit} />
            </TabsContent>

            <TabsContent value="manual">
              <PatientInfoForm onSubmit={handleFormSubmit} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { format: "PDF Documents", desc: "Lab reports, prescriptions" },
                  { format: "Images (JPG, PNG)", desc: "Scanned records, X-rays" },
                  { format: "Word Documents", desc: "Medical summaries" },
                  { format: "Text Files", desc: "Clinical notes" },
                ].map((item) => (
                  <div key={item.format} className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium">{item.format}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, name: "Document Ingestion", status: "Queued" },
                  { step: 2, name: "OCR Processing", status: "Queued" },
                  { step: 3, name: "LLM Extraction", status: "Queued" },
                  { step: 4, name: "Anonymization", status: "Queued" },
                  { step: 5, name: "Trial Matching", status: "Queued" },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
