import uuid
import httpx
from typing import Dict, Any, List
from loguru import logger


class WebScrapingAgent:
    """
    Agent responsible for discovering clinical trials from ClinicalTrials.gov
    based on patient conditions.

    Uses ClinicalTrials.gov API v2.
    """

    def __init__(self):

        self.logger = logger
        self.agent_id = "web_scraping_agent"
        self.role = "Clinical Trial Discovery Specialist"

        self.base_url = "https://clinicaltrials.gov/api/v2/studies"

    async def scrape_clinical_trials(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:

        """
        Search ClinicalTrials.gov for relevant trials.

        Args:
            patient_data: anonymized patient profile

        Returns:
            Dict containing list of discovered trials
        """

        self.logger.info("[WebScrapingAgent] Searching clinical trials")

        try:

            conditions = patient_data.get("conditions", [])

            if not conditions:

                return {
                    "trials": [],
                    "total_found": 0,
                    "message": "No conditions provided"
                }

            primary_condition = conditions[0].lower()

            params = {

                "query.cond": primary_condition,

                "filter.overallStatus": "RECRUITING",

                "pageSize": 10
            }

            self.logger.info(
                f"[WebScrapingAgent] Querying ClinicalTrials.gov for: {primary_condition}"
            )

            async with httpx.AsyncClient(timeout=15) as client:

                response = await client.get(self.base_url, params=params)

                response.raise_for_status()

                data = response.json()

            trials = []

            for study in data.get("studies", []):

                trial = self._process_study_data(study)

                if trial:
                    trials.append(trial)

            self.logger.info(
                f"[WebScrapingAgent] Found {len(trials)} trials"
            )

            return {

                "trials": trials,

                "total_found": len(trials),

                "search_condition": primary_condition,

                "source": "ClinicalTrials.gov API"
            }

        except Exception as e:

            self.logger.warning(
                f"[WebScrapingAgent] API failed, using fallback trials: {str(e)}"
            )

            return self._create_fallback_trials(patient_data)

    def _process_study_data(self, study: Dict[str, Any]) -> Dict[str, Any]:

        """
        Convert API study response into internal trial format.
        """

        try:

            protocol = study.get("protocolSection", {})

            identification = protocol.get("identificationModule", {})

            conditions_module = protocol.get("conditionsModule", {})

            eligibility = protocol.get("eligibilityModule", {})

            design = protocol.get("designModule", {})

            trial = {

                "trial_id": identification.get(
                    "nctId", f"NCT-{uuid.uuid4().hex[:8]}"
                ),

                "trial_name": identification.get(
                    "briefTitle", "Unknown Trial"
                ),

                "description": identification.get(
                    "officialTitle", ""
                ),

                "phase": (
                    design.get("phases", ["Phase 3"])[0]
                    if design.get("phases")
                    else "Phase 3"
                ),

                "status": "recruiting",

                "included_conditions": conditions_module.get("conditions", []),

                "age_min": self._extract_age_min(eligibility),

                "age_max": self._extract_age_max(eligibility),

                "location": "Multiple Locations",

                "drug_name": "Investigational Drug",

                "drug_class": "Therapeutic",

                "side_effects": ["Study specific"],

                "enrollment_target": 100,

                "duration_months": 12,

                "source": "ClinicalTrials.gov"
            }

            return trial

        except Exception as e:

            self.logger.warning(
                f"[WebScrapingAgent] Failed to process study: {str(e)}"
            )

            return None

    def _extract_age_min(self, eligibility: Dict[str, Any]) -> int:

        try:

            min_age = eligibility.get("minimumAge", "18 Years")

            import re

            match = re.search(r"\d+", min_age)

            return int(match.group()) if match else 18

        except:
            return 18

    def _extract_age_max(self, eligibility: Dict[str, Any]) -> int:

        try:

            max_age = eligibility.get("maximumAge", "75 Years")

            import re

            match = re.search(r"\d+", max_age)

            return int(match.group()) if match else 75

        except:
            return 75

    def _create_fallback_trials(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:

        """
        Generate mock trials if API fails.
        """

        conditions = patient_data.get("conditions", [])

        primary_condition = conditions[0] if conditions else "condition"

        mock_trials = [

            {

                "trial_id": f"MOCK-{uuid.uuid4().hex[:6]}",

                "trial_name": f"{primary_condition.title()} Treatment Study",

                "description": f"Clinical trial studying {primary_condition}",

                "phase": "Phase 3",

                "status": "recruiting",

                "included_conditions": [primary_condition],

                "age_min": 18,

                "age_max": 75,

                "location": "Multiple locations",

                "drug_name": "Investigational Drug",

                "drug_class": "Therapeutic",

                "side_effects": ["Nausea", "Fatigue"],

                "enrollment_target": 200,

                "duration_months": 24,

                "source": "Mock Data"
            },

            {

                "trial_id": f"MOCK-{uuid.uuid4().hex[:6]}",

                "trial_name": f"Advanced {primary_condition.title()} Study",

                "description": f"Advanced treatment research for {primary_condition}",

                "phase": "Phase 2",

                "status": "recruiting",

                "included_conditions": [primary_condition],

                "age_min": 25,

                "age_max": 65,

                "location": "Research centers",

                "drug_name": "Novel Compound",

                "drug_class": "Experimental",

                "side_effects": ["Headache", "Dizziness"],

                "enrollment_target": 150,

                "duration_months": 18,

                "source": "Mock Data"
            }
        ]

        return {

            "trials": mock_trials,

            "total_found": len(mock_trials),

            "search_condition": primary_condition,

            "fallback": True
        }

    def get_info(self) -> Dict[str, str]:

        return {

            "agent_id": self.agent_id,

            "role": self.role,

            "data_source": "ClinicalTrials.gov",

            "method": "Condition based trial discovery",

            "async_supported": True
        }


__all__ = ["WebScrapingAgent"]