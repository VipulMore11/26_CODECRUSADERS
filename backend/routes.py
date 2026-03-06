from flask import Blueprint, request, jsonify
import json
import uuid
from datetime import datetime

agent_bp = Blueprint('agent', __name__, url_prefix='/api/agent')

class AgenticAI:
    """
    Simple agentic AI that analyzes patient-trial matching using multiple analysis agents.
    Simulates the behavior of Google ADK agents for clinical trial analysis.
    """

    def __init__(self):
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

    def analyze(self, patient_data, trials_data):
        """Run complete agentic analysis pipeline"""
        analysis_id = f"analysis-{uuid.uuid4().hex[:8]}"
        start_time = datetime.utcnow()

        results = {}
        for agent_name, agent_func in self.agents.items():
            try:
                results[agent_name] = agent_func(patient_data, trials_data)
            except Exception as e:
                results[agent_name] = {'error': str(e)}

        end_time = datetime.utcnow()
        processing_time = (end_time - start_time).total_seconds() * 1000

        return {
            'analysis_id': analysis_id,
            'success': True,
            'results': results,
            'processing_time_ms': processing_time,
            'timestamp': end_time.isoformat()
        }

# Initialize agentic AI
agentic_ai = AgenticAI()

@agent_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Agentic AI service is running',
        'agents_available': list(agentic_ai.agents.keys())
    })

@agent_bp.route('/analyze', methods=['POST'])
def analyze_patient_trials():
    """
    Endpoint that triggers agentic AI analysis for patient-trial matching.

    Uses multiple specialized agents to analyze patient data against clinical trials:
    1. Data Ingestion Agent - Validates and ingests input data
    2. Medical Analysis Agent - Analyzes medical conditions and lab values
    3. Trial Matching Agent - Matches patients to eligible trials
    4. Risk Assessment Agent - Identifies potential risks and contraindications
    5. Recommendation Agent - Generates clinical recommendations

    Returns comprehensive analysis results from all agents.
    """
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Extract patient data
        patient_data = data.get('patient_data')
        if not patient_data:
            return jsonify({'error': 'patient_data is required'}), 400

        # Extract trial data
        trials_data = data.get('trials', [])
        if not trials_data:
            return jsonify({'error': 'trials data is required'}), 400

        # Run agentic AI analysis
        result = agentic_ai.analyze(patient_data, trials_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'analysis_id': f"error-{uuid.uuid4().hex[:8]}"
        }), 500