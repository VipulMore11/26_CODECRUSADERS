"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { TrialMapView } from "@/components/trials/trial-map-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, List, Map, MapPin, X, ChevronRight, Users, Building } from "lucide-react"

interface MapTrial {
  id: string
  name: string
  phase: string
  status: string
  condition: string
  location: { city: string; state: string; country: string; lat: number; lng: number }
  sponsor: string
  enrollmentCount: number
}

const mockMapTrials: MapTrial[] = [
  { id: "NCT05123456", name: "STRIDE-DM: Novel GLP-1 Agonist for Type 2 Diabetes", phase: "Phase 3", status: "Recruiting", condition: "Type 2 Diabetes", location: { city: "Boston", state: "MA", country: "USA", lat: 42.3601, lng: -71.0589 }, sponsor: "BioMedical Research Institute", enrollmentCount: 1200 },
  { id: "NCT05234567", name: "HEART-SAFE: Combination Therapy for Diabetes and Hypertension", phase: "Phase 2", status: "Recruiting", condition: "Diabetes with Hypertension", location: { city: "Chicago", state: "IL", country: "USA", lat: 41.8781, lng: -87.6298 }, sponsor: "CardioMetabolic Research Center", enrollmentCount: 450 },
  { id: "NCT05345678", name: "ONCO-IMMUNE: Immunotherapy for Advanced Lung Cancer", phase: "Phase 3", status: "Recruiting", condition: "Non-Small Cell Lung Cancer", location: { city: "Houston", state: "TX", country: "USA", lat: 29.7604, lng: -95.3698 }, sponsor: "Global Oncology Consortium", enrollmentCount: 800 },
  { id: "NCT05456789", name: "NEURO-PROTECT: Neuroprotection in Early Parkinson's", phase: "Phase 2", status: "Recruiting", condition: "Parkinson's Disease", location: { city: "San Francisco", state: "CA", country: "USA", lat: 37.7749, lng: -122.4194 }, sponsor: "NeuroScience Foundation", enrollmentCount: 300 },
  { id: "NCT05567890", name: "FLEX-JOINT: Biologic for Rheumatoid Arthritis", phase: "Phase 3", status: "Active", condition: "Rheumatoid Arthritis", location: { city: "Seattle", state: "WA", country: "USA", lat: 47.6062, lng: -122.3321 }, sponsor: "Arthritis Research Alliance", enrollmentCount: 550 },
  { id: "NCT05678901", name: "BREATH-EASY: Novel Therapy for Severe Asthma", phase: "Phase 2", status: "Recruiting", condition: "Severe Asthma", location: { city: "Denver", state: "CO", country: "USA", lat: 39.7392, lng: -104.9903 }, sponsor: "Respiratory Medicine Institute", enrollmentCount: 400 },
  { id: "NCT05789012", name: "YOUTH-STRONG: Exercise Intervention for Pediatric Obesity", phase: "Phase 3", status: "Recruiting", condition: "Pediatric Obesity", location: { city: "Philadelphia", state: "PA", country: "USA", lat: 39.9526, lng: -75.1652 }, sponsor: "Children's Health Research Center", enrollmentCount: 250 },
  { id: "NCT05890123", name: "ELITE-ATHLETE: Recovery Enhancement in Professional Athletes", phase: "Phase 2", status: "Not yet recruiting", condition: "Sports Injury Recovery", location: { city: "Los Angeles", state: "CA", country: "USA", lat: 34.0522, lng: -118.2437 }, sponsor: "Sports Medicine Innovation Lab", enrollmentCount: 100 },
  { id: "NCT05901234", name: "GOLDEN-YEARS: Frailty Prevention in Elderly", phase: "Phase 3", status: "Recruiting", condition: "Age-Related Frailty", location: { city: "Miami", state: "FL", country: "USA", lat: 25.7617, lng: -80.1918 }, sponsor: "Geriatric Research Foundation", enrollmentCount: 600 },
  { id: "NCT06012345", name: "WOMEN-FIRST: Breast Cancer Prevention Trial", phase: "Phase 3", status: "Recruiting", condition: "Breast Cancer Prevention", location: { city: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.0060 }, sponsor: "Women's Cancer Research Network", enrollmentCount: 3000 },
  { id: "NCT06112233", name: "CARDIO-RESTORE: Stem Cell Therapy for Heart Failure", phase: "Phase 2", status: "Recruiting", condition: "Heart Failure", location: { city: "Cleveland", state: "OH", country: "USA", lat: 41.4993, lng: -81.6944 }, sponsor: "Cleveland Heart Institute", enrollmentCount: 200 },
  { id: "NCT06223344", name: "SLEEP-WELL: Treatment for Chronic Insomnia", phase: "Phase 3", status: "Recruiting", condition: "Chronic Insomnia", location: { city: "Phoenix", state: "AZ", country: "USA", lat: 33.4484, lng: -112.0740 }, sponsor: "Sleep Research Center", enrollmentCount: 500 },
]

export default function TrialMapPage() {
  const [search, setSearch] = useState("")
  const [selectedTrial, setSelectedTrial] = useState<MapTrial | null>(null)
  const [distanceFilter, setDistanceFilter] = useState([500])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userLocation] = useState({ lat: 39.8283, lng: -98.5795 }) // Center of USA

  const filteredTrials = useMemo(() => {
    return mockMapTrials.filter((trial) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          trial.name.toLowerCase().includes(searchLower) ||
          trial.condition.toLowerCase().includes(searchLower) ||
          trial.location.city.toLowerCase().includes(searchLower) ||
          trial.location.state.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== "all" && trial.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [search, statusFilter])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-96 flex-col border-r border-border bg-card">
          {/* Header */}
          <div className="border-b border-border p-4">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-xl font-bold text-foreground">Trial Map Explorer</h1>
              <Tabs defaultValue="map">
                <TabsList className="h-8">
                  <TabsTrigger value="list" className="h-7 px-2" asChild>
                    <Link href="/trials">
                      <List className="h-4 w-4" />
                    </Link>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="h-7 px-2">
                    <Map className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search trials, locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Recruiting">Recruiting</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Not yet recruiting">Not yet recruiting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Distance: {distanceFilter[0]} miles
                </label>
                <Slider
                  value={distanceFilter}
                  onValueChange={setDistanceFilter}
                  max={1000}
                  min={10}
                  step={10}
                  className="py-2"
                />
              </div>
            </div>
          </div>

          {/* Trial List */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-3 text-sm text-muted-foreground">
              {filteredTrials.length} trials found
            </p>
            <div className="space-y-3">
              {filteredTrials.map((trial) => (
                <Card
                  key={trial.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedTrial?.id === trial.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedTrial(trial)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {trial.phase}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          trial.status === "Recruiting"
                            ? "bg-success text-success-foreground"
                            : trial.status === "Active"
                            ? "bg-primary text-primary-foreground"
                            : "bg-warning text-warning-foreground"
                        }`}
                      >
                        {trial.status}
                      </Badge>
                    </div>
                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-foreground">
                      {trial.name}
                    </h3>
                    <p className="mb-2 text-xs text-primary">{trial.condition}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {trial.location.city}, {trial.location.state}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Map */}
        <main className="relative flex-1">
          <TrialMapView
            trials={filteredTrials}
            selectedTrial={selectedTrial}
            onTrialSelect={setSelectedTrial}
            center={userLocation}
          />

          {/* Selected Trial Popup */}
          {selectedTrial && (
            <Card className="absolute bottom-6 left-6 right-6 z-10 max-w-md shadow-xl md:left-auto">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary">{selectedTrial.phase}</Badge>
                      <Badge
                        className={
                          selectedTrial.status === "Recruiting"
                            ? "bg-success text-success-foreground"
                            : "bg-primary text-primary-foreground"
                        }
                      >
                        {selectedTrial.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{selectedTrial.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTrial(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 font-medium text-primary">{selectedTrial.condition}</p>
                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedTrial.location.city}, {selectedTrial.location.state}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {selectedTrial.enrollmentCount} enrolled
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    {selectedTrial.sponsor}
                  </div>
                </div>
                <Button asChild className="w-full gap-2">
                  <Link href={`/trials`}>
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
