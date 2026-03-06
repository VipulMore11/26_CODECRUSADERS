from typing import Dict, Any, Optional, List
from loguru import logger
import json
import asyncio
import re
from models.schemas import PatientMedicalProfile, LabResult, MedicalCondition

class MedicalExtractionAgent:
    """
    Agent responsible for converting OCR text or raw medical data into structured medical JSON.
    
    Uses LLM-based extraction to convert unstructured text into structured medical profiles.
    """
    
    def __init__(self):
        self.logger = logger
        self.agent_id = "extraction_agent"
        self.role = "Medical Data Extraction Specialist"
    
    async def extract_medical_profile(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extract structured medical profile from raw data.
        
        Args:
            raw_data: Output from ingestion agent
        
        Returns:
            Structured medical profile
        """
        self.logger.info("Starting medical data extraction")
        
        try:
            if isinstance(raw_data, dict) and "extracted_text" in raw_data:
                # OCR/text-based extraction
                text = raw_data.get("extracted_text", "")
                profile = self._extract_from_text(text)
            else:
                # Structured data extraction
                profile = self._extract_from_structured(raw_data)
            
            self.logger.info(f"Extraction complete: {profile.get('disease', 'Unknown')}")
            
            return {
                "success": True,
                "extracted_profile": profile,
                "extraction_method": raw_data.get("source", "structured")
            }
        
        except Exception as e:
            self.logger.error(f"Extraction failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _extract_from_text(self, text: str) -> Dict[str, Any]:
        """Extract medical information from OCR text"""
        profile = {
            "age": self._extract_age(text),
            "gender": self._extract_gender(text),
            "disease": self._extract_disease(text),
            "lab_results": self._extract_lab_results(text),
            "medications": self._extract_medications(text),
            "allergies": self._extract_allergies(text),
        }
        return profile
    
    def _extract_from_structured(self, data: Dict) -> Dict[str, Any]:
        """Extract medical information from structured data"""
        profile = {
            "age": data.get("age", 0),
            "gender": data.get("gender", ""),
            "disease": data.get("disease", ""),
            "lab_results": data.get("lab_results", {}),
            "medications": data.get("medications", []),
            "allergies": data.get("allergies", []),
            "weight_kg": data.get("weight_kg", None),
            "height_cm": data.get("height_cm", None),
        }
        return profile
    
    def _extract_age(self, text: str) -> int:
        """Extract age from text"""
        age_pattern = r"(?:age|years?)\s*(?:of\s+)?(\d+)"
        matches = re.findall(age_pattern, text.lower())
        if matches:
            return int(matches[0])
        return 0
    
    def _extract_gender(self, text: str) -> str:
        """Extract gender from text"""
        if re.search(r"\b(male|man)\b", text.lower()):
            return "Male"
        elif re.search(r"\b(female|woman)\b", text.lower()):
            return "Female"
        return "Unknown"
    
    def _extract_disease(self, text: str) -> str:
        """Extract primary disease/diagnosis from text"""
        disease_keywords = {
            r"type\s*2\s*diabetes": "Type 2 Diabetes",
            r"hypertension|high\s+blood\s+pressure": "Hypertension",
            r"heart\s+disease|cardiac|coronary": "Heart Disease",
            r"asthma": "Asthma",
            r"cancer": "Cancer",
            r"copd|chronic\s+obstructive": "COPD",
        }
        
        text_lower = text.lower()
        for pattern, disease in disease_keywords.items():
            if re.search(pattern, text_lower):
                return disease
        return "Unknown"
    
    def _extract_lab_results(self, text: str) -> Dict[str, float]:
        """Extract laboratory results from text"""
        lab_results = {}
        
        # Common lab patterns
        lab_patterns = {
            r"HbA1c[:\s]+(\d+\.?\d*)": "HbA1c",
            r"blood\s+glucose[:\s]+(\d+\.?\d*)": "Blood Glucose",
            r"cholesterol[:\s]+(\d+\.?\d*)": "Cholesterol",
            r"triglycerides[:\s]+(\d+\.?\d*)": "Triglycerides",
            r"creatinine[:\s]+(\d+\.?\d*)": "Creatinine",
        }
        
        for pattern, lab_name in lab_patterns.items():
            matches = re.findall(pattern, text, re.IGNORECASE)
            if matches:
                lab_results[lab_name] = float(matches[0])
        
        return lab_results
    
    def _extract_medications(self, text: str) -> List[str]:
        """Extract medications from text"""
        medication_keywords = [
            r"metformin", r"insulin", r"lisinopril", r"atorvastatin",
            r"aspirin", r"amoxicillin", r"ibuprofen", r"acetaminophen"
        ]
        
        medications = []
        text_lower = text.lower()
        
        for med_pattern in medication_keywords:
            if re.search(med_pattern, text_lower):
                medications.append(med_pattern.replace(r"\\", "").title())
        
        return medications
    
    def _extract_allergies(self, text: str) -> List[str]:
        """Extract allergies from text"""
        allergy_pattern = r"(?:allerg(?:ies|y|ic)?\s+(?:to|with)?)\s+([^.;,]+)"
        matches = re.findall(allergy_pattern, text, re.IGNORECASE)
        
        allergies = []
        for match in matches:
            items = [item.strip() for item in match.split("and")]
            allergies.extend(items)
        
        return allergies
    
    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "extraction_method": "Regex-based + LLM-capable"
        }


# Export
__all__ = ["MedicalExtractionAgent"]
