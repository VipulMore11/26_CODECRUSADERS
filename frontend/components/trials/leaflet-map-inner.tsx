"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import { MapPin } from "lucide-react"
import { ClinicalTrial } from "@/app/trials/types"
import L from "leaflet"
import { renderToStaticMarkup } from "react-dom/server"

interface LeafletMapInnerProps {
    trials: ClinicalTrial[]
    selectedTrial: ClinicalTrial | null
    onTrialSelect: (trial: ClinicalTrial | null) => void
    center: { lat: number; lng: number }
}

function MapController({ selectedTrial }: { selectedTrial: ClinicalTrial | null }) {
    const map = useMap()

    useEffect(() => {
        if (selectedTrial && map) {
            map.flyTo([selectedTrial.location.lat, selectedTrial.location.lng], 10, {
                duration: 1.5,
            })
        }
    }, [selectedTrial, map])

    return null
}

const createCustomIcon = (status: string, isSelected: boolean) => {
    const colorClass = status === "Recruiting"
        ? "bg-success"
        : status === "Active"
            ? "bg-primary"
            : "bg-warning"

    const html = renderToStaticMarkup(
        <div className={`relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${colorClass} ${isSelected ? "ring-4 ring-white scale-125" : "hover:scale-110"} transition-all duration-200`}>
            <MapPin className="h-4 w-4 text-white" />
            {status === "Recruiting" && (
                <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-30" />
            )}
        </div>
    )

    return L.divIcon({
        html,
        className: "custom-div-icon",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })
}

export default function LeafletMapInner({ trials, selectedTrial, onTrialSelect, center }: LeafletMapInnerProps) {
    return (
        <MapContainer
            center={[center.lat, center.lng]}
            zoom={4}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
            scrollWheelZoom={true}
            className="z-0"
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <MapController selectedTrial={selectedTrial} />

            {trials.map((trial) => (
                <Marker
                    key={trial.id}
                    position={[trial.location.lat, trial.location.lng]}
                    icon={createCustomIcon(trial.status, selectedTrial?.id === trial.id)}
                    eventHandlers={{
                        click: () => onTrialSelect(selectedTrial?.id === trial.id ? null : trial),
                    }}
                />
            ))}
        </MapContainer>
    )
}
