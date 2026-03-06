"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TrialFilters } from "@/components/trials/trial-filters"
import { TrialCard } from "@/components/trials/trial-card"
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
import { ClinicalTrial, TrialFiltersState } from "./types"
import { mockTrials } from "./data"

const diseaseCategories = [...new Set(mockTrials.map((t) => t.diseaseCategory))]
const allTags = [...new Set(mockTrials.flatMap((t: ClinicalTrial) => t.tags))]

export default function TrialsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
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

  const handleTrialClick = (trial: ClinicalTrial) => {
    router.push(`/trials/briefinfo?id=${trial.id}`)
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
                    onClick={() => handleTrialClick(trial)}
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
