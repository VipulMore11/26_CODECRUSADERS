"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  Users,
  Building2,
  ChevronRight,
  Bookmark,
  ExternalLink
} from "lucide-react"
import Link from "next/link"

export interface Trial {
  id: string
  title: string
  sponsor: string
  phase: string
  status: string
  conditions: string[]
  location: string
  distance?: string
  enrollmentTarget: number
  currentEnrollment: number
  startDate: string
  tags: string[]
  matchScore?: number
}

interface TrialCardProps {
  trial: Trial
  showMatchScore?: boolean
}

export function TrialCard({ trial, showMatchScore = false }: TrialCardProps) {
  const enrollmentPercentage = (trial.currentEnrollment / trial.enrollmentTarget) * 100

  return (
    <Card className="group transition-all hover:border-primary/50 hover:shadow-xl border-2">
      <CardHeader className="pb-4 pt-6 px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant={trial.status === "Recruiting" ? "default" : "secondary"}
                className={trial.status === "Recruiting" ? "bg-success text-success-foreground px-3 py-1 text-xs" : "px-3 py-1 text-xs"}
              >
                {trial.status}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 text-xs">{trial.phase}</Badge>
              {showMatchScore && trial.matchScore && (
                <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs">
                  {trial.matchScore}% Match
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {trial.title}
            </h3>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10" aria-label="Bookmark trial">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-8">
        <div className="flex items-center gap-2 text-base text-muted-foreground">
          <Building2 className="h-5 w-5 shrink-0" />
          <span className="truncate">{trial.sponsor}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {trial.conditions.slice(0, 3).map((condition) => (
            <Badge key={condition} variant="secondary" className="text-xs">
              {condition}
            </Badge>
          ))}
          {trial.conditions.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{trial.conditions.length - 3} more
            </Badge>
          )}
        </div>

        {trial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {trial.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs border-accent text-accent"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{trial.location}</span>
          </div>
          {trial.distance && (
            <div className="text-muted-foreground text-right">
              {trial.distance} away
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{trial.startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground justify-end">
            <Users className="h-4 w-4 shrink-0" />
            <span>{trial.currentEnrollment}/{trial.enrollmentTarget}</span>
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Enrollment Progress</span>
            <span className="font-medium">{Math.round(enrollmentPercentage)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Link href={`/trials/${trial.id}`} className="flex-1">
            <Button variant="outline" size="lg" className="w-full gap-2 py-6 text-base font-semibold">
              View Details
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="h-12 w-12 shrink-0 border border-border" aria-label="Open in new tab">
            <ExternalLink className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
