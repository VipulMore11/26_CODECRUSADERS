"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ClinicalTrial } from "@/app/trials/types"

// Dynamically import the internal Leaflet map with SSR disabled
const LeafletMapInner = dynamic(() => import("./leaflet-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/20">
      <p className="text-muted-foreground">Loading Map Explorer...</p>
    </div>
  )
})

interface TrialMapViewProps {
  trials: ClinicalTrial[]
  selectedTrial: ClinicalTrial | null
  onTrialSelect: (trial: ClinicalTrial | null) => void
  center: { lat: number; lng: number }
}

export function TrialMapView(props: TrialMapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">Initializing...</p>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <LeafletMapInner {...props} />
    </div>
  )
}
