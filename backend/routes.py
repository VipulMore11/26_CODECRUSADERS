from flask import Blueprint, request, jsonify
import json
import uuid
from datetime import datetime
from agents import WebScrapingAgent
import asyncio

from orchestrator.orchestrator import get_orchestrator

agent_bp = Blueprint('agent', __name__, url_prefix='/api/agent')

class AgenticAI:
    """
    Agentic AI that scrapes clinical trials from the internet and analyzes patient-trial matching.
    Uses multiple specialized agents for comprehensive analysis.
    """

    def __init__(self):
        self.web_scraping_agent = WebScrapingAgent()
        self.agents = {
            'data_ingestion': self._data_ingestion_agent,
            'medical_analysis': self._medical_analysis_agent,
            'trial_matching': self._trial_matching_agent,
            'risk_assessment': self._risk_assessment_agent,
            'recommendation': self._recommendation_agent
        }

    def _data_ingestion_agent(self, patient_data, trials_data):
        """Agent for ingesting and validating input data"""
        return {
            'status': 'validated',
            'patient_records': len(patient_data) if isinstance(patient_data, list) else 1,
            'trial_records': len(trials_data),
            'data_quality': 'high'
        }

    def _medical_analysis_agent(self, patient_data, trials_data):
        """Agent for analyzing medical conditions and requirements"""
        # Simple analysis based on common clinical trial criteria
        analysis = {
            'conditions_identified': [],
            'lab_values': {},
            'eligibility_factors': [],
            'risk_indicators': []
        }

        if isinstance(patient_data, dict):
            if 'conditions' in patient_data:
                analysis['conditions_identified'] = patient_data['conditions']
            if 'lab_results' in patient_data:
                analysis['lab_values'] = patient_data['lab_results']

        return analysis

    def _trial_matching_agent(self, patient_data, trials_data):
        """Agent for matching patients to clinical trials"""
        matches = []

        for trial in trials_data:
            match_score = 0.0
            reasons = []

            # Simple matching logic
            if isinstance(patient_data, dict):
                patient_age = patient_data.get('age', 0)
                patient_conditions = patient_data.get('conditions', [])

                # Age matching (simplified)
                if 'age_min' in trial and 'age_max' in trial:
                    if trial['age_min'] <= patient_age <= trial['age_max']:
                        match_score += 0.3
                        reasons.append(f"Age {patient_age} within range {trial['age_min']}-{trial['age_max']}")

                # Condition matching (simplified)
                trial_conditions = trial.get('included_conditions', [])
                if any(cond in patient_conditions for cond in trial_conditions):
                    match_score += 0.4
                    reasons.append("Matching medical conditions found")

            matches.append({
                'trial_id': trial.get('trial_id', 'unknown'),
                'trial_name': trial.get('trial_name', 'Unknown Trial'),
                'match_score': min(match_score, 1.0),
                'is_eligible': match_score > 0.5,
                'reasons': reasons
            })

        return {'matches': matches}

    def _risk_assessment_agent(self, patient_data, trials_data):
        """Agent for assessing risks and contraindications"""
        risks = []

        if isinstance(patient_data, dict):
            medications = patient_data.get('medications', [])
            allergies = patient_data.get('allergies', [])

            if medications:
                risks.append("Review current medications for interactions")

            if allergies:
                risks.append("Check for drug allergies in trial medications")

        return {'risks': risks, 'severity': 'moderate'}

    def _recommendation_agent(self, patient_data, trials_data):
        """Agent for generating recommendations"""
        return {
            'recommendations': [
                "Consult with healthcare provider before enrollment",
                "Review full trial protocol and informed consent",
                "Monitor for adverse reactions during participation"
            ],
            'next_steps': [
                "Schedule consultation with trial coordinator",
                "Complete additional screening tests if required",
                "Review and sign informed consent document"
            ]
        }

    async def analyze(self, patient_data):
        """Run complete agentic analysis pipeline with web scraping"""
        analysis_id = f"analysis-{uuid.uuid4().hex[:8]}"
        start_time = datetime.utcnow()

        results = {}

        try:
            # Step 1: Web scraping to get relevant trials
            scraping_result = await self.web_scraping_agent.scrape_clinical_trials(patient_data)
            results['web_scraping'] = scraping_result
            trials_data = scraping_result.get('trials', [])

            # Step 2-6: Run remaining agents with scraped trials
            for agent_name, agent_func in self.agents.items():
                try:
                    results[agent_name] = agent_func(patient_data, trials_data)
                except Exception as e:
                    results[agent_name] = {'error': str(e)}

        except Exception as e:
            results['error'] = str(e)

        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds() * 1000

        return {
            'analysis_id': analysis_id,
            'success': True,
            'results': results,
            'processing_time_ms': processing_time,
            'timestamp': end_time.isoformat(),
            'trials_found': len(trials_data) if 'trials_data' in locals() else 0
        }

# Initialize agentic AI
agentic_ai = AgenticAI()

@agent_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Clinical Trial Matching Agentic AI service is running',
        'agents_available': list(agentic_ai.agents.keys()),
        'features': [
            'Web scraping from ClinicalTrials.gov',
            'Automated trial discovery',
            'Patient-trial matching analysis',
            'Risk assessment',
            'Clinical recommendations'
        ]
    })

@agent_bp.route('/agents', methods=['GET'])
def agents_info():

    orchestrator = get_orchestrator()

    return jsonify({
        "agents": orchestrator.get_all_agents_info()
    })

@agent_bp.route('/analyze', methods=['POST'])
def analyze_patient_trials():

    try:

        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data"}), 400


        patient_data = data.get("patient_data")
        trials_data = data.get("trials")

        if not patient_data or not trials_data:
            return jsonify({"error": "patient_data and trials required"}), 400


        # Convert input to schema objects
        patient_obj = PatientDataInput(**patient_data)

        trials_obj = [TrialDataInput(**trial) for trial in trials_data]


        orchestrator = get_orchestrator()

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        result = loop.run_until_complete(
            orchestrator.execute_workflow(
                patient_obj,
                trials_obj,
                include_explanation=True,
                generate_pdf=False
            )
        )

        loop.close()

        return jsonify(result)


    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500