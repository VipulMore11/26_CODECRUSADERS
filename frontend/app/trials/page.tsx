"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TrialCard, type Trial } from "@/components/trial-card"
import { TrialsFilter, TrialsFilterSidebar, type FilterState } from "@/components/trials-filter"

// Mock data for clinical trials
const mockTrials: Trial[] = [
  {
    id: "NCT001",
    title: "A Phase 3 Study of Novel CAR-T Cell Therapy for Advanced Non-Small Cell Lung Cancer",
    sponsor: "National Cancer Institute",
    phase: "Phase 3",
    status: "Recruiting",
    conditions: ["Lung Cancer", "NSCLC", "Oncology"],
    location: "Boston, MA",
    distance: "12 mi",
    enrollmentTarget: 500,
    currentEnrollment: 342,
    startDate: "Jan 2024",
    tags: ["Adults"],
    matchScore: 94,
  },
  {
    id: "NCT002",
    title: "Efficacy of GLP-1 Receptor Agonist in Type 2 Diabetes with Cardiovascular Comorbidities",
    sponsor: "Novo Nordisk",
    phase: "Phase 2",
    status: "Recruiting",
    conditions: ["Type 2 Diabetes", "Cardiovascular Disease"],
    location: "New York, NY",
    distance: "8 mi",
    enrollmentTarget: 1200,
    currentEnrollment: 876,
    startDate: "Mar 2024",
    tags: ["Seniors (65+)"],
    matchScore: 87,
  },
  {
    id: "NCT003",
    title: "Immunotherapy Combination Trial for Triple-Negative Breast Cancer",
    sponsor: "Memorial Sloan Kettering",
    phase: "Phase 2",
    status: "Recruiting",
    conditions: ["Breast Cancer", "Triple-Negative"],
    location: "Houston, TX",
    distance: "45 mi",
    enrollmentTarget: 300,
    currentEnrollment: 156,
    startDate: "Feb 2024",
    tags: [],
    matchScore: 82,
  },
  {
    id: "NCT004",
    title: "Alzheimer's Disease Prevention Study with Monoclonal Antibody Therapy",
    sponsor: "Eli Lilly",
    phase: "Phase 3",
    status: "Active",
    conditions: ["Alzheimer's", "Neurological", "Cognitive Decline"],
    location: "Chicago, IL",
    distance: "23 mi",
    enrollmentTarget: 800,
    currentEnrollment: 654,
    startDate: "Nov 2023",
    tags: ["Seniors (65+)"],
    matchScore: 76,
  },
  {
    id: "NCT005",
    title: "Pediatric Asthma Management with Biologic Therapy",
    sponsor: "Children's Hospital Network",
    phase: "Phase 2",
    status: "Recruiting",
    conditions: ["Asthma", "Respiratory", "Pediatric"],
    location: "Philadelphia, PA",
    distance: "15 mi",
    enrollmentTarget: 200,
    currentEnrollment: 89,
    startDate: "Apr 2024",
    tags: ["Pediatric"],
    matchScore: 71,
  },
  {
    id: "NCT006",
    title: "Novel mRNA Vaccine for Prevention of Lyme Disease",
    sponsor: "Moderna Therapeutics",
    phase: "Phase 1",
    status: "Recruiting",
    conditions: ["Infectious Disease", "Lyme Disease"],
    location: "Seattle, WA",
    distance: "156 mi",
    enrollmentTarget: 150,
    currentEnrollment: 45,
    startDate: "May 2024",
    tags: ["Adults"],
    matchScore: 68,
  },
  {
    id: "NCT007",
    title: "Athletic Performance Recovery Study with Regenerative Medicine",
    sponsor: "Sports Medicine Research Center",
    phase: "Phase 2",
    status: "Recruiting",
    conditions: ["Musculoskeletal", "Sports Injury"],
    location: "Los Angeles, CA",
    distance: "32 mi",
    enrollmentTarget: 100,
    currentEnrollment: 67,
    startDate: "Jun 2024",
    tags: ["Athletes"],
    matchScore: 65,
  },
  {
    id: "NCT008",
    title: "Rheumatoid Arthritis JAK Inhibitor Long-term Safety Study",
    sponsor: "Pfizer",
    phase: "Phase 4",
    status: "Active",
    conditions: ["Rheumatoid Arthritis", "Autoimmune"],
    location: "San Francisco, CA",
    distance: "28 mi",
    enrollmentTarget: 600,
    currentEnrollment: 589,
    startDate: "Sep 2023",
    tags: [],
    matchScore: 59,
  },
  {
    id: "NCT009",
    title: "Gestational Diabetes Prevention Trial in High-Risk Pregnancies",
    sponsor: "NIH NICHD",
    phase: "Phase 3",
    status: "Recruiting",
    conditions: ["Gestational Diabetes", "Pregnancy"],
    location: "Denver, CO",
    distance: "67 mi",
    enrollmentTarget: 400,
    currentEnrollment: 213,
    startDate: "Jan 2024",
    tags: ["Pregnant Women"],
    matchScore: 54,
  },
  {
    id: "NCT010",
    title: "PTSD Treatment Study for Military Veterans Using Psychedelic-Assisted Therapy",
    sponsor: "VA Medical Center",
    phase: "Phase 2",
    status: "Recruiting",
    conditions: ["PTSD", "Mental Health", "Anxiety"],
    location: "San Diego, CA",
    distance: "89 mi",
    enrollmentTarget: 250,
    currentEnrollment: 78,
    startDate: "Mar 2024",
    tags: ["Veterans"],
    matchScore: 48,
  },
]

export default function TrialsPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    phase: "",
    condition: "",
    location: "",
    distance: "",
    tags: [],
  })

  const filteredTrials = useMemo(() => {
    return mockTrials.filter((trial) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          trial.title.toLowerCase().includes(searchLower) ||
          trial.sponsor.toLowerCase().includes(searchLower) ||
          trial.conditions.some((c) => c.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status && trial.status !== filters.status) return false

      // Phase filter
      if (filters.phase && trial.phase !== filters.phase) return false

      // Condition filter
      if (filters.condition) {
        const matchesCondition = trial.conditions.some((c) =>
          c.toLowerCase().includes(filters.condition.toLowerCase())
        )
        if (!matchesCondition) return false
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const matchesTags = filters.tags.some((tag) => trial.tags.includes(tag))
        if (!matchesTags) return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Clinical Trials Explorer</h1>
            <p className="mt-2 text-muted-foreground">
              Browse and filter through thousands of active clinical trials worldwide
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters (Desktop) */}
            <TrialsFilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              totalResults={filteredTrials.length}
            />

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Top Filters */}
              <TrialsFilter
                filters={filters}
                onFilterChange={setFilters}
                totalResults={filteredTrials.length}
              />

              {/* Trials Grid */}
              {filteredTrials.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredTrials.map((trial) => (
                    <TrialCard key={trial.id} trial={trial} showMatchScore />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                  <p className="text-lg font-medium">No trials found</p>
                  <p className="mt-1 text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
