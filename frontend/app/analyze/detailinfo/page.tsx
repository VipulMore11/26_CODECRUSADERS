"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TreatmentDetail } from "@/components/analyze/treatment-detail"
import { treatments } from "@/app/analyze/data"

function AnalyzeDetailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get("id")

    const treatment = treatments.find(t => t.id === id)

    if (!treatment) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold">Treatment Not Found</h2>
                <p className="text-muted-foreground">The treatment you are looking for does not exist or has been moved.</p>
                <button
                    onClick={() => router.push("/analyze")}
                    className="text-primary hover:underline"
                >
                    Back to all treatments
                </button>
            </div>
        )
    }

    return <TreatmentDetail treatment={treatment} onBack={() => router.push("/analyze")} />
}

export default function AnalyzeDetailPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading treatment details...</div>}>
                    <AnalyzeDetailContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
