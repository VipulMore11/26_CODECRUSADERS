"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
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
import { mockTrials } from "../data"
import { ClinicalTrial } from "../types"

export default function TrialMapPage() {
  const [search, setSearch] = useState("")
  const [selectedTrial, setSelectedTrial] = useState<ClinicalTrial | null>(null)
  const [distanceFilter, setDistanceFilter] = useState([500])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [userLocation] = useState({ lat: 39.8283, lng: -98.5795 }) // Center of USA

  const filteredTrials = useMemo(() => {
    return mockTrials.filter((trial) => {
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
                  className={`cursor-pointer transition-all hover:border-primary/50 ${selectedTrial?.id === trial.id ? "border-primary bg-primary/5" : ""
                    }`}
                  onClick={() => setSelectedTrial(trial)}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {trial.phase}
                      </Badge>
                      <Badge
                        className={`text-xs ${trial.status === "Recruiting"
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
                  <Link href={`/trials/briefinfo?id=${selectedTrial.id}`}>
                    View Details
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}
