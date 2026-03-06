"use client"

import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    ArrowLeft,
    MapPin,
    Calendar,
    Users,
    Building2,
    Shield,
    Info,
    Stethoscope,
    FileText,
    Users2,
    ClipboardCheck,
    Mail,
    Phone,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

// Mock detailed data mapped by ID
const trialDetailsStore: Record<string, any> = {
    "NCT001": {
        id: "NCT001",
        officialTitle: "A Phase 3, Multi-center, Randomized, Open-label Study to Evaluate the Efficacy and Safety of Novel CAR-T Cell Therapy (CT-101) Compared to Standard Care in Patients with Advanced Non-Small Cell Lung Cancer (NSCLC) who have Progressed on Platinum-Based Chemotherapy and PD-L1 Inhibition",
        briefSummary: "This pivotal Phase 3 study aims to determine if CT-101, an autologous CAR-T cell therapy targeting the lung-specific glycoprotein antigen (LSGA), offers superior Progression-Free Survival (PFS) compared to current standard-of-care docetaxel in patients with refractory NSCLC. The study addresses a critical unmet need for patients who have failed both primary chemotherapy and checkpoint inhibitors.",
        detailedSummary: "CAR-T cell therapy involves the genetic modification of a patient's own T-lymphocytes to express a chimeric antigen receptor (CAR) that specifically recognizes tumor antigens. In this protocol, patients undergo leukapheresis to collect T-cells, followed by lymphodepleting chemotherapy (3 days of cyclophosphamide 500 mg/m² and fludarabine 30 mg/m²). The primary endpoint is median Progression-Free Survival (mPFS) as assessed by independent central review using RECIST v1.1. Key secondary endpoints include Overall Survival (OS), Objective Response Rate (ORR), Duration of Response (DoR), and the incidence of Grade 3+ Cytokine Release Syndrome (CRS). Participants will be monitored for 24 months post-infusion for efficacy and followed for 15 years for long-term safety as per FDA guidelines for gene therapy products.",
        investigators: [
            { name: "Dr. Sarah Chen", role: "National Lead Principal Investigator", affiliation: "Dana-Farber Cancer Institute, Thoracic Oncology" },
            { name: "Dr. Michael Roberts", role: "Steering Committee Chair", affiliation: "Massachusetts General Hospital, Cancer Center" },
            { name: "Dr. Elena Rodriguez", role: "Site Investigator", affiliation: "Stanford University Medical Center" },
            { name: "Dr. Arvind Gupta", role: "Cytotherapy Lead", affiliation: "Seattle Children's Research Institute (Cellular Therapy Lab)" }
        ],
        collaborators: [
            "National Cancer Institute (NCI) Specialized Programs of Research Excellence (SPORE)",
            "BioTech Solutions Global Logistics",
            "The Parker Institute for Cancer Immunotherapy",
            "Foundation Medicine (Companion Diagnostics)"
        ],
        conditions: [
            "Non-Small Cell Lung Cancer (NSCLC)",
            "Lung Adenocarcinoma",
            "Squamous Cell Carcinoma of the Lung",
            "Refractory Metastatic Disease",
            "LSGA-Positive Tumors"
        ],
        intervention: {
            type: "Biological: Cell Therapy / Gene Transfer",
            name: "CT-101 (LSGA-Targeted Autologous T-cells)",
            description: "Target dose: 2.0 x 10^6 viable CAR+ T cells per kg body weight (maximum total dose 2 x 10^8 cells). Administered via a single weight-based intravenous infusion within 48 hours of lymphodepletion completion. The product utilizes a 4-1BB costimulatory domain to enhance persistence and metabolic fitness in the solid tumor microenvironment."
        },
        locations: [
            { name: "Dana-Farber Cancer Institute, Yawkey Center", city: "Boston, MA", status: "Recruiting" },
            { name: "MD Anderson Cancer Center, Main Campus", city: "Houston, TX", status: "Active, Not Recruiting" },
            { name: "Memorial Sloan Kettering Cancer Center", city: "New York, NY", status: "Recruiting" },
            { name: "UCSF Helen Diller Family Comprehensive Cancer Center", city: "San Francisco, CA", status: "Recruiting" },
            { name: "Princess Margaret Cancer Centre", city: "Toronto, ON", status: "Recruiting" }
        ],
        contact: {
            name: "Global Patient Recruitment Office",
            email: "ct101-trials@biotechsolutions.com",
            phone: "+1 (800) 422-6237 (Option 4)"
        },
        criteria: {
            inclusion: [
                "Aged 18 to 75 years at the time of informed consent.",
                "Histologically or cytologically confirmed Stage IV NSCLC (non-resectable).",
                "Measurable disease by RECIST v1.1 criteria (at least one lesion >10mm).",
                "Documentation of tumor LSGA expression via centralized IHC testing (Score 2+ or higher).",
                "Progression on or after treatment with a platinum-based doublet and an anti-PD-1/PD-L1 antibody.",
                "ECOG Performance Status of 0 or 1 with an expected life expectancy > 12 weeks.",
                "Adequate pulmonary function (FEV1 and DLCO ≥ 40% predicted).",
                "Left Ventricular Ejection Fraction (LVEF) ≥ 50% by ECHO or MUGA.",
                "Willingness to use highly effective contraception during and for 12 months after treatment."
            ],
            exclusion: [
                "Active, untreated Central Nervous System (CNS) metastases or leptomeningeal disease.",
                "Active autoimmune disease requiring systemic steroids (>10mg prednisone equivalent/day).",
                "Prior treatment with any chimeric antigen receptor (CAR) therapy or T-cell receptor (TCR) therapy.",
                "Known positive status for HIV, active Hepatitis B (HBV), or active Hepatitis C (HCV).",
                "Significant cardiac disease (NYHA Class III/IV, unstable angina within 6 months).",
                "Requirement for continuous localized or systemic anticoagulation.",
                "Primary immunodeficiency or history of organ transplantation.",
                "Second primary malignancy within the last 2 years (excluding basal cell carcinoma).",
                "Pregnant or currently breastfeeding patients."
            ]
        },
        status: "Recruiting",
        phase: "Phase 3",
        sponsor: "National Cancer Institute"
    },
    "NCT002": {
        id: "NCT002",
        officialTitle: "A Phase 2, Double-Blind, Placebo-Controlled Study to Assess the Efficacy and Safety of Long-Acting GLP-1 Receptor Agonist (Novo-G) on Cardiovascular Remodeling in Patients with Type 2 Diabetes and Established Heart Failure",
        briefSummary: "This Phase 2 trial investigates the impact of Novo-G, a high-affinity GLP-1 receptor agonist, on cardiac structure and function. Beyond blood glucose management, the study utilizes 3D-Cardiac MRI (cMRI) to measure changes in left ventricular mass and diastolic function over a one-year treatment period in diabetic patients at high risk for heart failure progression.",
        detailedSummary: "While GLP-1 agonists are established for A1c reduction, their direct 'pleiotropic' effects on the myocardium remain under investigation. In this study, 400 participants will be randomized 1:1 to receive either Novo-G (2.4mg weekly) or a matching placebo. The Primary Endpoint is the change from baseline in Left Ventricular End-Diastolic Volume Index (LVEDVI) at Week 52. Secondary endpoints include changes in NT-proBNP levels, 6-minute walk distance (6MWD), and time to first hospitalization for heart failure. The study also includes an exploratory sub-study on epicardial fat volume reduction and its correlation with systemic inflammatory markers (hsCRP, IL-6).",
        investigators: [
            { name: "Dr. James Wilson", role: "Global Lead Investigator", affiliation: "Mount Sinai Hospital, Cardiovascular Institute" },
            { name: "Dr. Linda Sommers", role: "Imaging Sub-study Chair", affiliation: "Cleveland Clinic, Cardiology" },
            { name: "Dr. Robert Vance", role: "Metabolic Lead", affiliation: "Johns Hopkins University, Endocrinology" }
        ],
        collaborators: [
            "American Heart Association (AHA) Quality Improvement Initiative",
            "Novo Nordisk Global R&D",
            "Siemens Healthineers (cMRI Core Lab)",
            "European Society of Cardiology (ESC)"
        ],
        conditions: [
            "Type 2 Diabetes Mellitus",
            "Heart Failure with Preserved Ejection Fraction (HFpEF)",
            "Hypertensive Heart Disease",
            "Diabetic Cardiomyopathy",
            "Cardiovascular Remodeling"
        ],
        intervention: {
            type: "Drug: GLP-1 Receptor Agonist",
            name: "Novo-G (NNC-9021-04)",
            description: "2.4 mg subcutaneous injection once weekly (autoinjector pen). The study begins with a 16-week titration phase starting at 0.25 mg to minimize gastrointestinal adverse events. Maintenance dose continues for 36 weeks. Placebo is identical in appearance and volume."
        },
        locations: [
            { name: "Mount Sinai Health System, Metabolic Center", city: "New York, NY", status: "Recruiting" },
            { name: "Mayo Clinic, Division of Cardiovascular Medicine", city: "Rochester, MN", status: "Recruiting" },
            { name: "Cedars-Sinai Medical Center", city: "Los Angeles, CA", status: "Recruiting" },
            { name: "University of Oxford, Radcliffe Department of Medicine", city: "Oxford, UK", status: "Recruiting" },
            { name: "Charité – Universitätsmedizin Berlin", city: "Berlin, Germany", status: "Not yet recruiting" }
        ],
        contact: {
            name: "Novo Nordisk Clinical Disclosure Office",
            email: "clinical-trials@novonordisk.com",
            phone: "+1 (888) 555-0199 (US/Canada)"
        },
        criteria: {
            inclusion: [
                "Age ≥ 18 and ≤ 80 years at screening.",
                "Diagnosed Type 2 Diabetes with HbA1c ≥ 6.5% and ≤ 10.0%.",
                "Stable heart failure (NYHA Class II-III) for at least 3 months.",
                "LVEF ≥ 45% as measured by echocardiography within 4 weeks.",
                "Elevated natriuretic peptides (NT-proBNP > 200 pg/mL).",
                "On stable background therapy for diabetes and heart failure for at least 30 days.",
                "Body Mass Index (BMI) ≥ 27 kg/m².",
                "Ability to provide written informed consent and comply with weekly injections."
            ],
            exclusion: [
                "Type 1 Diabetes or history of diabetic ketoacidosis.",
                "History of acute myocardial infarction or stroke within 90 days.",
                "Prior use of any GLP-1 receptor agonist within 6 months of screening.",
                "End-stage renal disease (eGFR < 15 mL/min/1.73m²) or requiring dialysis.",
                "Personal or family history of Medullary Thyroid Carcinoma (MTC).",
                "History of multiple endocrine neoplasia syndrome type 2 (MEN 2).",
                "Chronic pancreatitis or history of acute pancreatitis within 12 months.",
                "Known hypersensitivity to Novo-G or any of its excipients.",
                "Pregnancy, planned pregnancy, or breastfeeding."
            ]
        },
        status: "Recruiting",
        phase: "Phase 2",
        sponsor: "Novo Nordisk"
    },
    "NCT003": {
        id: "NCT003",
        officialTitle: "A Phase 2 Study of Pembrolizumab in Combination with Olaparib in Patients with Metastatic Triple-Negative Breast Cancer (TNBC) and Homologous Recombination Repair (HRR) Gene Alterations",
        briefSummary: "This Phase 2 investigation evaluates the synergistic effect of combining a PD-1 inhibitor (Pembrolizumab) with a PARP inhibitor (Olaparib) in patients with aggressive breast cancer who have specific genetic markers. The goal is to see if this combination improves tumor response rates more than either drug alone.",
        detailedSummary: "Triple-negative breast cancer lacks the three most common receptors (estrogen, progesterone, and HER2), making it difficult to treat. This study targets a subset of TNBC patients with HRR gene mutations (such as BRCA1/2, PALB2, or ATM). Participants receive Pembrolizumab 200mg IV every 3 weeks and Olaparib 300mg tablets twice daily. The primary objective is the Objective Response Rate (ORR) defined by RECIST 1.1. Exploratory objectives include immune profiling of the tumor microenvironment through serial biopsies and evaluation of circulating tumor DNA (ctDNA) as a biomarker for response.",
        investigators: [
            { name: "Dr. Alice Moretti", role: "Principal Investigator", affiliation: "Memorial Sloan Kettering Cancer Center" },
            { name: "Dr. David Chang", role: "Translational Lead", affiliation: "MD Anderson Cancer Center" }
        ],
        collaborators: ["Merck Sharp & Dohme LLC", "AstraZeneca", "The Breast Cancer Research Foundation"],
        conditions: ["Triple-Negative Breast Cancer", "Metastatic Breast Cancer", "BRCA1 Mutation", "BRCA2 Mutation", "ATM Gene Alteration"],
        intervention: {
            type: "Drug Combination",
            name: "Pembrolizumab + Olaparib",
            description: "Pembrolizumab: 200 mg administered as an intravenous infusion over 30 minutes every 21 days. Olaparib: 300 mg (two 150 mg tablets) taken orally twice daily, continuously."
        },
        locations: [
            { name: "Memorial Sloan Kettering, Breast Cancer Center", city: "New York, NY", status: "Recruiting" },
            { name: "The University of Texas MD Anderson Cancer Center", city: "Houston, TX", status: "Recruiting" },
            { name: "Mayo Clinic, Breast Clinic", city: "Jacksonville, FL", status: "Recruiting" }
        ],
        contact: {
            name: "MSK Clinical Trials Team",
            email: "breasttrials@mskcc.org",
            phone: "+1 (646) 888-2000"
        },
        criteria: {
            inclusion: [
                "Female or male aged ≥ 18 years.",
                "Confirmed metastatic Triple-Negative Breast Cancer (ER < 1%, PR < 1%, HER2 negative).",
                "Presence of deleterious or suspected deleterious germline or somatic HRR gene mutation.",
                "At least one prior line of taxane or anthracycline-based chemotherapy for metastatic disease.",
                "ECOG Performance Status of 0-1.",
                "Willingness to undergo pre-treatment and on-treatment tumor biopsies."
            ],
            exclusion: [
                "Prior treatment with a PARP inhibitor or PD-1/PD-L1 inhibitor.",
                "Symptomatic or unstable CNS metastases.",
                "Known history of Myelodysplastic Syndrome (MDS) or Acute Myeloid Leukemia (AML).",
                "History of non-infectious pneumonitis requiring steroids.",
                "Active infection requiring systemic therapy (Hepatitis B/C, HIV)."
            ]
        },
        status: "Recruiting",
        phase: "Phase 2",
        sponsor: "Memorial Sloan Kettering"
    },
    "NCT004": {
        id: "NCT004",
        officialTitle: "A Phase 3, Randomized, Double-Blind, Placebo-Controlled Study to Evaluate the Efficacy and Safety of Donanemab in Participants with Early Alzheimer's Disease",
        briefSummary: "This large-scale Phase 3 study, also known as TRAILBLAZER-ALZ, investigates whether Donanemab, an amyloid plaque-clearing antibody, can slow the clinical decline in people with early symptomatic Alzheimer's disease including Mild Cognitive Impairment (MCI).",
        detailedSummary: "Donanemab is an investigational antibody that targets a specific type of amyloid plaque called N3pG. This study uses a unique 'amyloid-leveling' design where patients stop receiving the drug once their amyloid plaques are confirmed to be below a certain threshold by PET imaging. Participants are randomized 1:1 to Donanemab or Placebo infusions every 4 weeks. The primary endpoint is the change from baseline to Week 76 in the Integrated Alzheimer's Disease Rating Scale (iADRS), which measures both cognition and daily functions. Safety monitoring includes regular MRI scans to detect Amyloid-Related Imaging Abnormalities (ARIA-E and ARIA-H).",
        investigators: [
            { name: "Dr. Mark Salloway", role: "Global Principal Investigator", affiliation: "Butler Hospital, Memory and Aging Program" },
            { name: "Dr. Reisa Sperling", role: "Scientific Consultant", affiliation: "Brigham and Women's Hospital" }
        ],
        collaborators: ["Eli Lilly and Company", "Alzheimer's Association", "National Institute on Aging (NIA)"],
        conditions: ["Early Alzheimer's Disease", "Mild Cognitive Impairment (MCI)", "Cerebral Amyloid Angiopathy"],
        intervention: {
            type: "Biological: Monoclonal Antibody",
            name: "Donanemab (LY3002813)",
            description: "Intravenous infusion administered every 4 weeks. Dosage starts at 700 mg for the first three doses, then increases to 1400 mg every 4 weeks unless amyloid clearance goals are met."
        },
        locations: [
            { name: "Butler Hospital, Neurology Department", city: "Providence, RI", status: "Recruiting" },
            { name: "Brigham and Women's Hospital", city: "Boston, MA", status: "Recruiting" },
            { name: "Banner Alzheimer's Institute", city: "Phoenix, AZ", status: "Recruiting" },
            { name: "University of Southern California (USC)", city: "Los Angeles, CA", status: "Recruiting" }
        ],
        contact: {
            name: "Lilly Clinical Trials Support",
            email: "lillytrials@lilly.com",
            phone: "+1 (877) 285-4559"
        },
        criteria: {
            inclusion: [
                "Age 60 to 85 years inclusive.",
                "Gradual and progressive change in memory function for at least 6 months.",
                "MMSE score between 20 and 28 inclusive.",
                "Positive Amyloid PET scan (centralized read).",
                "Intermediate Tau PET level (tau pathology load consistent with early AD).",
                "Has a reliable study partner who spends at least 10 hours per week with the participant."
            ],
            exclusion: [
                "Significant neurological disease other than Alzheimer's (Stroke, Parkinson's, etc.).",
                "Contraindication to MRI imaging (pacemaker, metallic implants).",
                "History of major depressive disorder within the last year.",
                "Use of prohibited medications (anticoagulants, certain immunomodulators).",
                "High risk for ARIA based on baseline MRI findings (>4 microhemorrhages)."
            ]
        },
        status: "Active",
        phase: "Phase 3",
        sponsor: "Eli Lilly"
    }
}

// Fallback for missing IDs
const getFallbackTrial = (id: string) => ({
    id,
    officialTitle: "Clinical Trial Metadata Synchronization in Progress",
    briefSummary: "The brief summary for this specific trial record is currently being synchronized from the primary clinical registry. This process ensures that the most up-to-date study objectives and patient-facing descriptions are presented to potential participants and clinical research staff.",
    detailedSummary: "Full protocol details, including primary and secondary endpoints, statistical analysis plans, and longitudinal safety monitoring requirements, are undergoing final validation. Once verified, the complete study architecture will be available for analysis. We recommend contacting the study coordinator or referring to the official clinical database for immediate medical necessity inquiries.",
    investigators: [{ name: "Scientific Review Board", role: "Coordination Lead", affiliation: "TrialMatch AI Research Network" }],
    collaborators: ["Institutional Review Boards (IRB)", "Clinical Research Organizations (CRO)", "Academic Medical Centers"],
    conditions: ["Disease Area Under Active Investigation"],
    intervention: {
        type: "Standard Investigational Protocol",
        name: "Confidential Investigational Product",
        description: "Standard dosage and administration protocols as defined by the Phase-specific clinical development plan. Detailed pharmacological data is restricted to authorized investigators during the current enrollment window."
    },
    locations: [
        { name: "Central Research Logistics Center", city: "Global Coordination", status: "Active" },
        { name: "Regional Affiliate Site A", city: "TBD", status: "Pending" }
    ],
    contact: {
        name: "Clinical trial Operations Support",
        email: "operations@trialmatch.ai",
        phone: "+1 (888) 555-MATCH"
    },
    criteria: {
        inclusion: [
            "Refer to the primary study protocol for exhaustive inclusion requirements.",
            "Age and diagnosis verification must be performed at an authorized screening site.",
            "Informed consent must be obtained prior to any study-specific procedures."
        ],
        exclusion: [
            "Significant medical comorbidities as defined by the PI.",
            "Concurrent participation in other interventional trials.",
            "Refer to the official registry for site-specific exclusion criteria."
        ]
    },
    status: "In Review",
    phase: "Multi-Phase",
    sponsor: "TrialMatch Integrated Research Network"
})

export default function TrialDetailsPage() {
    const { id } = useParams()
    const router = useRouter()

    const trialIdString = (Array.isArray(id) ? id[0] : id) || "Unknown"
    const trial = trialDetailsStore[trialIdString] || getFallbackTrial(trialIdString)

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navigation />

            <main className="pt-20 pb-12">
                <div className="container mx-auto max-w-[1440px] px-6">
                    {/* Back Button */}
                    <Button
                        variant="ghost"
                        className="mb-6 -ml-4 gap-2 text-muted-foreground hover:text-foreground"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to trials
                    </Button>

                    {/* Header Section */}
                    <div className="mb-8 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-success text-success-foreground uppercase tracking-wide">
                                {trial.status}
                            </Badge>
                            <Badge variant="outline" className="border-primary/50 text-primary">
                                {trial.phase}
                            </Badge>
                            <span className="text-sm font-mono text-muted-foreground">{trial.id}</span>
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                            {trial.officialTitle}
                        </h1>
                        <div className="flex items-center gap-2 text-muted-foreground italic">
                            <Building2 className="h-5 w-5" />
                            <span>Sponsored by {trial.sponsor}</span>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Brief Summary */}
                            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Brief Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {trial.briefSummary}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Detailed Summary */}
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary" />
                                        Detailed Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {trial.detailedSummary}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Conditions & Interventions */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <Card className="border-border/50 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Stethoscope className="h-5 w-5 text-primary" />
                                            Conditions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {trial.conditions.map((condition: string) => (
                                                <Badge key={condition} variant="secondary">
                                                    {condition}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            Intervention / Treatment
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p className="font-semibold text-primary">{trial.intervention.name}</p>
                                        <p className="text-sm text-muted-foreground">{trial.intervention.description}</p>
                                        <Badge variant="outline" className="mt-2">{trial.intervention.type}</Badge>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Participation Criteria */}
                            <Card className="border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <ClipboardCheck className="h-5 w-5 text-primary" />
                                        Participation Criteria
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                                            Inclusion Criteria
                                        </h4>
                                        <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                                            {trial.criteria.inclusion.map((item: string, idx: number) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                                            Exclusion Criteria
                                        </h4>
                                        <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                                            {trial.criteria.exclusion.map((item: string, idx: number) => (
                                                <li key={idx}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Team & Contacts */}
                        <div className="space-y-8">

                            {/* Investigators & Collaborators */}
                            <Card className="border-border/50 bg-secondary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users2 className="h-5 w-5 text-primary" />
                                        Research Team
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Investigators</p>
                                        {trial.investigators.map((person: any, idx: number) => (
                                            <div key={idx} className="space-y-0.5">
                                                <p className="text-sm font-medium">{person.name}</p>
                                                <p className="text-xs text-muted-foreground">{person.role}</p>
                                                <p className="text-xs text-primary/80">{person.affiliation}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Collaborators</p>
                                        <div className="flex flex-wrap gap-1">
                                            {trial.collaborators.map((collab: string, idx: number) => (
                                                <span key={idx} className="text-xs text-muted-foreground">
                                                    {collab}{idx < trial.collaborators.length - 1 ? "," : ""}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact & Locations */}
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="text-lg">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-primary" />
                                            <a href={`mailto:${trial.contact.email}`} className="text-primary hover:underline">{trial.contact.email}</a>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-primary" />
                                            <span>{trial.contact.phone}</span>
                                        </div>
                                    </div>
                                    <hr className="border-border/50" />
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Locations</p>
                                        {trial.locations.map((loc: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                <div className="text-sm">
                                                    <p className="font-medium">{loc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{loc.city}</p>
                                                    <Badge variant="outline" className="h-5 px-1 py-0 text-[10px] text-success border-success/30">
                                                        {loc.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Apply Button */}
                            <Button className="w-full gap-2 py-6 text-lg shadow-lg hover:shadow-primary/20" size="lg">
                                Register for Trial
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
