"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Scan, FileSearch, Brain, Target, CheckCircle2, Loader2 } from "lucide-react"

interface AnalysisProgressProps {
  files: File[]
}

const stages = [
  {
    id: "ocr",
    icon: <Scan className="h-5 w-5" />,
    title: "Document Processing",
    description: "Extracting text using OCR technology",
  },
  {
    id: "extraction",
    icon: <FileSearch className="h-5 w-5" />,
    title: "Medical Data Extraction",
    description: "Identifying conditions, medications, and lab results",
  },
  {
    id: "analysis",
    icon: <Brain className="h-5 w-5" />,
    title: "AI Analysis",
    description: "Analyzing medical history with our AI engine",
  },
  {
    id: "matching",
    icon: <Target className="h-5 w-5" />,
    title: "Trial Matching",
    description: "Finding compatible clinical trials",
  },
]

export function AnalysisProgress({ files }: AnalysisProgressProps) {
  const [currentStage, setCurrentStage] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 1200)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 2
        }
        return prev
      })
    }, 100)

    return () => {
      clearInterval(stageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardContent className="py-12">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Analyzing Your Records</h2>
            <p className="text-muted-foreground">
              Processing {files.length} file{files.length > 1 ? "s" : ""}. This may take a few moments.
            </p>
          </div>

          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isComplete = index < currentStage
              const isCurrent = index === currentStage
              
              return (
                <div
                  key={stage.id}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-all ${
                    isComplete
                      ? "border-success/30 bg-success/5"
                      : isCurrent
                      ? "border-primary/50 bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isComplete
                        ? "bg-success text-success-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      stage.icon
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {stage.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Please do not close this page while analysis is in progress.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
