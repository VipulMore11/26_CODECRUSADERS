"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TrialFilters } from "@/components/trials/trial-filters"
import { TrialCard } from "@/components/trials/trial-card"
import { TrialDetail } from "@/components/trials/trial-detail"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Map, List, SlidersHorizontal } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface ClinicalTrial {
  id: string
  name: string
  phase: "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4"
  status: "Recruiting" | "Active" | "Completed" | "Not yet recruiting"
  condition: string
  diseaseCategory: string
  intervention: string
  sponsor: string
  location: { city: string; state: string; country: string; lat: number; lng: number }
  description: string
  eligibilityCriteria: {
    inclusion: string[]
    exclusion: string[]
  }
  tags: string[]
  enrollmentCount: number
  startDate: string
  estimatedCompletionDate: string
}

export interface TrialFiltersState {
  search: string
  phases: string[]
  statuses: string[]
  diseaseCategories: string[]
  locations: string[]
  tags: string[]
}

const mockTrials: ClinicalTrial[] = [
  {
    id: "NCT05123456",
    name: "STRIDE-DM: Novel GLP-1 Agonist for Type 2 Diabetes",
    phase: "Phase 3",
    status: "Recruiting",
    condition: "Type 2 Diabetes Mellitus",
    diseaseCategory: "Diabetes",
    intervention: "Drug: XR-4521 (GLP-1 Agonist)",
    sponsor: "BioMedical Research Institute",
    location: { city: "Boston", state: "MA", country: "USA", lat: 42.3601, lng: -71.0589 },
    description: "A randomized, double-blind study evaluating a novel GLP-1 receptor agonist in patients with Type 2 Diabetes and established cardiovascular disease.",
    eligibilityCriteria: {
      inclusion: ["Age 45-70 years", "Type 2 Diabetes diagnosis", "HbA1c 7.0-10.0%", "On stable metformin therapy"],
      exclusion: ["Type 1 Diabetes", "Severe kidney disease", "History of pancreatitis"],
    },
    tags: ["Cardiovascular", "Adult"],
    enrollmentCount: 1200,
    startDate: "2024-03-01",
    estimatedCompletionDate: "2026-12-01",
  },
  {
    id: "NCT05234567",
    name: "HEART-SAFE: Combination Therapy for Diabetes and Hypertension",
    phase: "Phase 2",
    status: "Recruiting",
    condition: "Diabetes with Hypertension",
    diseaseCategory: "Cardiovascular",
    intervention: "Drug: CardioMet Plus",
    sponsor: "CardioMetabolic Research Center",
    location: { city: "Chicago", state: "IL", country: "USA", lat: 41.8781, lng: -87.6298 },
    description: "Evaluating a novel combination therapy targeting both blood glucose and blood pressure control.",
    eligibilityCriteria: {
      inclusion: ["Type 2 Diabetes", "Hypertension", "Age 40-75", "Stable medication regimen"],
      exclusion: ["Heart failure", "Severe hepatic impairment", "Pregnancy"],
    },
    tags: ["Hypertension", "Adult"],
    enrollmentCount: 450,
    startDate: "2024-06-15",
    estimatedCompletionDate: "2026-06-15",
  },
  {
    id: "NCT05345678",
    name: "ONCO-IMMUNE: Immunotherapy for Advanced Lung Cancer",
    phase: "Phase 3",
    status: "Recruiting",
    condition: "Non-Small Cell Lung Cancer",
    diseaseCategory: "Oncology",
    intervention: "Biological: PD-L1 Inhibitor + Chemotherapy",
    sponsor: "Global Oncology Consortium",
    location: { city: "Houston", state: "TX", country: "USA", lat: 29.7604, lng: -95.3698 },
    description: "Combining novel immunotherapy with standard chemotherapy for first-line treatment of advanced NSCLC.",
    eligibilityCriteria: {
      inclusion: ["Stage IIIB/IV NSCLC", "ECOG 0-1", "Adequate organ function", "No prior systemic therapy"],
      exclusion: ["Autoimmune disease", "Active brain metastases", "Current immunosuppressive therapy"],
    },
    tags: ["Cancer", "Immunotherapy", "Adult"],
    enrollmentCount: 800,
    startDate: "2024-01-15",
    estimatedCompletionDate: "2027-01-15",
  },
  {
    id: "NCT05456789",
    name: "NEURO-PROTECT: Neuroprotection in Early Parkinson's",
    phase: "Phase 2",
    status: "Recruiting",
    condition: "Parkinson's Disease",
    diseaseCategory: "Neurology",
    intervention: "Drug: NP-2147",
    sponsor: "NeuroScience Foundation",
    location: { city: "San Francisco", state: "CA", country: "USA", lat: 37.7749, lng: -122.4194 },
    description: "Testing a disease-modifying therapy to slow progression in early-stage Parkinson's disease.",
    eligibilityCriteria: {
      inclusion: ["Early Parkinson's diagnosis (<3 years)", "Age 50-75", "Hoehn & Yahr Stage 1-2"],
      exclusion: ["Dementia", "Other parkinsonian syndromes", "Significant psychiatric illness"],
    },
    tags: ["Neurological", "Senior", "Disease Modification"],
    enrollmentCount: 300,
    startDate: "2024-09-01",
    estimatedCompletionDate: "2028-09-01",
  },
  {
    id: "NCT05567890",
    name: "FLEX-JOINT: Biologic for Rheumatoid Arthritis",
    phase: "Phase 3",
    status: "Active",
    condition: "Rheumatoid Arthritis",
    diseaseCategory: "Autoimmune",
    intervention: "Biological: JAK Inhibitor",
    sponsor: "Arthritis Research Alliance",
    location: { city: "Seattle", state: "WA", country: "USA", lat: 47.6062, lng: -122.3321 },
    description: "Evaluating efficacy and safety of a novel JAK inhibitor in patients with moderate-to-severe RA.",
    eligibilityCriteria: {
      inclusion: ["Active RA for 6+ months", "Inadequate response to methotrexate", "Age 18-80"],
      exclusion: ["Active infections", "History of VTE", "Current biologic therapy"],
    },
    tags: ["Autoimmune", "Adult", "Biologic"],
    enrollmentCount: 550,
    startDate: "2023-06-01",
    estimatedCompletionDate: "2025-12-01",
  },
  {
    id: "NCT05678901",
    name: "BREATH-EASY: Novel Therapy for Severe Asthma",
    phase: "Phase 2",
    status: "Recruiting",
    condition: "Severe Asthma",
    diseaseCategory: "Respiratory",
    intervention: "Biological: Anti-TSLP Antibody",
    sponsor: "Respiratory Medicine Institute",
    location: { city: "Denver", state: "CO", country: "USA", lat: 39.7392, lng: -104.9903 },
    description: "Testing a new biologic therapy for patients with severe, uncontrolled asthma.",
    eligibilityCriteria: {
      inclusion: ["Severe asthma diagnosis", "On high-dose ICS+LABA", "Age 18-65", "2+ exacerbations/year"],
      exclusion: ["Current smoker", "Other respiratory diseases", "Recent exacerbation"],
    },
    tags: ["Respiratory", "Adult", "Biologic"],
    enrollmentCount: 400,
    startDate: "2024-04-01",
    estimatedCompletionDate: "2026-10-01",
  },
  {
    id: "NCT05789012",
    name: "YOUTH-STRONG: Exercise Intervention for Pediatric Obesity",
    phase: "Phase 3",
    status: "Recruiting",
    condition: "Pediatric Obesity",
    diseaseCategory: "Metabolic",
    intervention: "Behavioral: Structured Exercise Program",
    sponsor: "Children's Health Research Center",
    location: { city: "Philadelphia", state: "PA", country: "USA", lat: 39.9526, lng: -75.1652 },
    description: "Comprehensive exercise and lifestyle intervention for adolescents with obesity.",
    eligibilityCriteria: {
      inclusion: ["Age 12-17", "BMI > 95th percentile", "Parent/guardian consent", "Medical clearance"],
      exclusion: ["Endocrine disorders", "Physical limitations", "Current weight loss medication"],
    },
    tags: ["Pediatric", "Lifestyle", "Obesity"],
    enrollmentCount: 250,
    startDate: "2024-08-01",
    estimatedCompletionDate: "2026-08-01",
  },
  {
    id: "NCT05890123",
    name: "ELITE-ATHLETE: Recovery Enhancement in Professional Athletes",
    phase: "Phase 2",
    status: "Not yet recruiting",
    condition: "Sports Injury Recovery",
    diseaseCategory: "Sports Medicine",
    intervention: "Device: Regenerative Therapy System",
    sponsor: "Sports Medicine Innovation Lab",
    location: { city: "Los Angeles", state: "CA", country: "USA", lat: 34.0522, lng: -118.2437 },
    description: "Advanced regenerative therapy for accelerating muscle and tendon recovery in elite athletes.",
    eligibilityCriteria: {
      inclusion: ["Professional or elite athlete", "Recent muscle/tendon injury", "Age 18-40"],
      exclusion: ["Systemic illness", "Prior regenerative therapy", "Current PED use"],
    },
    tags: ["Athlete", "Sports Medicine", "Regenerative"],
    enrollmentCount: 100,
    startDate: "2025-01-15",
    estimatedCompletionDate: "2026-07-15",
  },
  {
    id: "NCT05901234",
    name: "GOLDEN-YEARS: Frailty Prevention in Elderly",
    phase: "Phase 3",
    status: "Recruiting",
    condition: "Age-Related Frailty",
    diseaseCategory: "Geriatrics",
    intervention: "Combination: Exercise + Nutrition + Supplements",
    sponsor: "Geriatric Research Foundation",
    location: { city: "Miami", state: "FL", country: "USA", lat: 25.7617, lng: -80.1918 },
    description: "Multi-modal intervention to prevent frailty progression in community-dwelling elderly.",
    eligibilityCriteria: {
      inclusion: ["Age 70-90", "Pre-frail or mildly frail", "Community dwelling", "Independent in basic ADLs"],
      exclusion: ["Severe cognitive impairment", "Terminal illness", "Severe mobility limitations"],
    },
    tags: ["Senior", "Geriatric", "Prevention"],
    enrollmentCount: 600,
    startDate: "2024-02-01",
    estimatedCompletionDate: "2027-02-01",
  },
  {
    id: "NCT06012345",
    name: "WOMEN-FIRST: Breast Cancer Prevention Trial",
    phase: "Phase 3",
    status: "Recruiting",
    condition: "Breast Cancer Prevention",
    diseaseCategory: "Oncology",
    intervention: "Drug: Selective Estrogen Receptor Modulator",
    sponsor: "Women's Cancer Research Network",
    location: { city: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.0060 },
    description: "Evaluating a novel SERM for breast cancer prevention in high-risk women.",
    eligibilityCriteria: {
      inclusion: ["Female", "Age 35-70", "High breast cancer risk", "No prior breast cancer"],
      exclusion: ["Current HRT", "History of VTE", "Pregnancy or planning pregnancy"],
    },
    tags: ["Women", "Cancer Prevention", "Adult"],
    enrollmentCount: 3000,
    startDate: "2024-05-01",
    estimatedCompletionDate: "2030-05-01",
  },
]

const diseaseCategories = [...new Set(mockTrials.map((t) => t.diseaseCategory))]
const allTags = [...new Set(mockTrials.flatMap((t) => t.tags))]

export default function TrialsPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [selectedTrial, setSelectedTrial] = useState<ClinicalTrial | null>(null)
  const [filters, setFilters] = useState<TrialFiltersState>({
    search: "",
    phases: [],
    statuses: [],
    diseaseCategories: [],
    locations: [],
    tags: [],
  })

  const filteredTrials = useMemo(() => {
    return mockTrials.filter((trial) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          trial.name.toLowerCase().includes(searchLower) ||
          trial.condition.toLowerCase().includes(searchLower) ||
          trial.description.toLowerCase().includes(searchLower) ||
          trial.sponsor.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Phase filter
      if (filters.phases.length > 0 && !filters.phases.includes(trial.phase)) {
        return false
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(trial.status)) {
        return false
      }

      // Disease category filter
      if (
        filters.diseaseCategories.length > 0 &&
        !filters.diseaseCategories.includes(trial.diseaseCategory)
      ) {
        return false
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some((tag) => trial.tags.includes(tag))) {
        return false
      }

      return true
    })
  }, [filters])

  const activeFiltersCount =
    filters.phases.length +
    filters.statuses.length +
    filters.diseaseCategories.length +
    filters.tags.length

  if (selectedTrial) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <TrialDetail trial={selectedTrial} onBack={() => setSelectedTrial(null)} />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Clinical Trial Discovery</h1>
          <p className="text-muted-foreground">
            Browse and filter clinical trials from around the world. Find trials that match your needs.
          </p>
        </div>

        {/* Search and View Toggle */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search trials, conditions, sponsors..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <TrialFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    diseaseCategories={diseaseCategories}
                    tags={allTags}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "list" | "map")}>
              <TabsList>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">List</span>
                </TabsTrigger>
                <TabsTrigger value="map" className="gap-2" asChild>
                  <Link href="/trials/map">
                    <Map className="h-4 w-4" />
                    <span className="hidden sm:inline">Map</span>
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <TrialFilters
                filters={filters}
                onFiltersChange={setFilters}
                diseaseCategories={diseaseCategories}
                tags={allTags}
              />
            </div>
          </aside>

          {/* Trial Cards */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTrials.length} of {mockTrials.length} trials
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({
                      search: "",
                      phases: [],
                      statuses: [],
                      diseaseCategories: [],
                      locations: [],
                      tags: [],
                    })
                  }
                >
                  Clear all filters
                </Button>
              )}
            </div>

            {filteredTrials.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-lg font-medium text-foreground">No trials found</p>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredTrials.map((trial) => (
                  <TrialCard
                    key={trial.id}
                    trial={trial}
                    onClick={() => setSelectedTrial(trial)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
