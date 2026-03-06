from typing import Dict, Any, List
from loguru import logger
import re
from models.schemas import TrialCriteria


class TrialParserAgent:

    """
    Converts clinical trial eligibility text into structured criteria.
    """

    def __init__(self):

        self.logger = logger
        self.agent_id = "trial_parser_agent"
        self.role = "Clinical Trial Criteria Parser"

    async def parse_trial_eligibility(self, trial_text: str, trial_id: str = "UNKNOWN") -> Dict[str, Any]:

        self.logger.info(f"[TrialParserAgent] Parsing criteria for {trial_id}")

        try:

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

                bmi_max=self._extract_bmi_max(inclusion_section)

            )

            self.logger.info(f"[TrialParserAgent] Parsing completed for {trial_id}")

            return {

                "success": True,

                "trial_id": trial_id,

                "criteria": criteria.model_dump(),

                "inclusion_text": inclusion_section,

                "exclusion_text": exclusion_section
            }

        except Exception as e:

            self.logger.error(f"[TrialParserAgent] Failed: {str(e)}")

            return {

                "success": False,

                "trial_id": trial_id,

                "error": str(e)
            }

    def _extract_section(self, text: str, section_type: str) -> str:

        text_lower = text.lower()

        if section_type == "inclusion":

            match = re.search(
                r"inclusion\s*criteria[:\-]?(.*?)(?:exclusion\s*criteria|$)",
                text_lower,
                re.DOTALL
            )

        else:

            match = re.search(
                r"exclusion\s*criteria[:\-]?(.*)",
                text_lower,
                re.DOTALL
            )

        return match.group(1) if match else text_lower

    def _extract_age_min(self, text: str):

        patterns = [

            r"(\d+)\s*(?:-|to)\s*\d+",

            r"(?:age\s*>=?|over|older\s*than)\s*(\d+)"
        ]

        for p in patterns:

            m = re.findall(p, text)

            if m:
                return int(m[0])

        return None

    def _extract_age_max(self, text: str):

        patterns = [

            r"\d+\s*(?:-|to)\s*(\d+)",

            r"(?:under|below|<=?)\s*(\d+)"
        ]

        for p in patterns:

            m = re.findall(p, text)

            if m:
                return int(m[0])

        return None

    def _extract_gender(self, text: str) -> List[str]:

        genders = []

        if re.search(r"\bmale\b", text):

            genders.append("M")

        if re.search(r"\bfemale\b", text):

            genders.append("F")

        return genders

    def _extract_conditions(self, text: str) -> List[str]:

        disease_keywords = {

            r"type\s*2\s*diabetes": "Type 2 Diabetes",

            r"hypertension": "Hypertension",

            r"heart\s*disease": "Heart Disease",

            r"asthma": "Asthma",

            r"cancer": "Cancer",

            r"copd": "COPD"
        }

        conditions = []

        for pattern, disease in disease_keywords.items():

            if re.search(pattern, text):

                conditions.append(disease)

        return conditions

    def _extract_medications(self, text: str) -> List[str]:

        meds = [

            "metformin",
            "insulin",
            "warfarin",
            "aspirin"
        ]

        found = []

        for med in meds:

            if med in text:

                found.append(med.title())

        return found

    def _extract_bmi_min(self, text: str):

        m = re.findall(r"bmi\s*(\d+\.?\d*)\s*(?:-|to)", text)

        return float(m[0]) if m else None

    def _extract_bmi_max(self, text: str):

        m = re.findall(r"bmi\s*\d+\.?\d*\s*(?:-|to)\s*(\d+\.?\d*)", text)

        return float(m[0]) if m else None

    def get_info(self):

        return {

            "agent_id": self.agent_id,

            "role": self.role,

            "method": "Regex based criteria extraction"
        }


__all__ = ["TrialParserAgent"]