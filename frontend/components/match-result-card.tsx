"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  AlertTriangle
} from "lucide-react"

export interface CriteriaMatch {
  criterion: string
  matched: boolean | "partial"
  explanation: string
}

export interface MatchResult {
  trialId: string
  trialTitle: string
  sponsor: string
  phase: string
  location: string
  matchScore: number
  confidenceScore: number
  criteriaMatches: CriteriaMatch[]
  longTermEffects: string[]
  drugInfo: {
    name: string
    mechanism: string
    knownSideEffects: string[]
  }
  enrollmentStatus: string
  estimatedDuration: string
}

interface MatchResultCardProps {
  result: MatchResult
  rank: number
}

export function MatchResultCard({ result, rank }: MatchResultCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const matchedCount = result.criteriaMatches.filter((c) => c.matched === true).length
  const partialCount = result.criteriaMatches.filter((c) => c.matched === "partial").length
  const unmatchedCount = result.criteriaMatches.filter((c) => c.matched === false).length

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success"
    if (score >= 60) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{result.phase}</Badge>
              <Badge 
                variant="secondary" 
                className={result.enrollmentStatus === "Recruiting" ? "bg-success/20 text-success" : ""}
              >
                {result.enrollmentStatus}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">{result.trialTitle}</CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {result.sponsor}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {result.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {result.estimatedDuration}
              </span>
            </div>
          </div>
          
          {/* Match Score Circle */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border-4 ${getScoreColor(result.matchScore)} border-current`}>
              <span className={`text-2xl font-bold ${getScoreColor(result.matchScore)}`}>
                {result.matchScore}%
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Match Score</span>
          </div>
        </div>

        {/* Mobile Score */}
        <div className="sm:hidden mt-4 flex items-center justify-between rounded-lg bg-secondary p-4">
          <div>
            <p className="text-sm text-muted-foreground">Match Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(result.matchScore)}`}>
              {result.matchScore}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Confidence</p>
            <p className="text-3xl font-bold">{result.confidenceScore}%</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Criteria Summary */}
        <div className="flex items-center gap-6 rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <span className="text-sm"><strong>{matchedCount}</strong> Matched</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span className="text-sm"><strong>{partialCount}</strong> Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-sm"><strong>{unmatchedCount}</strong> Unmatched</span>
          </div>
          <div className="ml-auto hidden sm:block">
            <span className="text-sm text-muted-foreground">
              Confidence: <strong>{result.confidenceScore}%</strong>
            </span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AI Confidence Score</span>
            <span className="font-medium">{result.confidenceScore}%</span>
          </div>
          <Progress value={result.confidenceScore} className="h-2" />
        </div>

        {/* Expandable Details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>View Detailed Analysis</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-4">
            {/* Criteria Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold">Eligibility Criteria Analysis</h4>
              <div className="space-y-2">
                {result.criteriaMatches.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border border-border p-3">
                    {criteria.matched === true && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-success mt-0.5" />
                    )}
                    {criteria.matched === "partial" && (
                      <AlertCircle className="h-5 w-5 shrink-0 text-warning mt-0.5" />
                    )}
                    {criteria.matched === false && (
                      <XCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{criteria.criterion}</p>
                      <p className="text-sm text-muted-foreground">{criteria.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drug Information */}
            <div className="space-y-3">
              <h4 className="font-semibold">Drug Information</h4>
              <div className="rounded-lg border border-border p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Drug Name</p>
                  <p className="font-medium">{result.drugInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mechanism of Action</p>
                  <p className="text-sm">{result.drugInfo.mechanism}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Known Side Effects</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.drugInfo.knownSideEffects.map((effect, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Long-term Effects */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Potential Long-term Effects
              </h4>
              <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                <ul className="space-y-2">
                  {result.longTermEffects.map((effect, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Trial
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
