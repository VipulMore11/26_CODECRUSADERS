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
  ChevronDown,
  Clock,
  DollarSign,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Heart,
  Download
} from "lucide-react"

export interface Procedure {
  id: string
  name: string
  type: string
  description: string
  successRate: number
  feasibilityScore: number
  estimatedCost: string
  recoveryTime: string
  hospitalStay: string
  pros: string[]
  cons: string[]
  risks: string[]
  longTermOutcomes: string[]
  alternatives: string[]
  recommended: boolean
}

interface ProcedureCardProps {
  procedure: Procedure
  rank: number
}

export function ProcedureCard({ procedure, rank }: ProcedureCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getSuccessColor = (rate: number) => {
    if (rate >= 80) return "text-success"
    if (rate >= 60) return "text-warning"
    return "text-destructive"
  }

  return (
    <Card className={`overflow-hidden ${procedure.recommended ? "border-primary" : ""}`}>
      {procedure.recommended && (
        <div className="bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground">
          AI Recommended Based on Your Profile
        </div>
      )}
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{procedure.type}</Badge>
              {procedure.recommended && (
                <Badge className="bg-primary text-primary-foreground">Top Choice</Badge>
              )}
            </div>
            <CardTitle className="text-xl">{procedure.name}</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">{procedure.description}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <TrendingUp className={`mx-auto h-6 w-6 ${getSuccessColor(procedure.successRate)}`} />
            <p className={`mt-2 text-2xl font-bold ${getSuccessColor(procedure.successRate)}`}>
              {procedure.successRate}%
            </p>
            <p className="text-xs text-muted-foreground">Success Rate</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <Activity className="mx-auto h-6 w-6 text-primary" />
            <p className="mt-2 text-2xl font-bold">{procedure.feasibilityScore}%</p>
            <p className="text-xs text-muted-foreground">Feasibility</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <Clock className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-lg font-bold">{procedure.recoveryTime}</p>
            <p className="text-xs text-muted-foreground">Recovery</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-4 text-center">
            <DollarSign className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="mt-2 text-lg font-bold">{procedure.estimatedCost}</p>
            <p className="text-xs text-muted-foreground">Est. Cost</p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Success Rate</span>
              <span className={`font-medium ${getSuccessColor(procedure.successRate)}`}>
                {procedure.successRate}%
              </span>
            </div>
            <Progress value={procedure.successRate} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Feasibility for Your Case</span>
              <span className="font-medium">{procedure.feasibilityScore}%</span>
            </div>
            <Progress value={procedure.feasibilityScore} className="h-2" />
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-accent" />
            <span>Hospital Stay: {procedure.hospitalStay}</span>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>View Full Analysis</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-4">
            {/* Pros */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 className="h-5 w-5" />
                Advantages
              </h4>
              <ul className="space-y-2">
                {procedure.pros.map((pro, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-warning">
                <AlertTriangle className="h-5 w-5" />
                Considerations
              </h4>
              <ul className="space-y-2">
                {procedure.cons.map((con, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="space-y-3">
              <h4 className="flex items-center gap-2 font-semibold text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Potential Risks
              </h4>
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <ul className="space-y-2">
                  {procedure.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Long-term Outcomes */}
            <div className="space-y-3">
              <h4 className="font-semibold">Long-term Outcomes</h4>
              <div className="rounded-lg border border-border p-4">
                <ul className="space-y-2">
                  {procedure.longTermOutcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Alternatives */}
            <div className="space-y-3">
              <h4 className="font-semibold">Alternative Approaches</h4>
              <div className="flex flex-wrap gap-2">
                {procedure.alternatives.map((alt, index) => (
                  <Badge key={index} variant="outline">
                    {alt}
                  </Badge>
                ))}
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
          <Button variant="outline">Compare</Button>
        </div>
      </CardContent>
    </Card>
  )
}
