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
    briefDescription: string
    fullDescription: string
    collaborators: string[]
    investigators: string[]
    contacts: { name: string; role: string; email: string; phone: string }[]
    locations: { name: string; city: string; state: string; country: string }[]
    interventions: { type: string; name: string; description: string }[]
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
