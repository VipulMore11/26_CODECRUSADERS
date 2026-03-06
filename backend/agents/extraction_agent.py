from typing import Dict, Any, List
from loguru import logger
import re


class MedicalExtractionAgent:
    """
    Converts raw patient data into structured medical profile.
    """

    def __init__(self):
        self.logger = logger
        self.agent_id = "extraction_agent"
        self.role = "Medical Data Extraction Specialist"

    async def extract_medical_profile(self, raw_data: Dict[str, Any]) -> Dict[str, Any]:

        self.logger.info("[ExtractionAgent] Starting extraction")

        try:

            data_type = raw_data.get("data_type")

            # JSON structured input
            if data_type == "json":

                structured_data = raw_data.get("content", {})

                profile = self._extract_from_structured(structured_data)

            # OCR based extraction
            elif data_type in ["pdf", "image"]:

                text = raw_data.get("extracted_text", "")

                profile = self._extract_from_text(text)

            else:

                raise ValueError("Unsupported raw data format")

            self.logger.info(
                f"[ExtractionAgent] Extraction complete: {profile.get('disease','Unknown')}"
            )

            return {
                "success": True,
                "extracted_profile": profile,
                "extraction_method": data_type
            }

        except Exception as e:

            self.logger.error(f"[ExtractionAgent] Extraction failed: {str(e)}")

            return {
                "success": False,
                "error": str(e)
            }

    def _extract_from_structured(self, data: Dict) -> Dict[str, Any]:

        return {
            "age": data.get("age", 0),
            "gender": data.get("gender", ""),
            "disease": data.get("disease", ""),
            "lab_results": data.get("lab_results", {}),
            "medications": data.get("medications", []),
            "allergies": data.get("allergies", []),
            "weight_kg": data.get("weight_kg"),
            "height_cm": data.get("height_cm"),
        }

    def _extract_from_text(self, text: str) -> Dict[str, Any]:

        profile = {
            "age": self._extract_age(text),
            "gender": self._extract_gender(text),
            "disease": self._extract_disease(text),
            "lab_results": self._extract_lab_results(text),
            "medications": self._extract_medications(text),
            "allergies": self._extract_allergies(text),
        }

        return profile

    def _extract_age(self, text: str) -> int:

        age_pattern = r"(?:age|years?)\s*(?:of\s+)?(\d+)"

        matches = re.findall(age_pattern, text.lower())

        if matches:
            return int(matches[0])

        return 0

    def _extract_gender(self, text: str) -> str:

        if re.search(r"\b(male|man)\b", text.lower()):
            return "Male"

        elif re.search(r"\b(female|woman)\b", text.lower()):
            return "Female"

        return "Unknown"

    def _extract_disease(self, text: str) -> str:

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

        lab_results = {}

        lab_patterns = {
            r"HbA1c[:\s]+(\d+\.?\d*)": "HbA1c",
            r"blood\s+glucose[:\s]+(\d+\.?\d*)": "Blood Glucose",
            r"cholesterol[:\s]+(\d+\.?\d*)": "Cholesterol",
        }

        for pattern, lab_name in lab_patterns.items():

            matches = re.findall(pattern, text, re.IGNORECASE)

            if matches:

                lab_results[lab_name] = float(matches[0])

        return lab_results

    def _extract_medications(self, text: str) -> List[str]:

        meds = ["metformin", "insulin", "lisinopril", "atorvastatin"]

        text_lower = text.lower()

        return [med.title() for med in meds if med in text_lower]

    def _extract_allergies(self, text: str) -> List[str]:

        allergy_pattern = r"(?:allerg(?:ies|y)?\s+(?:to|with)?)\s+([^.;,]+)"

        matches = re.findall(allergy_pattern, text, re.IGNORECASE)

        allergies = []

        for match in matches:

            items = [item.strip() for item in match.split("and")]

            allergies.extend(items)

        return allergies

    def get_info(self):

        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "extraction_method": "Regex + structured extraction"
        }