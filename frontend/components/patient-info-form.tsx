"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface PatientInfoFormProps {
  onSubmit: (data: PatientData) => void
}

export interface PatientData {
  uuid: string
  age: string
  gender: string
  conditions: string[]
  medications: string[]
  allergies: string[]
  notes: string
  location: string
}

const commonConditions = [
  "Type 2 Diabetes",
  "Hypertension",
  "Asthma",
  "COPD",
  "Cancer",
  "Heart Disease",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Alzheimer's",
]

export function PatientInfoForm({ onSubmit }: PatientInfoFormProps) {
  const [formData, setFormData] = useState<PatientData>({
    uuid: `PT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    age: "",
    gender: "",
    conditions: [],
    medications: [],
    allergies: [],
    notes: "",
    location: "",
  })

  const [newCondition, setNewCondition] = useState("")
  const [newMedication, setNewMedication] = useState("")
  const [newAllergy, setNewAllergy] = useState("")

  const addItem = (field: "conditions" | "medications" | "allergies", value: string) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }))
    }
  }

  const removeItem = (field: "conditions" | "medications" | "allergies", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Information</CardTitle>
        <CardDescription>
          Enter patient details for clinical trial matching. All data is anonymized.
        </CardDescription>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Anonymous ID:</span>
          <Badge variant="secondary" className="font-mono">
            {formData.uuid}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Medical Conditions</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.conditions.map((condition, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeItem("conditions", index)}
                    className="ml-1 rounded-full hover:bg-secondary"
                    aria-label={`Remove ${condition}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select
                value={newCondition}
                onValueChange={(value) => {
                  addItem("conditions", value)
                  setNewCondition("")
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select or type condition" />
                </SelectTrigger>
                <SelectContent>
                  {commonConditions
                    .filter((c) => !formData.conditions.includes(c))
                    .map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Or type custom"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addItem("conditions", newCondition)
                    setNewCondition("")
                  }
                }}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Current Medications</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.medications.map((medication, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {medication}
                  <button
                    type="button"
                    onClick={() => removeItem("medications", index)}
                    className="ml-1 rounded-full hover:bg-secondary"
                    aria-label={`Remove ${medication}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Enter medication and press Enter"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem("medications", newMedication)
                  setNewMedication("")
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.allergies.map((allergy, index) => (
                <Badge key={index} variant="destructive" className="gap-1 bg-destructive/20 text-destructive">
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeItem("allergies", index)}
                    className="ml-1 rounded-full"
                    aria-label={`Remove ${allergy}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder="Enter allergy and press Enter"
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addItem("allergies", newAllergy)
                  setNewAllergy("")
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional medical history or relevant information..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Find Matching Trials
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
