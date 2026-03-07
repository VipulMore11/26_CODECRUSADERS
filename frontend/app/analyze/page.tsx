"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Activity, Dna, Brain, Heart, Sparkles, ArrowRight, Search, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { treatments } from "./data"
import { TreatmentCard } from "@/components/analyze/treatment-card"

const categories = [...new Set(treatments.map(t => t.category))]

const categoryIcons: Record<string, React.ReactNode> = {
  Diabetes: <Activity className="h-5 w-5" />,
  Oncology: <Dna className="h-5 w-5" />,
  "Mental Health": <Brain className="h-5 w-5" />,
  Cardiovascular: <Heart className="h-5 w-5" />,
  Neurology: <Brain className="h-5 w-5" />,
}

export default function AnalyzePage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredTreatments = treatments.filter(treatment => {
    if (search) {
      const searchLower = search.toLowerCase()
      if (!treatment.name.toLowerCase().includes(searchLower) &&
        !treatment.description.toLowerCase().includes(searchLower) &&
        !treatment.conditions.some(c => c.toLowerCase().includes(searchLower))) {
        return false
      }
    }
    if (selectedCategory !== "all" && treatment.category !== selectedCategory) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="secondary" className="mb-4 gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-Powered Analysis
          </Badge>
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Procedure Analysis Tool
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Evaluate medical procedures with AI-powered insights. Analyze success rates,
            recovery times, costs, and make informed decisions about your treatment options.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search treatments, conditions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex h-auto flex-wrap justify-center gap-2 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All Categories
            </TabsTrigger>
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {categoryIcons[category]}
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* CTA Banner */}
        <Card className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Get Personalized Treatment Recommendations</h3>
                <p className="text-sm text-muted-foreground">Upload your medical records for AI-powered analysis</p>
              </div>
            </div>
            <Button asChild className="gap-2">
              <Link href="/analysisdashboard">
                Start Matching
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Treatment Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTreatments.map(treatment => (
            <TreatmentCard
              key={treatment.id}
              treatment={treatment}
              onClick={() => router.push(`/analyze/detailinfo?id=${treatment.id}`)}
            />
          ))}
        </div>

        {filteredTreatments.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg font-medium text-foreground">No treatments found</p>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
