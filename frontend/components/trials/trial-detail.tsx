import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  MapPin,
  Building,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
  Bell,
  Share2,
} from "lucide-react"
import type { ClinicalTrial } from "@/app/trials/types"

interface TrialDetailProps {
  trial: ClinicalTrial
  onBack: () => void
}

export function TrialDetail({ trial, onBack }: TrialDetailProps) {
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
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ChevronLeft className="h-4 w-4" />
        Back to all trials
      </Button>

      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{trial.phase}</Badge>
                <Badge className={getStatusColor(trial.status)}>{trial.status}</Badge>
                {trial.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <CardTitle className="text-2xl">{trial.name}</CardTitle>
              <CardDescription className="text-base">{trial.condition}</CardDescription>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Set Alert
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">
                  {trial.location.city}, {trial.location.state}, {trial.location.country}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sponsor</p>
                <p className="font-medium text-foreground">{trial.sponsor}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrollment</p>
                <p className="font-medium text-foreground">{trial.enrollmentCount} participants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Completion</p>
                <p className="font-medium text-foreground">
                  {new Date(trial.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Detailed Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium text-foreground">Brief Summary</h4>
                <p className="text-muted-foreground">{trial.fullDescription || trial.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Interventions & Treatments */}
          {trial.interventions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interventions & Treatments</CardTitle>
                <CardDescription>
                  The specific treatments, drugs, or procedures being studied in this trial.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trial.interventions.map((intervention, index) => (
                    <div key={index} className="rounded-lg border border-border p-4 bg-muted/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {intervention.type}
                        </Badge>
                        <h4 className="font-semibold text-foreground tracking-tight">{intervention.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {intervention.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collaborators & Investigators */}
          {(trial.collaborators.length > 0 || trial.investigators.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collaborators & Investigators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trial.investigators.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-medium text-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      Investigators
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {trial.investigators.map((investigator, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {investigator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {trial.collaborators.length > 0 && (
                  <div>
                    <h4 className="mb-3 flex items-center gap-2 font-medium text-foreground">
                      <Building className="h-4 w-4 text-primary" />
                      Collaborators
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {trial.collaborators.map((collaborator, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {collaborator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Contact & Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contacts & Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Contacts */}
              {trial.contacts.length > 0 && (
                <div>
                  <h4 className="mb-4 font-medium text-foreground">Study Contacts</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {trial.contacts.map((contact, index) => (
                      <div key={index} className="rounded-lg border border-border p-4">
                        <p className="font-semibold text-foreground">{contact.name}</p>
                        <p className="text-sm text-primary">{contact.role}</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>{contact.email}</p>
                          <p>{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Locations */}
              <div>
                <h4 className="mb-4 font-medium text-foreground">Study Locations</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(trial.locations.length > 0 ? trial.locations : [trial.location]).map((loc, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        {'name' in loc && <p className="font-medium text-foreground">{loc.name}</p>}
                        <p>{loc.city}, {loc.state}, {loc.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Eligibility Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium text-success">
                    <CheckCircle2 className="h-5 w-5" />
                    Inclusion Criteria
                  </h4>
                  <ul className="space-y-2">
                    {trial.eligibilityCriteria.inclusion.map((criteria, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 rounded-lg bg-success/5 p-3 text-sm"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-foreground">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium text-destructive">
                    <XCircle className="h-5 w-5" />
                    Exclusion Criteria
                  </h4>
                  <ul className="space-y-2">
                    {trial.eligibilityCriteria.exclusion.map((criteria, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 rounded-lg bg-destructive/5 p-3 text-sm"
                      >
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                        <span className="text-foreground">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Take Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                View on ClinicalTrials.gov
              </Button>
              <Button variant="outline" className="w-full gap-2" asChild>
                <Link href="/dashboard">
                  <FileText className="h-4 w-4" />
                  Check My Eligibility
                </Link>
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Bell className="h-4 w-4" />
                Get Updates
              </Button>
            </CardContent>
          </Card>

          {/* Trial ID */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trial ID</span>
                <span className="font-mono text-foreground">{trial.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="text-foreground">
                  {new Date(trial.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Disease Category</span>
                <span className="text-foreground">{trial.diseaseCategory}</span>
              </div>
            </CardContent>
          </Card>

          {/* Similar Trials CTA */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="py-6 text-center">
              <h4 className="mb-2 font-semibold text-foreground">Looking for similar trials?</h4>
              <p className="mb-4 text-sm text-muted-foreground">
                Upload your medical records to find trials that match your specific profile.
              </p>
              <Button asChild>
                <Link href="/dashboard">Find My Matches</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
