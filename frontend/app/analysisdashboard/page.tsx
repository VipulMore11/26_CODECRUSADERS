"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Upload,
    FileText,
    Image,
    X,
    ArrowRight,
    Shield,
    AlertTriangle,
    Activity,
    Users,
    Clock,
    Target,
    Plus,
    Trash2,
    User,
    RefreshCw,
    MapPin,
    File,
} from "lucide-react"

const CONDITIONS = [
    "Type 2 Diabetes",
    "Hypertension",
    "Asthma",
    "COPD",
    "Cancer (specify type)",
    "Heart Disease",
    "Chronic Kidney Disease",
    "Depression",
    "Anxiety",
    "Arthritis",
    "Obesity",
    "High Cholesterol",
    "Thyroid Disorder",
    "Autoimmune Disease",
    "Other",
]

export default function AnalysisDashboardPage() {
    const router = useRouter()
    const [showPrivacyModal, setShowPrivacyModal] = useState(true)
    const [activeTab, setActiveTab] = useState("upload")

    // File upload state
    const [files, setFiles] = useState<File[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Manual form state
    const [patientId, setPatientId] = useState("")
    const [age, setAge] = useState("")
    const [gender, setGender] = useState("")
    const [selectedConditions, setSelectedConditions] = useState<string[]>([])
    const [medications, setMedications] = useState<string[]>([])
    const [newMedication, setNewMedication] = useState("")
    const [allergies, setAllergies] = useState<string[]>([])
    const [newAllergy, setNewAllergy] = useState("")
    const [location, setLocation] = useState("")
    const [notes, setNotes] = useState("")

    // Generate UUID on mount
    useEffect(() => {
        generatePatientId()
    }, [])

    const generatePatientId = () => {
        const uuid = crypto.randomUUID().slice(0, 8).toUpperCase()
        setPatientId(`PT-${uuid}`)
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
        },
    })

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B"
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }

    const handleFileAnalysis = () => {
        if (files.length > 0) {
            setIsAnalyzing(true)
            // Store info and redirect back to analyze
            sessionStorage.setItem("analysisType", "file")
            sessionStorage.setItem("patientId", patientId)
            setTimeout(() => {
                router.push("/analyze?matched=true")
            }, 2000)
        }
    }

    const handleManualSubmit = () => {
        const patientData = {
            patientId,
            age: parseInt(age),
            gender,
            conditions: selectedConditions,
            medications,
            allergies,
            location,
            notes,
        }
        sessionStorage.setItem("analysisType", "manual")
        sessionStorage.setItem("patientData", JSON.stringify(patientData))
        router.push("/analyze?matched=true")
    }

    const toggleCondition = (condition: string) => {
        setSelectedConditions(prev =>
            prev.includes(condition)
                ? prev.filter(c => c !== condition)
                : [...prev, condition]
        )
    }

    const addMedication = () => {
        if (newMedication.trim()) {
            setMedications(prev => [...prev, newMedication.trim()])
            setNewMedication("")
        }
    }

    const removeMedication = (index: number) => {
        setMedications(prev => prev.filter((_, i) => i !== index))
    }

    const addAllergy = () => {
        if (newAllergy.trim()) {
            setAllergies(prev => [...prev, newAllergy.trim()])
            setNewAllergy("")
        }
    }

    const removeAllergy = (index: number) => {
        setAllergies(prev => prev.filter((_, i) => i !== index))
    }

    const isManualFormValid = age && gender && selectedConditions.length > 0

    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Privacy Modal */}
            <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="h-7 w-7 text-primary" />
                        </div>
                        <DialogTitle className="text-xl">Your Privacy is Protected</DialogTitle>
                        <DialogDescription className="text-base">
                            Before you proceed, please review our data handling practices.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <Shield className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">HIPAA Compliant</p>
                                <p className="text-sm text-muted-foreground">
                                    All data handling follows strict HIPAA guidelines for medical information protection.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">UUID-Based Anonymization</p>
                                <p className="text-sm text-muted-foreground">
                                    Your identity is replaced with a unique anonymous identifier (UUID).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                <AlertTriangle className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="font-medium text-foreground">No Permanent Storage</p>
                                <p className="text-sm text-muted-foreground">
                                    Your medical data is processed in real-time and not stored on our servers.
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setShowPrivacyModal(false)} className="w-full gap-2">
                            I Understand, Continue
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <main className="container mx-auto px-4 py-8">
                {/* Main Dashboard Card */}
                <Card className="mx-auto max-w-4xl mb-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Procedure Analysis Dashboard</CardTitle>
                        <CardDescription className="text-base">
                            Enter patient information to receive AI-powered treatment and procedure recommendations
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload" className="gap-2">
                                    <Upload className="h-4 w-4" />
                                    File Upload
                                </TabsTrigger>
                                <TabsTrigger value="manual" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Manual Entry
                                </TabsTrigger>
                            </TabsList>

                            {/* File Upload Tab */}
                            <TabsContent value="upload" className="mt-6 space-y-6">
                                {/* Drop Zone */}
                                <div
                                    {...getRootProps()}
                                    className={`cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all ${isDragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                                        {isDragActive ? "Drop files here" : "Drag & drop medical records"}
                                    </h3>
                                    <p className="mb-4 text-sm text-muted-foreground">
                                        Supports PDFs, images, and scanned documents
                                    </p>
                                    <Button variant="outline" type="button">
                                        Browse Files
                                    </Button>
                                </div>

                                {/* File List */}
                                {files.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm font-medium text-foreground">
                                            Uploaded Files ({files.length})
                                        </p>
                                        {files.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border bg-card p-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                                        {file.type.startsWith("image/") ? (
                                                            <Image className="h-5 w-5" />
                                                        ) : (
                                                            <File className="h-5 w-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">{file.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatFileSize(file.size)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFile(index)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Button
                                    onClick={handleFileAnalysis}
                                    disabled={files.length === 0 || isAnalyzing}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Start AI Analysis
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </TabsContent>

                            {/* Manual Entry Tab */}
                            <TabsContent value="manual" className="mt-6 space-y-6">
                                {/* Patient ID */}
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label className="text-sm text-muted-foreground">
                                                Anonymous Patient ID
                                            </Label>
                                            <p className="font-mono text-lg font-bold text-primary">{patientId}</p>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={generatePatientId}>
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Regenerate
                                        </Button>
                                    </div>
                                </div>

                                {/* Demographics */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age *</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="Enter age"
                                            value={age}
                                            onChange={(e) => setAge(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender *</Label>
                                        <Select value={gender} onValueChange={setGender}>
                                            <SelectTrigger id="gender">
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Male</SelectItem>
                                                <SelectItem value="female">Female</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-2">
                                    <Label htmlFor="location">Patient Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="location"
                                            placeholder="City, State or ZIP code"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Medical Conditions */}
                                <div className="space-y-3">
                                    <Label>Medical Conditions *</Label>
                                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {CONDITIONS.map((condition) => (
                                            <div
                                                key={condition}
                                                className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <Checkbox
                                                    id={condition}
                                                    checked={selectedConditions.includes(condition)}
                                                    onCheckedChange={() => toggleCondition(condition)}
                                                />
                                                <label
                                                    htmlFor={condition}
                                                    className="cursor-pointer text-sm font-medium leading-none"
                                                >
                                                    {condition}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medications */}
                                <div className="space-y-3">
                                    <Label>Current Medications</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add medication (e.g., Metformin 500mg)"
                                            value={newMedication}
                                            onChange={(e) => setNewMedication(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addMedication()}
                                        />
                                        <Button variant="outline" onClick={addMedication}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {medications.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {medications.map((med, index) => (
                                                <Badge key={index} variant="secondary" className="gap-1 py-1">
                                                    {med}
                                                    <button
                                                        onClick={() => removeMedication(index)}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Allergies */}
                                <div className="space-y-3">
                                    <Label>Known Allergies</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add allergy (e.g., Penicillin)"
                                            value={newAllergy}
                                            onChange={(e) => setNewAllergy(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                                        />
                                        <Button variant="outline" onClick={addAllergy}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {allergies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {allergies.map((allergy, index) => (
                                                <Badge key={index} variant="destructive" className="gap-1 py-1">
                                                    {allergy}
                                                    <button
                                                        onClick={() => removeAllergy(index)}
                                                        className="ml-1 hover:text-white"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any additional medical history or notes..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={4}
                                    />
                                </div>

                                <Button
                                    onClick={handleManualSubmit}
                                    disabled={!isManualFormValid}
                                    className="w-full gap-2"
                                    size="lg"
                                >
                                    Start Analysis
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="mx-auto max-w-4xl grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Activity className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">1,250</p>
                                <p className="text-sm text-muted-foreground">Procedures Analyzed</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                                <Target className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">91.5%</p>
                                <p className="text-sm text-muted-foreground">Recommendation Rate</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">8,240</p>
                                <p className="text-sm text-muted-foreground">Patients Guided</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                                <Clock className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">1.2s</p>
                                <p className="text-sm text-muted-foreground">Insights Generation</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    )
}
