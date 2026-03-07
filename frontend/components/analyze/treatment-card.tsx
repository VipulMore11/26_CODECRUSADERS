"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Treatment } from "@/app/analyze/types"

interface TreatmentCardProps {
    treatment: Treatment
    onClick?: () => void
    showMetrics?: boolean
}

export function TreatmentCard({ treatment, onClick, showMetrics = true }: TreatmentCardProps) {
    const typeColors: Record<string, string> = {
        Medication: "bg-blue-500",
        Procedure: "bg-green-500",
        Therapy: "bg-purple-500",
        Lifestyle: "bg-orange-500",
        Device: "bg-cyan-500",
    }

    return (
        <Card
            className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg ${onClick ? '' : 'cursor-default'}`}
            onClick={onClick}
        >
            <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary">{treatment.category}</Badge>
                        <Badge className={`${typeColors[treatment.type]} text-white`}>{treatment.type}</Badge>
                    </div>
                </div>

                <h3 className="mb-2 text-lg font-semibold text-foreground">{treatment.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{treatment.description}</p>

                {showMetrics && (
                    <div className="mb-4">
                        <div className="mb-1 flex justify-between text-sm">
                            <span className="text-muted-foreground">Success Rate</span>
                            <span className="font-medium text-foreground">{treatment.successRate}%</span>
                        </div>
                        <Progress value={treatment.successRate} className="h-2" />
                    </div>
                )}

                <div className="flex flex-wrap gap-1">
                    {treatment.conditions.slice(0, 2).map(condition => (
                        <Badge key={condition} variant="outline" className="text-xs">
                            {condition}
                        </Badge>
                    ))}
                    {treatment.conditions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                            +{treatment.conditions.length - 2} more
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
