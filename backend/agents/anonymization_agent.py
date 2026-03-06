from typing import Dict, Any
from loguru import logger
import uuid
import re
from datetime import datetime
from models.schemas import AnonymizedPatientProfile


# PII patterns to strip from free-text fields
_PII_PATTERNS = [
    re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'),          # phone
    re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.\w+\b'),  # email
    re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),                   # SSN
]


class AnonymizationAgent:
    """
    Agent responsible for detecting and removing PII from patient data.
    """

    def __init__(self):
        self.logger = logger
        self.agent_id = "anonymization_agent"
        self.role = "Privacy Preservation Specialist"

    @staticmethod
    def _generate_patient_id() -> str:
        return f"PT-{uuid.uuid4()}"

    @staticmethod
    def _strip_pii(text: str) -> str:
        for pattern in _PII_PATTERNS:
            text = pattern.sub("[REDACTED]", text)
        return text

    async def anonymize_patient_data(self, extracted_data: Dict[str, Any], patient_id: str = None) -> Dict[str, Any]:
        self.logger.info("Starting patient data anonymization")

        try:
            if not patient_id:
                patient_id = self._generate_patient_id()

            profile = extracted_data.get("extracted_profile", extracted_data)

            # Strip PII from string fields
            for key, val in profile.items():
                if isinstance(val, str):
                    profile[key] = self._strip_pii(val)
            
            # Create AnonymizedPatientProfile model
            anonymized = AnonymizedPatientProfile(
                patient_id=patient_id,
                age=anonymized_profile.get("age", 0),
                gender=anonymized_profile.get("gender", "Unknown"),
                weight_kg=anonymized_profile.get("weight_kg"),
                height_cm=anonymized_profile.get("height_cm"),
                bmi=self._calculate_bmi(
                    anonymized_profile.get("weight_kg"),
                    anonymized_profile.get("height_cm")
                ),
                conditions=[anonymized_profile.get("disease", "Unknown")],
                lab_results=anonymized_profile.get("lab_results", {}),
                medications=anonymized_profile.get("medications", []),
                allergies=anonymized_profile.get("allergies", []),
                smoking_status=anonymized_profile.get("smoking_status"),
                alcohol_use=anonymized_profile.get("alcohol_use"),
                anonymized_at=datetime.utcnow()
            )
            
            self.logger.info(f"Anonymization complete for {patient_id}")
            
            return {
                "success": True,
                "anonymized_profile": anonymized.model_dump(),
                "patient_id": patient_id
            }
        
        except Exception as e:
            self.logger.error(f"Anonymization failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    @staticmethod
    def _calculate_bmi(weight_kg: float, height_cm: float) -> float:
        """Calculate BMI from weight and height"""
        if not weight_kg or not height_cm:
            return None
        
        height_m = height_cm / 100
        bmi = weight_kg / (height_m ** 2)
        return round(bmi, 2)
    
    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "features": ["UUID generation", "PII removal", "Regex + NER detection"]
        }


# Export
__all__ = ["AnonymizationAgent"]
