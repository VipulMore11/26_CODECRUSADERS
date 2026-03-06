"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, X, MapPin } from "lucide-react"

export interface FilterState {
  search: string
  status: string
  phase: string
  condition: string
  location: string
  distance: string
  tags: string[]
}

interface TrialsFilterProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  totalResults: number
}

const phases = ["All Phases", "Phase 1", "Phase 2", "Phase 3", "Phase 4"]
const statuses = ["All Statuses", "Recruiting", "Active", "Completed", "Suspended"]
const conditions = [
  "All Conditions",
  "Cancer",
  "Diabetes",
  "Cardiovascular",
  "Neurological",
  "Respiratory",
  "Autoimmune",
  "Infectious Disease",
]
const distances = ["Any Distance", "10 miles", "25 miles", "50 miles", "100 miles", "500 miles"]
const availableTags = [
  "Athletes",
  "Seniors (65+)",
  "Pediatric",
  "Pregnant Women",
  "Veterans",
  "First-time Patients",
]

export function TrialsFilter({ filters, onFilterChange, totalResults }: TrialsFilterProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    onFilterChange({ ...filters, [key]: value === "all" ? "" : value })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    updateFilter("tags", newTags)
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      status: "",
      phase: "",
      condition: "",
      location: "",
      distance: "",
      tags: [],
    })
  }

  const activeFilterCount = [
    filters.status,
    filters.phase,
    filters.condition,
    filters.distance,
    ...filters.tags,
  ].filter(Boolean).length

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={filters.status || "all"} onValueChange={(v) => updateFilter("status", v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status === "All Statuses" ? "all" : status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Phase</Label>
        <Select value={filters.phase || "all"} onValueChange={(v) => updateFilter("phase", v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Phases" />
          </SelectTrigger>
          <SelectContent>
            {phases.map((phase) => (
              <SelectItem key={phase} value={phase === "All Phases" ? "all" : phase}>
                {phase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select value={filters.condition || "all"} onValueChange={(v) => updateFilter("condition", v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            {conditions.map((condition) => (
              <SelectItem key={condition} value={condition === "All Conditions" ? "all" : condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="City, State or ZIP"
            value={filters.location}
            onChange={(e) => updateFilter("location", e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Distance</Label>
        <Select value={filters.distance || "all"} onValueChange={(v) => updateFilter("distance", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Any Distance" />
          </SelectTrigger>
          <SelectContent>
            {distances.map((distance) => (
              <SelectItem key={distance} value={distance === "Any Distance" ? "all" : distance}>
                {distance}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Population Tags</Label>
        <div className="space-y-2">
          {availableTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={tag}
                checked={filters.tags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <label
                htmlFor={tag}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search trials by keyword, condition, or sponsor..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Button */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2 lg:hidden">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Trials</SheetTitle>
              <SheetDescription>
                Narrow down clinical trials based on your criteria
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {filters.status}
              <button onClick={() => updateFilter("status", "")} aria-label="Remove status filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.phase && (
            <Badge variant="secondary" className="gap-1">
              {filters.phase}
              <button onClick={() => updateFilter("phase", "")} aria-label="Remove phase filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.condition && (
            <Badge variant="secondary" className="gap-1">
              {filters.condition}
              <button onClick={() => updateFilter("condition", "")} aria-label="Remove condition filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button onClick={() => toggleTag(tag)} aria-label={`Remove ${tag} filter`}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{totalResults}</span> clinical trials
      </div>
    </div>
  )
}

export function TrialsFilterSidebar({ filters, onFilterChange, totalResults }: TrialsFilterProps) {
  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    onFilterChange({ ...filters, [key]: value === "all" ? "" : value })
  }

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag]
    updateFilter("tags", newTags)
  }

  const clearFilters = () => {
    onFilterChange({
      search: "",
      status: "",
      phase: "",
      condition: "",
      location: "",
      distance: "",
      tags: [],
    })
  }

  const activeFilterCount = [
    filters.status,
    filters.phase,
    filters.condition,
    filters.distance,
    ...filters.tags,
  ].filter(Boolean).length

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24 space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status || "all"} onValueChange={(v) => updateFilter("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status === "All Statuses" ? "all" : status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Phase</Label>
          <Select value={filters.phase || "all"} onValueChange={(v) => updateFilter("phase", v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Phases" />
            </SelectTrigger>
            <SelectContent>
              {phases.map((phase) => (
                <SelectItem key={phase} value={phase === "All Phases" ? "all" : phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Condition</Label>
          <Select value={filters.condition || "all"} onValueChange={(v) => updateFilter("condition", v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition) => (
                <SelectItem key={condition} value={condition === "All Conditions" ? "all" : condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="City, State or ZIP"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Distance</Label>
          <Select value={filters.distance || "all"} onValueChange={(v) => updateFilter("distance", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any Distance" />
            </SelectTrigger>
            <SelectContent>
              {distances.map((distance) => (
                <SelectItem key={distance} value={distance === "Any Distance" ? "all" : distance}>
                  {distance}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Population Tags</Label>
          <div className="space-y-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`sidebar-${tag}`}
                  checked={filters.tags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <label
                  htmlFor={`sidebar-${tag}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
