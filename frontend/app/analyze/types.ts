export interface Treatment {
    id: string
    name: string
    category: string
    type: "Medication" | "Procedure" | "Therapy" | "Lifestyle" | "Device"
    description: string
    detailedProcedure: string
    recoveryTime: string
    successRate: number
    duration: string
    costEstimate: string
    benefits: string[]
    risks: string[]
    sideEffects: string[]
    precautions: string[]
    alternatives: (string | { name: string; id: string })[]
    conditions: string[]
    aiInsight: string
}
