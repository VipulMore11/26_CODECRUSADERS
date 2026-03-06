"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { TrialDetail } from "@/components/trials/trial-detail"
import { mockTrials } from "../data"
import { Button } from "@/components/ui/button"

function TrialDetailContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get("id")

    const trial = mockTrials.find((t) => t.id === id)

    if (!trial) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold">Trial Not Found</h2>
                <p className="mt-2 text-muted-foreground italic">
                    The trial you are looking for does not exist or has been removed.
                </p>
                <Button onClick={() => router.push("/trials")} className="mt-6">
                    Back to all trials
                </Button>
            </div>
        )
    }

    return (
        <TrialDetail
            trial={trial}
            onBack={() => router.push("/trials")}
        />
    )
}

export default function BriefInfoPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <Suspense fallback={<div className="py-20 text-center text-muted-foreground">Loading trial details...</div>}>
                    <TrialDetailContent />
                </Suspense>
            </main>
            <Footer />
        </div>
    )
}
