"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

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

interface TrialMapViewProps {
  trials: MapTrial[]
  selectedTrial: MapTrial | null
  onTrialSelect: (trial: MapTrial | null) => void
  center: { lat: number; lng: number }
}

// US State coordinates for the map
const usStates = [
  { name: "Washington", abbr: "WA", lat: 47.4, lng: -120.5 },
  { name: "Oregon", abbr: "OR", lat: 43.8, lng: -120.5 },
  { name: "California", abbr: "CA", lat: 36.8, lng: -119.4 },
  { name: "Nevada", abbr: "NV", lat: 38.8, lng: -116.4 },
  { name: "Idaho", abbr: "ID", lat: 44.1, lng: -114.7 },
  { name: "Montana", abbr: "MT", lat: 46.9, lng: -110.4 },
  { name: "Wyoming", abbr: "WY", lat: 43.1, lng: -107.6 },
  { name: "Utah", abbr: "UT", lat: 39.3, lng: -111.7 },
  { name: "Colorado", abbr: "CO", lat: 39.1, lng: -105.4 },
  { name: "Arizona", abbr: "AZ", lat: 34.0, lng: -111.1 },
  { name: "New Mexico", abbr: "NM", lat: 34.5, lng: -106.0 },
  { name: "North Dakota", abbr: "ND", lat: 47.5, lng: -100.5 },
  { name: "South Dakota", abbr: "SD", lat: 43.9, lng: -100.0 },
  { name: "Nebraska", abbr: "NE", lat: 41.5, lng: -100.0 },
  { name: "Kansas", abbr: "KS", lat: 38.5, lng: -98.8 },
  { name: "Oklahoma", abbr: "OK", lat: 35.0, lng: -97.1 },
  { name: "Texas", abbr: "TX", lat: 31.0, lng: -100.0 },
  { name: "Minnesota", abbr: "MN", lat: 46.4, lng: -94.6 },
  { name: "Iowa", abbr: "IA", lat: 42.0, lng: -93.2 },
  { name: "Missouri", abbr: "MO", lat: 38.6, lng: -92.6 },
  { name: "Arkansas", abbr: "AR", lat: 35.2, lng: -92.4 },
  { name: "Louisiana", abbr: "LA", lat: 30.9, lng: -92.3 },
  { name: "Wisconsin", abbr: "WI", lat: 43.8, lng: -89.7 },
  { name: "Illinois", abbr: "IL", lat: 40.6, lng: -89.0 },
  { name: "Michigan", abbr: "MI", lat: 44.3, lng: -85.6 },
  { name: "Indiana", abbr: "IN", lat: 40.3, lng: -86.1 },
  { name: "Ohio", abbr: "OH", lat: 40.4, lng: -82.8 },
  { name: "Kentucky", abbr: "KY", lat: 37.8, lng: -84.3 },
  { name: "Tennessee", abbr: "TN", lat: 35.5, lng: -86.6 },
  { name: "Mississippi", abbr: "MS", lat: 32.4, lng: -89.7 },
  { name: "Alabama", abbr: "AL", lat: 32.3, lng: -86.9 },
  { name: "Georgia", abbr: "GA", lat: 32.7, lng: -83.6 },
  { name: "Florida", abbr: "FL", lat: 27.7, lng: -81.5 },
  { name: "South Carolina", abbr: "SC", lat: 33.8, lng: -81.2 },
  { name: "North Carolina", abbr: "NC", lat: 35.8, lng: -79.0 },
  { name: "Virginia", abbr: "VA", lat: 37.4, lng: -78.7 },
  { name: "West Virginia", abbr: "WV", lat: 38.6, lng: -80.4 },
  { name: "Maryland", abbr: "MD", lat: 39.0, lng: -76.6 },
  { name: "Delaware", abbr: "DE", lat: 39.2, lng: -75.5 },
  { name: "New Jersey", abbr: "NJ", lat: 40.1, lng: -74.4 },
  { name: "Pennsylvania", abbr: "PA", lat: 41.2, lng: -77.2 },
  { name: "New York", abbr: "NY", lat: 43.0, lng: -75.5 },
  { name: "Connecticut", abbr: "CT", lat: 41.6, lng: -72.7 },
  { name: "Rhode Island", abbr: "RI", lat: 41.7, lng: -71.5 },
  { name: "Massachusetts", abbr: "MA", lat: 42.4, lng: -71.4 },
  { name: "Vermont", abbr: "VT", lat: 44.0, lng: -72.7 },
  { name: "New Hampshire", abbr: "NH", lat: 43.2, lng: -71.6 },
  { name: "Maine", abbr: "ME", lat: 45.3, lng: -68.9 },
]

export function TrialMapView({ trials, selectedTrial, onTrialSelect }: TrialMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // Convert lat/lng to x/y coordinates for the map
  const latLngToXY = (lat: number, lng: number) => {
    // Map bounds for continental US
    const minLat = 24
    const maxLat = 50
    const minLng = -125
    const maxLng = -66

    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100

    return { x, y }
  }

  return (
    <div ref={mapRef} className="relative h-full w-full bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Map Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* US Map Grid Overlay */}
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.1"
                className="text-border"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* State labels */}
          {usStates.map((state) => {
            const { x, y } = latLngToXY(state.lat, state.lng)
            if (x < 0 || x > 100 || y < 0 || y > 100) return null
            return (
              <text
                key={state.abbr}
                x={x}
                y={y}
                className="fill-muted-foreground/30 text-[1.5px] font-medium"
                textAnchor="middle"
              >
                {state.abbr}
              </text>
            )
          })}
        </svg>

        {/* Trial Markers */}
        {trials.map((trial) => {
          const { x, y } = latLngToXY(trial.location.lat, trial.location.lng)
          const isSelected = selectedTrial?.id === trial.id

          return (
            <button
              key={trial.id}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all ${
                isSelected ? "z-20 scale-125" : "hover:z-20 hover:scale-110"
              }`}
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => onTrialSelect(isSelected ? null : trial)}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${
                  trial.status === "Recruiting"
                    ? "bg-success"
                    : trial.status === "Active"
                    ? "bg-primary"
                    : "bg-warning"
                } ${isSelected ? "ring-4 ring-background" : ""}`}
              >
                <MapPin className="h-4 w-4 text-white" />
              </div>
              {/* Pulse animation for recruiting trials */}
              {trial.status === "Recruiting" && (
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-30" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 rounded-lg border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
        <h4 className="mb-3 text-sm font-semibold text-foreground">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Recruiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Not yet recruiting</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute right-6 top-6 rounded-lg border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{trials.length}</div>
            <div className="text-xs text-muted-foreground">Total Trials</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">
              {trials.filter((t) => t.status === "Recruiting").length}
            </div>
            <div className="text-xs text-muted-foreground">Recruiting</div>
          </div>
        </div>
      </div>
    </div>
  )
}
