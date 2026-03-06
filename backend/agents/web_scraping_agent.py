import requests
import uuid
from typing import Dict, Any, List
from loguru import logger

class WebScrapingAgent:
    """
    Agent responsible for scraping clinical trials from ClinicalTrials.gov
    based on patient conditions and health data.
    """

    def __init__(self):
        self.logger = logger
        self.agent_id = "web_scraping_agent"
        self.role = "Clinical Trial Discovery Specialist"
        self.base_url = "https://clinicaltrials.gov/api/v2/studies"

    async def scrape_clinical_trials(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scrape clinical trials from ClinicalTrials.gov based on patient conditions.

        Args:
            patient_data: Patient health information

        Returns:
            Dict containing scraped trials and metadata
        """
        self.logger.info("Starting web scraping for clinical trials")

        try:
            # Extract key conditions from patient data
            conditions = patient_data.get('conditions', [])
            if not conditions:
                return {
                    'trials': [],
                    'message': 'No conditions found to search for trials',
                    'total_found': 0
                }

            # Search for trials based on primary condition
            primary_condition = conditions[0].lower()

            # Prepare API request
            params = {
                'query.cond': primary_condition,
                'filter.overallStatus': 'RECRUITING',
                'pageSize': 10  # Limit to 10 trials for demo
            }

            self.logger.info(f"Searching ClinicalTrials.gov for: {primary_condition}")

            # Make API request
            response = requests.get(self.base_url, params=params, timeout=15)
            response.raise_for_status()

            data = response.json()

            # Process the API response
            scraped_trials = []
            for study in data.get('studies', []):
                trial = self._process_study_data(study)
                if trial:
                    scraped_trials.append(trial)

            self.logger.info(f"Successfully scraped {len(scraped_trials)} trials")

            return {
                'trials': scraped_trials,
                'total_found': len(scraped_trials),
                'search_condition': primary_condition,
                'source': 'ClinicalTrials.gov API',
                'api_url': response.url
            }

        except requests.RequestException as e:
            self.logger.warning(f"ClinicalTrials.gov API request failed: {str(e)}")
            return self._create_fallback_trials(patient_data)
        except Exception as e:
            self.logger.error(f"Web scraping failed: {str(e)}")
            return {
                'trials': [],
                'error': f'Scraping failed: {str(e)}',
                'total_found': 0,
                'fallback': True
            }

    def _process_study_data(self, study: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a single study from ClinicalTrials.gov API response.

        Args:
            study: Study data from API

        Returns:
            Processed trial dictionary
        """
        try:
            protocol = study.get('protocolSection', {})

            # Extract trial information
            identification = protocol.get('identificationModule', {})
            conditions_module = protocol.get('conditionsModule', {})
            eligibility = protocol.get('eligibilityModule', {})
            design = protocol.get('designModule', {})

            # Build trial object
            trial = {
                'trial_id': identification.get('nctId', f'NCT-{uuid.uuid4().hex[:8]}'),
                'trial_name': identification.get('briefTitle', 'Unknown Trial'),
                'description': identification.get('officialTitle', ''),
                'phase': design.get('phases', ['Phase 3'])[0] if design.get('phases') else 'Phase 3',
                'status': 'recruiting',
                'included_conditions': conditions_module.get('conditions', []),
                'age_min': self._extract_age_min(eligibility),
                'age_max': self._extract_age_max(eligibility),
                'location': 'Multiple locations',
                'drug_name': 'Investigational Drug',
                'drug_class': 'Therapeutic',
                'side_effects': ['Study specific'],
                'enrollment_target': 100,
                'duration_months': 12,
                'source': 'ClinicalTrials.gov',
                'last_updated': study.get('protocolSection', {}).get('statusModule', {}).get('lastUpdatePostDateStruct', {}).get('date')
            }

            return trial

        except Exception as e:
            self.logger.warning(f"Failed to process study data: {str(e)}")
            return None

    def _extract_age_min(self, eligibility: Dict[str, Any]) -> int:
        """Extract minimum age from eligibility criteria"""
        if not eligibility:
            return 18

        min_age_str = eligibility.get('minimumAge', '18 Years')
        try:
            import re
            match = re.search(r'(\d+)', min_age_str)
            return int(match.group(1)) if match else 18
        except:
            return 18

    def _extract_age_max(self, eligibility: Dict[str, Any]) -> int:
        """Extract maximum age from eligibility criteria"""
        if not eligibility:
            return 75

        max_age_str = eligibility.get('maximumAge', '75 Years')
        try:
            import re
            match = re.search(r'(\d+)', max_age_str)
            return int(match.group(1)) if match else 75
        except:
            return 75

    def _create_fallback_trials(self, patient_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create mock trials when API is unavailable"""
        conditions = patient_data.get('conditions', [])
        primary_condition = conditions[0] if conditions else 'condition'

        mock_trials = [
            {
                'trial_id': f'MOCK-{uuid.uuid4().hex[:6]}',
                'trial_name': f'{primary_condition.title()} Treatment Study 2024',
                'description': f'Clinical trial for {primary_condition} treatment',
                'phase': 'Phase 3',
                'status': 'recruiting',
                'included_conditions': [primary_condition],
                'age_min': 18,
                'age_max': 75,
                'location': 'Multiple locations',
                'drug_name': 'Investigational Drug',
                'drug_class': 'Therapeutic',
                'side_effects': ['Mild nausea', 'Fatigue'],
                'enrollment_target': 200,
                'duration_months': 24,
                'source': 'Mock Data (API unavailable)'
            },
            {
                'trial_id': f'MOCK-{uuid.uuid4().hex[:6]}',
                'trial_name': f'Advanced {primary_condition.title()} Research Study',
                'description': f'Advanced research study for {primary_condition}',
                'phase': 'Phase 2',
                'status': 'recruiting',
                'included_conditions': [primary_condition],
                'age_min': 25,
                'age_max': 65,
                'location': 'Research centers',
                'drug_name': 'Novel Compound',
                'drug_class': 'Experimental',
                'side_effects': ['Headache', 'Dizziness'],
                'enrollment_target': 150,
                'duration_months': 18,
                'source': 'Mock Data (API unavailable)'
            }
        ]

        return {
            'trials': mock_trials,
            'total_found': len(mock_trials),
            'search_condition': primary_condition,
            'source': 'Mock Data (ClinicalTrials.gov API unavailable)',
            'fallback': True
        }

    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "data_source": "ClinicalTrials.gov API",
            "search_method": "Condition-based trial discovery",
            "fallback_support": "Mock data generation when API unavailable"
        }


# Export
__all__ = ["WebScrapingAgent"]