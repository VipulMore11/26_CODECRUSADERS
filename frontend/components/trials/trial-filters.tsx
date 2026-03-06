"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { TrialFiltersState } from "@/app/trials/types"

interface TrialFiltersProps {
  filters: TrialFiltersState
  onFiltersChange: (filters: TrialFiltersState) => void
  diseaseCategories: string[]
  tags: string[]
}

const phases = ["Phase 1", "Phase 2", "Phase 3", "Phase 4"]
const statuses = ["Recruiting", "Active", "Not yet recruiting", "Completed"]

export function TrialFilters({
  filters,
  onFiltersChange,
  diseaseCategories,
  tags,
}: TrialFiltersProps) {
  const toggleArrayFilter = (
    key: keyof Pick<TrialFiltersState, "phases" | "statuses" | "diseaseCategories" | "tags">,
    value: string
  ) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [key]: updated })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      search: filters.search,
      phases: [],
      statuses: [],
      diseaseCategories: [],
      locations: [],
      tags: [],
    })
  }

  const totalActiveFilters =
    filters.phases.length +
    filters.statuses.length +
    filters.diseaseCategories.length +
    filters.tags.length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        {totalActiveFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["phase", "status", "category", "tags"]} className="space-y-2">
        {/* Phase Filter */}
        <AccordionItem value="phase" className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              Trial Phase
              {filters.phases.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {filters.phases.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {phases.map((phase) => (
                <div key={phase} className="flex items-center gap-2">
                  <Checkbox
                    id={`phase-${phase}`}
                    checked={filters.phases.includes(phase)}
                    onCheckedChange={() => toggleArrayFilter("phases", phase)}
                  />
                  <Label htmlFor={`phase-${phase}`} className="cursor-pointer text-sm">
                    {phase}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Status Filter */}
        <AccordionItem value="status" className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              Status
              {filters.statuses.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {filters.statuses.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {statuses.map((status) => (
                <div key={status} className="flex items-center gap-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onCheckedChange={() => toggleArrayFilter("statuses", status)}
                  />
                  <Label htmlFor={`status-${status}`} className="cursor-pointer text-sm">
                    <span
                      className={`inline-flex items-center gap-1.5 ${status === "Recruiting"
                          ? "text-success"
                          : status === "Active"
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${status === "Recruiting"
                            ? "bg-success"
                            : status === "Active"
                              ? "bg-primary"
                              : "bg-muted-foreground"
                          }`}
                      />
                      {status}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Disease Category Filter */}
        <AccordionItem value="category" className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              Disease Category
              {filters.diseaseCategories.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {filters.diseaseCategories.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              {diseaseCategories.map((category) => (
                <div key={category} className="flex items-center gap-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.diseaseCategories.includes(category)}
                    onCheckedChange={() => toggleArrayFilter("diseaseCategories", category)}
                  />
                  <Label htmlFor={`category-${category}`} className="cursor-pointer text-sm">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags Filter */}
        <AccordionItem value="tags" className="rounded-lg border border-border bg-card px-4">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              Special Tags
              {filters.tags.length > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleArrayFilter("tags", tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
