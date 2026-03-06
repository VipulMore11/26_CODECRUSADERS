import { ClinicalTrial } from "./types"

export const mockTrials: ClinicalTrial[] = [
    {
        id: "NCT05123456",
        name: "STRIDE-DM: Novel GLP-1 Agonist for Type 2 Diabetes",
        phase: "Phase 3",
        status: "Recruiting",
        condition: "Type 2 Diabetes Mellitus",
        diseaseCategory: "Diabetes",
        intervention: "Drug: XR-4521 (GLP-1 Agonist)",
        sponsor: "BioMedical Research Institute",
        location: { city: "Boston", state: "MA", country: "USA", lat: 42.3601, lng: -71.0589 },
        description: "A randomized, double-blind study evaluating a novel GLP-1 receptor agonist in patients with Type 2 Diabetes and established cardiovascular disease.",
        briefDescription: "Evaluating the efficacy and safety of XR-4521 in Type 2 Diabetes patients with existing heart conditions.",
        fullDescription: "This Phase 3 trial is designed to investigate whether XR-4521, a novel once-weekly GLP-1 receptor agonist, can significantly reduce the risk of major adverse cardiovascular events (MACE) in adults with Type 2 Diabetes and established cardiovascular disease who are already receiving standard of care treatments.",
        collaborators: ["National Institutes of Health (NIH)", "American Diabetes Association"],
        investigators: ["Dr. Sarah Janssen (Lead Investigator)", "Dr. Michael Chen (Clinical Lead)"],
        contacts: [
            { name: "Clinical Trials Information Center", role: "Primary Contact", email: "trials@biomedical.res", phone: "1-800-555-0123" },
            { name: "Recruitment Coordinator", role: "Study Coordinator", email: "coordinator@stride-dm.com", phone: "+1 (617) 555-9876" }
        ],
        locations: [
            { name: "Massachusetts General Hospital", city: "Boston", state: "MA", country: "USA" },
            { name: "Mayo Clinic", city: "Rochester", state: "MN", country: "USA" },
            { name: "Cleveland Clinic", city: "Cleveland", state: "OH", country: "USA" }
        ],
        interventions: [
            { type: "Drug", name: "XR-4521", description: "A novel once-weekly GLP-1 receptor agonist administered via subcutaneous injection." },
            { type: "Drug", name: "Placebo", description: "Matching subcutaneous injection containing no active pharmaceutical ingredient." }
        ],
        eligibilityCriteria: {
            inclusion: ["Age 45-70 years", "Type 2 Diabetes diagnosis", "HbA1c 7.0-10.0%", "On stable metformin therapy"],
            exclusion: ["Type 1 Diabetes", "Severe kidney disease", "History of pancreatitis"],
        },
        tags: ["Cardiovascular", "Adult"],
        enrollmentCount: 1200,
        startDate: "2024-03-01",
        estimatedCompletionDate: "2026-12-01",
    },
    {
        id: "NCT05234567",
        name: "HEART-SAFE: Combination Therapy for Diabetes and Hypertension",
        phase: "Phase 2",
        status: "Recruiting",
        condition: "Diabetes with Hypertension",
        diseaseCategory: "Cardiovascular",
        intervention: "Drug: CardioMet Plus",
        sponsor: "CardioMetabolic Research Center",
        location: { city: "Chicago", state: "IL", country: "USA", lat: 41.8781, lng: -87.6298 },
        description: "Evaluating a novel combination therapy targeting both blood glucose and blood pressure control.",
        briefDescription: "Combo therapy for diabetes and hypertension.",
        fullDescription: "Detailed study about CardioMet Plus.",
        collaborators: ["National Heart, Lung, and Blood Institute (NHLBI)", "Global Health Pharma"],
        investigators: ["Dr. Robert Smith (Principal Investigator)", "Dr. Elena Rodriguez (Cardiology Specialist)"],
        contacts: [
            { name: "Heart-Safe Study Team", role: "Primary Contact", email: "heartsafe@cmrc.org", phone: "1-312-555-0199" },
            { name: "Patient Recruitment Office", role: "Recruiter", email: "join@heartsafe-trial.com", phone: "1-888-555-4321" }
        ],
        locations: [
            { name: "Northwestern Memorial Hospital", city: "Chicago", state: "IL", country: "USA" },
            { name: "Johns Hopkins Hospital", city: "Baltimore", state: "MD", country: "USA" },
            { name: "Stanford Health Care", city: "Stanford", state: "CA", country: "USA" }
        ],
        interventions: [
            { type: "Drug", name: "CardioMet Plus", description: "Fixed-dose combination of a SGLT2 inhibitor and an ARB." }
        ],
        eligibilityCriteria: {
            inclusion: ["Type 2 Diabetes", "Hypertension", "Age 40-75", "Stable medication regimen"],
            exclusion: ["Heart failure", "Severe hepatic impairment", "Pregnancy"],
        },
        tags: ["Hypertension", "Adult"],
        enrollmentCount: 450,
        startDate: "2024-06-15",
        estimatedCompletionDate: "2026-06-15",
    },
    {
        id: "NCT05345678",
        name: "ONCO-IMMUNE: Immunotherapy for Advanced Lung Cancer",
        phase: "Phase 3",
        status: "Recruiting",
        condition: "Non-Small Cell Lung Cancer",
        diseaseCategory: "Oncology",
        intervention: "Biological: PD-L1 Inhibitor + Chemotherapy",
        sponsor: "Global Oncology Consortium",
        location: { city: "Houston", state: "TX", country: "USA", lat: 29.7604, lng: -95.3698 },
        description: "Combining novel immunotherapy with standard chemotherapy for first-line treatment of advanced NSCLC.",
        briefDescription: "Immunotherapy for lung cancer.",
        fullDescription: "Detailed NSCLC study content.",
        collaborators: ["MD Anderson Cancer Center", "OncoTech Solutions"],
        investigators: ["Dr. James Wilson (Chief Oncologist)", "Dr. Linda Green (Lead Researcher)"],
        contacts: [
            { name: "Oncology Clinical Hub", role: "Primary Contact", email: "onco-immune@goc.org", phone: "1-713-555-0100" },
            { name: "Study Navigator", role: "Navigator", email: "nav@lung-study.org", phone: "1-800-LUNG-ONC" }
        ],
        locations: [
            { name: "MD Anderson Cancer Center", city: "Houston", state: "TX", country: "USA" },
            { name: "Memorial Sloan Kettering", city: "New York", state: "NY", country: "USA" },
            { name: "Dana-Farber Cancer Institute", city: "Boston", state: "MA", country: "USA" }
        ],
        interventions: [
            { type: "Biological", name: "PD-L1 Inhibitor", description: "Intravenous infusion every 3 weeks." },
            { type: "Drug", name: "Standard Chemotherapy", description: "Platinum-based doublet chemotherapy." }
        ],
        eligibilityCriteria: {
            inclusion: ["Stage IIIB/IV NSCLC", "ECOG 0-1", "Adequate organ function", "No prior systemic therapy"],
            exclusion: ["Autoimmune disease", "Active brain metastases", "Current immunosuppressive therapy"],
        },
        tags: ["Cancer", "Immunotherapy", "Adult"],
        enrollmentCount: 800,
        startDate: "2024-01-15",
        estimatedCompletionDate: "2027-01-15",
    },
    {
        id: "NCT05456789",
        name: "NEURO-PROTECT: Neuroprotection in Early Parkinson's",
        phase: "Phase 2",
        status: "Recruiting",
        condition: "Parkinson's Disease",
        diseaseCategory: "Neurology",
        intervention: "Drug: NP-2147",
        sponsor: "NeuroScience Foundation",
        location: { city: "San Francisco", state: "CA", country: "USA", lat: 37.7749, lng: -122.4194 },
        description: "Testing a disease-modifying therapy to slow progression in early-stage Parkinson's disease.",
        briefDescription: "Parkinson's neuroprotection study.",
        fullDescription: "Detailed neuroprotection study data.",
        collaborators: ["UCSF Medical Center", "The Michael J. Fox Foundation"],
        investigators: ["Dr. David Chen (Lead Neurologist)", "Dr. Sophie Miller (Neuroscience Director)"],
        contacts: [
            { name: "Neuro-Protect Study HQ", role: "Primary Contact", email: "info@neuroprotect.org", phone: "1-415-555-0987" },
            { name: "Study Coordinator", role: "Coordinator", email: "coordinator@ucsf-neuro.edu", phone: "1-415-555-4433" }
        ],
        locations: [
            { name: "UCSF Health", city: "San Francisco", state: "CA", country: "USA" },
            { name: "Cedars-Sinai Medical Center", city: "Los Angeles", state: "CA", country: "USA" },
            { name: "Columbia University Irving Medical Center", city: "New York", state: "NY", country: "USA" }
        ],
        interventions: [
            { type: "Drug", name: "NP-2147", description: "Daily oral tablet targeting alpha-synuclein aggregation." }
        ],
        eligibilityCriteria: {
            inclusion: ["Early Parkinson's diagnosis (<3 years)", "Age 50-75", "Hoehn & Yahr Stage 1-2"],
            exclusion: ["Dementia", "Other parkinsonian syndromes", "Significant psychiatric illness"],
        },
        tags: ["Neurological", "Senior", "Disease Modification"],
        enrollmentCount: 300,
        startDate: "2024-09-01",
        estimatedCompletionDate: "2028-09-01",
    },
    {
        id: "NCT05567890",
        name: "FLEX-JOINT: Biologic for Rheumatoid Arthritis",
        phase: "Phase 3",
        status: "Active",
        condition: "Rheumatoid Arthritis",
        diseaseCategory: "Autoimmune",
        intervention: "Biological: JAK Inhibitor",
        sponsor: "Arthritis Research Alliance",
        location: { city: "Seattle", state: "WA", country: "USA", lat: 47.6062, lng: -122.3321 },
        description: "Evaluating efficacy and safety of a novel JAK inhibitor in patients with moderate-to-severe RA.",
        briefDescription: "JAK inhibitor for Rheumatoid Arthritis.",
        fullDescription: "Detailed RA study documentation.",
        collaborators: ["National Institute of Arthritis and Musculoskeletal and Skin Diseases (NIAMS)", "RheumaPharma Ltd"],
        investigators: ["Dr. Sarah Thompson (Lead Rheumatologist)", "Dr. Robert Lee (Immunology Specialist)"],
        contacts: [
            { name: "Flex-Joint Trial Office", role: "Primary Contact", email: "flexjoint@arthritis-research.org", phone: "1-206-555-0122" },
            { name: "Study Admissions", role: "Admissions", email: "apply@flexjoint-ra.com", phone: "1-800-RA-HELP" }
        ],
        locations: [
            { name: "University of Washington Medical Center", city: "Seattle", state: "WA", country: "USA" },
            { name: "Hospital for Special Surgery", city: "New York", state: "NY", country: "USA" },
            { name: "Brigham and Women's Hospital", city: "Boston", state: "MA", country: "USA" }
        ],
        interventions: [
            { type: "Biological", name: "JAK Inhibitor", description: "Oral daily tablet." }
        ],
        eligibilityCriteria: {
            inclusion: ["Active RA for 6+ months", "Inadequate response to methotrexate", "Age 18-80"],
            exclusion: ["Active infections", "History of VTE", "Current biologic therapy"],
        },
        tags: ["Autoimmune", "Adult", "Biologic"],
        enrollmentCount: 550,
        startDate: "2023-06-01",
        estimatedCompletionDate: "2025-12-01",
    },
    {
        id: "NCT05678901",
        name: "BREATH-EASY: Novel Therapy for Severe Asthma",
        phase: "Phase 2",
        status: "Recruiting",
        condition: "Severe Asthma",
        diseaseCategory: "Respiratory",
        intervention: "Biological: Anti-TSLP Antibody",
        sponsor: "Respiratory Medicine Institute",
        location: { city: "Denver", state: "CO", country: "USA", lat: 39.7392, lng: -104.9903 },
        description: "Testing a new biologic therapy for patients with severe, uncontrolled asthma.",
        briefDescription: "Novel therapy for severe asthma.",
        fullDescription: "Detailed asthma therapy study.",
        collaborators: ["National Jewish Health", "PulmoCare Bio"],
        investigators: ["Dr. Michael Stevens (Pulmonologist)", "Dr. Emily Zhang (Allergy & Immunology Specialist)"],
        contacts: [
            { name: "Breath-Easy Research Team", role: "Primary Contact", email: "info@be-asthma.org", phone: "1-303-555-0155" },
            { name: "Recruitment Coordinator", role: "Coordinator", email: "asthma-trial@njhealth.org", phone: "1-303-555-9000" }
        ],
        locations: [
            { name: "National Jewish Health", city: "Denver", state: "CO", country: "USA" },
            { name: "Yale New Haven Hospital", city: "New Haven", state: "CT", country: "USA" },
            { name: "Duke University Medical Center", city: "Durham", state: "NC", country: "USA" }
        ],
        interventions: [
            { type: "Biological", name: "Anti-TSLP Antibody", description: "Subcutaneous injection every 4 weeks." }
        ],
        eligibilityCriteria: {
            inclusion: ["Severe asthma diagnosis", "On high-dose ICS+LABA", "Age 18-65", "2+ exacerbations/year"],
            exclusion: ["Current smoker", "Other respiratory diseases", "Recent exacerbation"],
        },
        tags: ["Respiratory", "Adult", "Biologic"],
        enrollmentCount: 400,
        startDate: "2024-04-01",
        estimatedCompletionDate: "2026-10-01",
    },
    {
        id: "NCT05789012",
        name: "YOUTH-STRONG: Exercise Intervention for Pediatric Obesity",
        phase: "Phase 3",
        status: "Recruiting",
        condition: "Pediatric Obesity",
        diseaseCategory: "Metabolic",
        intervention: "Behavioral: Structured Exercise Program",
        sponsor: "Children's Health Research Center",
        location: { city: "Philadelphia", state: "PA", country: "USA", lat: 39.9526, lng: -75.1652 },
        description: "Comprehensive exercise and lifestyle intervention for adolescents with obesity.",
        briefDescription: "Lifestyle intervention for pediatric obesity.",
        fullDescription: "Detailed pediatric obesity study.",
        collaborators: ["Children's Hospital of Philadelphia (CHOP)", "Healthy Kids Foundation"],
        investigators: ["Dr. Rachel Adams (Pediatrician)", "Dr. Chris Brown (Exercise Physiologist)"],
        contacts: [
            { name: "Youth-Strong Study Center", role: "Primary Contact", email: "youthstrong@chop.edu", phone: "1-215-555-0188" },
            { name: "Program Assistant", role: "Assistant", email: "kids-trial@kidsfoundation.org", phone: "1-800-KID-FIT" }
        ],
        locations: [
            { name: "Children's Hospital of Philadelphia", city: "Philadelphia", state: "PA", country: "USA" },
            { name: "Boston Children's Hospital", city: "Boston", state: "MA", country: "USA" },
            { name: "Children's Medical Center Dallas", city: "Dallas", state: "TX", country: "USA" }
        ],
        interventions: [
            { type: "Behavioral", name: "Exercise Program", description: "High-intensity interval training 3 times per week." }
        ],
        eligibilityCriteria: {
            inclusion: ["Age 12-17", "BMI > 95th percentile", "Parent/guardian consent", "Medical clearance"],
            exclusion: ["Endocrine disorders", "Physical limitations", "Current weight loss medication"],
        },
        tags: ["Pediatric", "Lifestyle", "Obesity"],
        enrollmentCount: 250,
        startDate: "2024-08-01",
        estimatedCompletionDate: "2026-08-01",
    },
    {
        id: "NCT05890123",
        name: "ELITE-ATHLETE: Recovery Enhancement in Professional Athletes",
        phase: "Phase 2",
        status: "Not yet recruiting",
        condition: "Sports Injury Recovery",
        diseaseCategory: "Sports Medicine",
        intervention: "Device: Regenerative Therapy System",
        sponsor: "Sports Medicine Innovation Lab",
        location: { city: "Los Angeles", state: "CA", country: "USA", lat: 34.0522, lng: -118.2437 },
        description: "Advanced regenerative therapy for accelerating muscle and tendon recovery in elite athletes.",
        briefDescription: "Recovery enhancement for athletes.",
        fullDescription: "Detailed regenerative therapy study.",
        collaborators: ["US Olympic & Paralympic Committee", "RegenMed BioTech"],
        investigators: ["Dr. James Carter (Sports Medicine Director)", "Dr. Emily Wong (Regenerative Specialist)"],
        contacts: [
            { name: "Elite-Athlete Study HQ", role: "Primary Contact", email: "elite@smi-lab.com", phone: "1-310-555-0777" },
            { name: "Athlete Registry", role: "Registry", email: "registry@athletes-recovery.org", phone: "1-888-FIT-BACK" }
        ],
        locations: [
            { name: "SMI Innovation Lab", city: "Los Angeles", state: "CA", country: "USA" },
            { name: "U.S. Olympic Training Center", city: "Colorado Springs", state: "CO", country: "USA" },
            { name: "Hospital for Special Surgery (Westchester)", city: "White Plains", state: "NY", country: "USA" }
        ],
        interventions: [
            { type: "Device", name: "Regenerative Therapy System", description: "Targeted ultrasound-guided cellular stimulation." }
        ],
        eligibilityCriteria: {
            inclusion: ["Professional or elite athlete", "Recent muscle/tendon injury", "Age 18-40"],
            exclusion: ["Systemic illness", "Prior regenerative therapy", "Current PED use"],
        },
        tags: ["Athlete", "Sports Medicine", "Regenerative"],
        enrollmentCount: 100,
        startDate: "2025-01-15",
        estimatedCompletionDate: "2026-07-15",
    },
    {
        id: "NCT05901234",
        name: "GOLDEN-YEARS: Frailty Prevention in Elderly",
        phase: "Phase 3",
        status: "Recruiting",
        condition: "Age-Related Frailty",
        diseaseCategory: "Geriatrics",
        intervention: "Combination: Exercise + Nutrition + Supplements",
        sponsor: "Geriatric Research Foundation",
        location: { city: "Miami", state: "FL", country: "USA", lat: 25.7617, lng: -80.1918 },
        description: "Multi-modal intervention to prevent frailty progression in community-dwelling elderly.",
        briefDescription: "Frailty prevention in elderly.",
        fullDescription: "Detailed geriatric study info.",
        collaborators: ["National Institute on Aging (NIA)", "SilverLife Health"],
        investigators: ["Dr. William Davis (Geriatrician)", "Dr. Anna Martinez (Nutritionist)"],
        contacts: [
            { name: "Golden-Years Study Center", role: "Primary Contact", email: "goldenyears@grf.org", phone: "1-305-555-0133" },
            { name: "Senior Outreach", role: "Outreach", email: "seniors@silverlife.com", phone: "1-800-GOLD-LIFE" }
        ],
        locations: [
            { name: "Mount Sinai Medical Center", city: "Miami", state: "FL", country: "USA" },
            { name: "Johns Hopkins Bayview", city: "Baltimore", state: "MD", country: "USA" },
            { name: "UCLA Geriatrics Center", city: "Los Angeles", state: "CA", country: "USA" }
        ],
        interventions: [
            { type: "Combination", name: "Multi-modal Program", description: "Exercise, nutritional counseling, and whey protein supplements." }
        ],
        eligibilityCriteria: {
            inclusion: ["Age 70-90", "Pre-frail or mildly frail", "Community dwelling", "Independent in basic ADLs"],
            exclusion: ["Severe cognitive impairment", "Terminal illness", "Severe mobility limitations"],
        },
        tags: ["Senior", "Geriatric", "Prevention"],
        enrollmentCount: 600,
        startDate: "2024-02-01",
        estimatedCompletionDate: "2027-02-01",
    },
    {
        id: "NCT06012345",
        name: "WOMEN-FIRST: Breast Cancer Prevention Trial",
        phase: "Phase 3",
        status: "Recruiting",
        condition: "Breast Cancer Prevention",
        diseaseCategory: "Oncology",
        intervention: "Drug: Selective Estrogen Receptor Modulator",
        sponsor: "Women's Cancer Research Network",
        location: { city: "New York", state: "NY", country: "USA", lat: 40.7128, lng: -74.0060 },
        description: "Evaluating a novel SERM for breast cancer prevention in high-risk women.",
        briefDescription: "Breast cancer prevention study.",
        fullDescription: "Detailed cancer prevention study.",
        collaborators: ["National Cancer Institute (NCI)", "Breast Cancer Research Foundation"],
        investigators: ["Dr. Elizabeth White (Oncologist)", "Dr. Sarah Lee (Prevention Specialist)"],
        contacts: [
            { name: "Women-First Study HQ", role: "Primary Contact", email: "info@women-first.org", phone: "1-212-555-0166" },
            { name: "Recruitment Coordinator", role: "Coordinator", email: "join@women-first-trial.org", phone: "1-800-WOMEN-BC" }
        ],
        locations: [
            { name: "Memorial Sloan Kettering Cancer Center", city: "New York", state: "NY", country: "USA" },
            { name: "Mayo Clinic", city: "Jacksonville", state: "FL", country: "USA" },
            { name: "Stanford Cancer Institute", city: "Stanford", state: "CA", country: "USA" }
        ],
        interventions: [
            { type: "Drug", name: "Selective Estrogen Receptor Modulator", description: "Daily oral tablet for 5 years." }
        ],
        eligibilityCriteria: {
            inclusion: ["Female", "Age 35-70", "High breast cancer risk", "No prior breast cancer"],
            exclusion: ["Current HRT", "History of VTE", "Pregnancy or planning pregnancy"],
        },
        tags: ["Women", "Cancer Prevention", "Adult"],
        enrollmentCount: 3000,
        startDate: "2024-05-01",
        estimatedCompletionDate: "2030-05-01",
    },
]
