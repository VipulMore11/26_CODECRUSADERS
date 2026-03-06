from typing import Dict, Any, List
from loguru import logger
from models.schemas import TrialMatchResult, EligibilityMatch, ClinicalTrial, AnonymizedPatientProfile

class MatchingAgent:
    """
    Agent responsible for comparing patient profiles with trial criteria.
    
    Implements rule-based eligibility scoring with:
    - Age match
    - Disease match
    - Lab result match
    - Medication restrictions
    - BMI match
    """
    
    def __init__(self):
        self.logger = logger
        self.agent_id = "matching_agent"
        self.role = "Patient-Trial Matching Specialist"
    
    async def match_patient_to_trials(
        self,
        patient_profile: AnonymizedPatientProfile,
        trials: List[ClinicalTrial]
    ) -> Dict[str, Any]:
        """
        Match anonymized patient profile to clinical trials.
        
        Args:
            patient_profile: Anonymized patient profile
            trials: List of clinical trials with criteria
        
        Returns:
            List of trial matches with eligibility scores
        """
        self.logger.info(f"Starting patient-trial matching for {patient_profile.patient_id}")
        
        try:
            matches = []
            
            for trial in trials:
                match_result = self._match_patient_to_trial(patient_profile, trial)
                matches.append(match_result)
            
            # Sort by eligibility score (highest first)
            matches.sort(key=lambda x: x.get("eligibility_score", 0), reverse=True)
            
            self.logger.info(f"Matching complete: {len(matches)} trials evaluated")
            
            return {
                "success": True,
                "patient_id": patient_profile.patient_id,
                "matches": matches,
                "total_trials_evaluated": len(trials)
            }
        
        except Exception as e:
            self.logger.error(f"Matching failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _match_patient_to_trial(self, patient: AnonymizedPatientProfile, trial: ClinicalTrial) -> Dict:
        """Match single patient to single trial"""
        criteria = trial.criteria
        details = []
        scores = []
        matched_criteria = []
        unmatched_criteria = []
        risk_factors = []
        
        # Age matching
        age_match = self._match_age(patient.age, criteria.age_min, criteria.age_max)
        if age_match["matched"]:
            matched_criteria.append("age")
        else:
            unmatched_criteria.append("age")
        details.append(age_match)
        scores.append(age_match["confidence_score"])
        
        # Disease/Condition matching
        disease_match = self._match_conditions(patient.conditions, criteria.included_conditions, criteria.excluded_conditions)
        if disease_match["matched"]:
            matched_criteria.append("disease")
        else:
            unmatched_criteria.append("disease")
        details.append(disease_match)
        scores.append(disease_match["confidence_score"])
        
        # Lab results matching
        if criteria.required_lab_tests:
            lab_match = self._match_lab_results(patient.lab_results, criteria.required_lab_tests)
            if lab_match["matched"]:
                matched_criteria.append("lab_results")
            else:
                unmatched_criteria.append("lab_results")
            details.append(lab_match)
            scores.append(lab_match["confidence_score"])
        
        # BMI matching
        if criteria.bmi_min or criteria.bmi_max:
            bmi_match = self._match_bmi(patient.bmi, criteria.bmi_min, criteria.bmi_max)
            if bmi_match["matched"]:
                matched_criteria.append("bmi")
            else:
                unmatched_criteria.append("bmi")
            details.append(bmi_match)
            scores.append(bmi_match["confidence_score"])
        
        # Medication restrictions
        med_match = self._match_medications(patient.medications, criteria.excluded_medications or [])
        if med_match["matched"]:
            matched_criteria.append("medications")
        else:
            unmatched_criteria.append("medications")
        details.append(med_match)
        scores.append(med_match["confidence_score"])
        
        # Check for risk factors
        if patient.lab_results:
            hba1c = patient.lab_results.get("HbA1c", 0)
            if hba1c > 8.5:
                risk_factors.append("High HbA1c level")
        
        # Calculate overall eligibility score
        overall_score = sum(scores) / len(scores) if scores else 0.0
        is_eligible = overall_score >= 0.7 and len(unmatched_criteria) <= 1
        
        return {
            "trial_id": trial.trial_id,
            "trial_name": trial.trial_name,
            "eligibility_score": round(overall_score, 2),
            "is_eligible": is_eligible,
            "matched_criteria": matched_criteria,
            "unmatched_criteria": unmatched_criteria,
            "details": details,
            "risk_factors": risk_factors,
            "recommendations": self._generate_recommendations(is_eligible, unmatched_criteria, trial)
        }
    
    @staticmethod
    def _match_age(patient_age: int, min_age: int, max_age: int) -> Dict:
        """Match patient age with trial age requirements"""
        if not patient_age:
            return {
                "criterion": "Age Range",
                "matched": False,
                "explanation": "Patient age not available",
                "confidence_score": 0.0
            }
        
        if min_age and max_age:
            matched = min_age <= patient_age <= max_age
            explanation = f"Patient age {patient_age} is {'within' if matched else 'outside'} range {min_age}-{max_age}"
        elif min_age:
            matched = patient_age >= min_age
            explanation = f"Patient age {patient_age} is {'at least' if matched else 'below'} minimum {min_age}"
        elif max_age:
            matched = patient_age <= max_age
            explanation = f"Patient age {patient_age} is {'at most' if matched else 'above'} maximum {max_age}"
        else:
            matched = True
            explanation = "No age restrictions"
        
        return {
            "criterion": "Age Range",
            "matched": matched,
            "explanation": explanation,
            "confidence_score": 0.95 if matched else 0.1
        }
    
    @staticmethod
    def _match_conditions(patient_conditions: List[str], required: List[str], excluded: List[str]) -> Dict:
        """Match patient conditions with trial criteria"""
        patient_cond_lower = [c.lower() for c in patient_conditions]
        required_lower = [c.lower() for c in required]
        excluded_lower = [c.lower() for c in excluded]
        
        # Check for excluded conditions
        for exc_cond in excluded_lower:
            if any(exc_cond in p for p in patient_cond_lower):
                return {
                    "criterion": "Medical Conditions",
                    "matched": False,
                    "explanation": f"Patient has excluded condition: {exc_cond}",
                    "confidence_score": 0.0
                }
        
        # Check for required conditions
        matched_required = []
        for req_cond in required_lower:
            for p_cond in patient_cond_lower:
                if req_cond in p_cond or p_cond in req_cond:
                    matched_required.append(req_cond)
                    break
        
        if required_lower and matched_required:
            score = len(matched_required) / len(required_lower)
            return {
                "criterion": "Medical Conditions",
                "matched": True,
                "explanation": f"Patient has {len(matched_required)}/{len(required_lower)} required conditions",
                "confidence_score": score
            }
        elif not required_lower:
            return {
                "criterion": "Medical Conditions",
                "matched": True,
                "explanation": "No specific conditions required",
                "confidence_score": 0.8
            }
        else:
            return {
                "criterion": "Medical Conditions",
                "matched": False,
                "explanation": f"Patient does not have required conditions",
                "confidence_score": 0.0
            }
    
    @staticmethod
    def _match_lab_results(patient_labs: Dict[str, float], required_labs: Dict[str, Dict[str, float]]) -> Dict:
        """Match patient lab results with trial requirements"""
        if not required_labs:
            return {
                "criterion": "Lab Results",
                "matched": True,
                "explanation": "No lab requirements",
                "confidence_score": 0.8
            }
        
        matched_count = 0
        for lab_name, requirements in required_labs.items():
            if lab_name in patient_labs:
                value = patient_labs[lab_name]
                min_val = requirements.get("min")
                max_val = requirements.get("max")
                
                if min_val and max_val:
                    if min_val <= value <= max_val:
                        matched_count += 1
                elif min_val and value >= min_val:
                    matched_count += 1
                elif max_val and value <= max_val:
                    matched_count += 1
        
        score = matched_count / len(required_labs) if required_labs else 0.5
        return {
            "criterion": "Lab Results",
            "matched": score >= 0.5,
            "explanation": f"Lab results match: {matched_count}/{len(required_labs)}",
            "confidence_score": score
        }
    
    @staticmethod
    def _match_bmi(patient_bmi: float, min_bmi: float, max_bmi: float) -> Dict:
        """Match patient BMI with trial requirements"""
        if not patient_bmi:
            return {
                "criterion": "BMI",
                "matched": False,
                "explanation": "Patient BMI not available",
                "confidence_score": 0.0
            }
        
        if min_bmi and max_bmi:
            matched = min_bmi <= patient_bmi <= max_bmi
            explanation = f"Patient BMI {patient_bmi} is {'within' if matched else 'outside'} range {min_bmi}-{max_bmi}"
        elif min_bmi:
            matched = patient_bmi >= min_bmi
            explanation = f"Patient BMI {patient_bmi} is {'above' if matched else 'below'} minimum {min_bmi}"
        elif max_bmi:
            matched = patient_bmi <= max_bmi
            explanation = f"Patient BMI {patient_bmi} is {'below' if matched else 'above'} maximum {max_bmi}"
        else:
            matched = True
            explanation = "No BMI restrictions"
        
        return {
            "criterion": "BMI",
            "matched": matched,
            "explanation": explanation,
            "confidence_score": 0.9 if matched else 0.1
        }
    
    @staticmethod
    def _match_medications(patient_meds: List[str], excluded_meds: List[str]) -> Dict:
        """Match patient medications with trial exclusions"""
        if not excluded_meds:
            return {
                "criterion": "Medications",
                "matched": True,
                "explanation": "No medication restrictions",
                "confidence_score": 1.0
            }
        
        patient_meds_lower = [m.lower() for m in patient_meds]
        excluded_meds_lower = [m.lower() for m in excluded_meds]
        
        for exc_med in excluded_meds_lower:
            for p_med in patient_meds_lower:
                if exc_med in p_med or p_med in exc_med:
                    return {
                        "criterion": "Medications",
                        "matched": False,
                        "explanation": f"Patient taking excluded medication: {p_med}",
                        "confidence_score": 0.0
                    }
        
        return {
            "criterion": "Medications",
            "matched": True,
            "explanation": "No excluded medications detected",
            "confidence_score": 0.95
        }
    
    @staticmethod
    def _generate_recommendations(is_eligible: bool, unmatched: List[str], trial: ClinicalTrial) -> str:
        """Generate recommendations for the patient"""
        if is_eligible:
            return f"Patient is eligible for {trial.trial_name}. Recommended to proceed with screening."
        else:
            reasons = ", ".join(unmatched) if unmatched else "unknown reasons"
            return f"Patient does not meet all criteria ({reasons}). Consider alternative trials."
    
    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "matching_criteria": ["age", "disease", "lab_results", "bmi", "medications"]
        }


# Export
__all__ = ["MatchingAgent"]
