from typing import Dict, Any, List
from loguru import logger
import re
from models.schemas import TrialCriteria, ClinicalTrial

class TrialParserAgent:
    """
    Agent responsible for parsing clinical trial eligibility criteria.
    
    Converts unstructured trial eligibility text into structured rules.
    
    Example:
    Input: "Inclusion: Patients aged 30–65 with Type 2 Diabetes. Exclusion: Heart disease"
    Output: {
        "age_min": 30,
        "age_max": 65,
        "disease": "type 2 diabetes",
        "exclude": ["heart disease"]
    }
    """
    
    def __init__(self):
        self.logger = logger
        self.agent_id = "trial_parser_agent"
        self.role = "Clinical Trial Criteria Parser"
    
    async def parse_trial_eligibility(self, trial_text: str, trial_id: str = "UNKNOWN") -> Dict[str, Any]:
        """
        Parse clinical trial eligibility text into structured criteria.
        
        Args:
            trial_text: Raw trial eligibility text
            trial_id: Trial identifier
        
        Returns:
            Structured trial criteria
        """
        self.logger.info(f"Parsing trial criteria for trial: {trial_id}")
        
        try:
            # Extract inclusion and exclusion sections
            inclusion_section = self._extract_section(trial_text, "inclusion")
            exclusion_section = self._extract_section(trial_text, "exclusion")
            
            criteria = TrialCriteria(
                age_min=self._extract_age_min(inclusion_section),
                age_max=self._extract_age_max(inclusion_section),
                gender=self._extract_gender(inclusion_section),
                included_conditions=self._extract_conditions(inclusion_section),
                excluded_conditions=self._extract_conditions(exclusion_section),
                excluded_medications=self._extract_medications(exclusion_section),
                bmi_min=self._extract_bmi_min(inclusion_section),
                bmi_max=self._extract_bmi_max(inclusion_section),
            )
            
            self.logger.info(f"Trial parsing complete for {trial_id}")
            
            return {
                "success": True,
                "trial_id": trial_id,
                "criteria": criteria.model_dump(),
                "inclusion_text": inclusion_section,
                "exclusion_text": exclusion_section
            }
        
        except Exception as e:
            self.logger.error(f"Trial parsing failed: {str(e)}")
            return {
                "success": False,
                "trial_id": trial_id,
                "error": str(e)
            }
    
    def _extract_section(self, text: str, section_type: str) -> str:
        """Extract inclusion or exclusion section from text"""
        if section_type.lower() == "inclusion":
            pattern = r"(?:inclusion|include)[\s:]*([^.]*?)(?:exclusion|exclude|$)"
        else:
            pattern = r"(?:exclusion|exclude)[\s:]*([^.]*?)(?:$|inclusion|include)"
        
        matches = re.findall(pattern, text, re.IGNORECASE | re.DOTALL)
        return matches[0] if matches else ""
    
    def _extract_age_min(self, text: str) -> int:
        """Extract minimum age requirement"""
        patterns = [
            r"(?:aged?|age)\s+(\d+)\s*(?:[-–]|to)",
            r"(?:aged?|age)\s+(?:of\s+)?(\d+)\s*(?:years?)?",
            r"(?:over|older\s+than)\s+(\d+)",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        return None
    
    def _extract_age_max(self, text: str) -> int:
        """Extract maximum age requirement"""
        patterns = [
            r"(?:aged?|age)\s+\d+\s*(?:[-–]|to)\s*(\d+)",
            r"(?:below|younger\s+than|under)\s+(\d+)",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                return int(matches[0])
        return None
    
    def _extract_gender(self, text: str) -> List[str]:
        """Extract gender restrictions"""
        genders = []
        if re.search(r"\b(male|men|boy)\b", text.lower()):
            genders.append("M")
        if re.search(r"\b(female|women|girl)\b", text.lower()):
            genders.append("F")
        return genders if genders else None
    
    def _extract_conditions(self, text: str) -> List[str]:
        """Extract medical conditions"""
        disease_keywords = {
            r"type\s*2?\s*diabetes": "Type 2 Diabetes",
            r"hypertension|high\s+blood\s+pressure": "Hypertension",
            r"heart\s+disease|cardiac|coronary": "Heart Disease",
            r"asthma": "Asthma",
            r"cancer": "Cancer",
            r"copd|chronic\s+obstructive": "COPD",
            r"arthritis": "Arthritis",
            r"depression|anxiety": "Mental Health Condition",
        }
        
        conditions = []
        text_lower = text.lower()
        
        for pattern, disease in disease_keywords.items():
            if re.search(pattern, text_lower):
                conditions.append(disease)
        
        return conditions
    
    def _extract_medications(self, text: str) -> List[str]:
        """Extract medication restrictions"""
        medication_keywords = [
            "metformin", "insulin", "lisinopril", "atorvastatin",
            "aspirin", "warfarin", "clopidogrel", "nsaid"
        ]
        
        medications = []
        text_lower = text.lower()
        
        for med in medication_keywords:
            if re.search(rf"\b{med}\b", text_lower):
                medications.append(med.title())
        
        return medications if medications else None
    
    def _extract_bmi_min(self, text: str) -> float:
        """Extract minimum BMI requirement"""
        patterns = [
            r"BMI\s+(?:of\s+)?(\d+\.?\d*)\s*(?:[-–]|to)",
            r"(?:over|minimum|at\s+least)\s+BMI\s+(\d+\.?\d*)",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return float(matches[0])
        return None
    
    def _extract_bmi_max(self, text: str) -> float:
        """Extract maximum BMI requirement"""
        patterns = [
            r"BMI\s+\d+\.?\d*\s*(?:[-–]|to)\s*(\d+\.?\d*)",
            r"(?:below|maximum|no\s+more\s+than)\s+BMI\s+(\d+\.?\d*)",
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                return float(matches[0])
        return None
    
    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "method": "Regex-based extraction + LLM-capable"
        }


# Export
__all__ = ["TrialParserAgent"]
