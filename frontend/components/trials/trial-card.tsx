import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building, Users, Calendar, ChevronRight } from "lucide-react"
import type { ClinicalTrial } from "@/app/trials/types"

interface TrialCardProps {
  trial: ClinicalTrial
  onClick: () => void
}

export function TrialCard({ trial, onClick }: TrialCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Recruiting":
        return "bg-success text-success-foreground"
      case "Active":
        return "bg-primary text-primary-foreground"
      case "Not yet recruiting":
        return "bg-warning text-warning-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{trial.phase}</Badge>
            <Badge className={getStatusColor(trial.status)}>{trial.status}</Badge>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{trial.id}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-foreground">
          {trial.name}
        </h3>

        <p className="mb-3 text-sm font-medium text-primary">{trial.condition}</p>

        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{trial.description}</p>

        <div className="mb-4 flex flex-wrap gap-1">
          {trial.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {trial.location.city}, {trial.location.state}
          </div>
          <div className="flex items-center gap-1">
            <Building className="h-3 w-3" />
            {trial.sponsor}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {trial.enrollmentCount} enrolled
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Est. completion: {new Date(trial.estimatedCompletionDate).toLocaleDateString()}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  )
}
