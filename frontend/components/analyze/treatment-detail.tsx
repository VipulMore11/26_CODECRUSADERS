"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    TrendingUp,
    Clock,
    DollarSign,
    Shield,
    FileText,
    Search,
    Activity,
    Zap,
} from "lucide-react"
import { Treatment } from "@/app/analyze/types"

interface TreatmentDetailProps {
    treatment: Treatment
    onBack?: () => void
}

export function TreatmentDetail({ treatment, onBack }: TreatmentDetailProps) {
    return (
        <div className="space-y-6">
            {onBack && (
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Back to treatments
                </Button>
            )}

            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">{treatment.category}</Badge>
                                <Badge className="bg-primary text-primary-foreground">{treatment.type}</Badge>
                            </div>
                            <CardTitle className="text-2xl md:text-3xl">{treatment.name}</CardTitle>
                            <CardDescription className="mt-2 text-base">{treatment.description}</CardDescription>
                        </div>
                        <div className="shrink-0 text-right">
                            <div className="text-4xl font-bold text-primary">{treatment.successRate}%</div>
                            <div className="text-sm text-muted-foreground">Success Rate</div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="font-medium text-foreground">{treatment.duration}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <DollarSign className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Cost Estimate</p>
                                <p className="font-medium text-foreground">{treatment.costEstimate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">Evidence Level</p>
                                <p className="font-medium text-foreground">High Quality</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* AI Insight */}
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                            AI Insight
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic font-light">"{treatment.aiInsight}"</p>
                    </CardContent>
                </Card>

                {/* Recovery Metric */}
                <Card className="flex flex-col justify-center border-accent/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <Zap className="h-6 w-6" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">Recovery Time</p>
                            <p className="mt-1 text-lg font-bold text-foreground">{treatment.recoveryTime}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Procedure Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="h-5 w-5 text-primary" />
                            Detailed Procedure
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-relaxed text-muted-foreground">{treatment.detailedProcedure}</p>
                    </CardContent>
                </Card>

                {/* Precautions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-amber-500">
                            <Shield className="h-5 w-5" />
                            Key Precautions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="grid gap-2 sm:grid-cols-1">
                            {treatment.precautions.map((precaution, index) => (
                                <li key={index} className="flex items-center gap-3 rounded-md bg-amber-500/5 p-2 text-sm">
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span className="text-foreground/80">{precaution}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Benefits */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-success">
                            <CheckCircle2 className="h-5 w-5" />
                            Benefits
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {treatment.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2 rounded-lg bg-success/5 p-3">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                                    <span className="text-foreground">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Risks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Risks & Side Effects
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible defaultValue="risks">
                            <AccordionItem value="risks" className="border-none">
                                <AccordionTrigger className="py-2 text-sm font-medium">Potential Risks</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2">
                                        {treatment.risks.map((risk, index) => (
                                            <li key={index} className="flex items-start gap-2 rounded-lg bg-destructive/5 p-3">
                                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                                <span className="text-foreground">{risk}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="side-effects" className="border-none">
                                <AccordionTrigger className="py-2 text-sm font-medium">Common Side Effects</AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex flex-wrap gap-2">
                                        {treatment.sideEffects.map((effect, index) => (
                                            <Badge key={index} variant="secondary">{effect}</Badge>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>

            {/* Alternative Treatments */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Alternative Treatments</CardTitle>
                    <CardDescription>Click on an option below to explore detailed comparisons with this procedure</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {treatment.alternatives.map((alt, index) => (
                            <div key={index}>
                                {typeof alt === "string" ? (
                                    <div className="flex items-center gap-3 rounded-lg border border-border p-3 opacity-60">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-foreground">{alt}</span>
                                    </div>
                                ) : (
                                    <Link
                                        href={`/analyze/detailinfo?id=${alt.id}`}
                                        className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 transition-all hover:bg-primary/10 hover:border-primary/40 group"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-sm">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-foreground flex-1">{alt.name}</span>
                                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Applicable Conditions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Applicable Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {treatment.conditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1">
                                {condition}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="border-warning/30 bg-warning/5">
                <CardContent className="flex items-start gap-4 py-4">
                    <Shield className="h-6 w-6 shrink-0 text-warning" />
                    <div>
                        <p className="font-medium text-foreground">Medical Disclaimer</p>
                        <p className="text-sm text-muted-foreground">
                            This information is for educational purposes only and should not replace professional medical advice.
                            Always consult with a qualified healthcare provider before starting any treatment.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild className="flex-1 gap-2">
                    <Link href="/analysisdashboard">
                        <FileText className="h-4 w-4" />
                        Check Compatibility with My Records
                    </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1 gap-2">
                    <Link href="/trials">
                        <Search className="h-4 w-4" />
                        Find Related Clinical Trials
                    </Link>
                </Button>
            </div>
        </div>
    )
}
