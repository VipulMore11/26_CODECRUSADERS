from flask import Blueprint, request, jsonify
import asyncio
import uuid
from datetime import datetime

from agents.extraction_agent import MedicalExtractionAgent
from agents.trial_parser_agent import TrialParserAgent
from agents.matching_agent import MatchingAgent
from agents.explanation_agent import ExplanationAgent
from models.schemas import AnonymizedPatientProfile, ClinicalTrial, TrialCriteria

agent_bp = Blueprint('agent', __name__, url_prefix='/api/agent')

# Initialize agents
extraction_agent = MedicalExtractionAgent()
trial_parser_agent = TrialParserAgent()
matching_agent = MatchingAgent()
explanation_agent = ExplanationAgent()


@agent_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Agent service is running'
    })


@agent_bp.route('/analyze', methods=['POST'])
def analyze():
    """
    Run full agentic pipeline:
    extraction -> anonymization -> trial parsing -> matching -> explanation
    """
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "No JSON data provided"}), 400

    patient_data = data.get("patient_data")
    trials_data = data.get("trials")

    if not patient_data or not trials_data:
        return jsonify({"success": False, "error": "patient_data and trials are required"}), 400

    try:
        result = asyncio.run(_run_pipeline(patient_data, trials_data))
        status_code = 200 if result.get("success") else 500
        return jsonify(result), status_code
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


async def _run_pipeline(patient_data: dict, trials_data: list) -> dict:
    # Step 1: Extract structured medical profile
    extraction_result = await extraction_agent.extract_medical_profile(patient_data)
    if not extraction_result.get("success"):
        return {"success": False, "error": f"Extraction failed: {extraction_result.get('error')}"}

    extracted_profile = extraction_result["extracted_profile"]

    # Step 2: Anonymize — generate UUID, build anonymized profile
    patient_id = f"PT-{uuid.uuid4()}"
    weight = extracted_profile.get("weight_kg")
    height = extracted_profile.get("height_cm")
    bmi = round(weight / (height / 100) ** 2, 2) if weight and height else None

    anonymized_profile = AnonymizedPatientProfile(
        patient_id=patient_id,
        age=extracted_profile.get("age", 0),
        gender=extracted_profile.get("gender", "Unknown"),
        weight_kg=weight,
        height_cm=height,
        bmi=bmi,
        conditions=[extracted_profile.get("disease", "Unknown")],
        lab_results=extracted_profile.get("lab_results", {}),
        medications=extracted_profile.get("medications", []),
        allergies=extracted_profile.get("allergies", []),
        anonymized_at=datetime.utcnow()
    )

    # Step 3: Parse trial criteria
    parsed_trials = []
    for trial in trials_data:
        parse_result = await trial_parser_agent.parse_trial_eligibility(
            trial.get("eligibility_text", ""),
            trial.get("trial_id", "UNKNOWN")
        )
        if parse_result.get("success"):
            criteria = TrialCriteria(**parse_result["criteria"])
            parsed_trials.append(ClinicalTrial(
                trial_id=trial.get("trial_id", "UNKNOWN"),
                trial_name=trial.get("trial_name", "Unknown Trial"),
                description=trial.get("description", ""),
                phase=trial.get("phase", "Phase 3"),
                status=trial.get("status", "recruiting"),
                criteria=criteria,
                location=trial.get("location", "Unknown"),
                drug_name=trial.get("drug_name", "Unknown"),
                drug_class=trial.get("drug_class", "Unknown"),
                potential_side_effects=trial.get("side_effects", []),
                enrollment_target=trial.get("enrollment_target", 100),
                duration_months=trial.get("duration_months", 12),
                sponsor=trial.get("sponsor", "Unknown")
            ))

    if not parsed_trials:
        return {"success": False, "error": "No valid trials could be parsed"}

    # Step 4: Match patient to trials
    matching_result = await matching_agent.match_patient_to_trials(anonymized_profile, parsed_trials)
    if not matching_result.get("success"):
        return {"success": False, "error": f"Matching failed: {matching_result.get('error')}"}

    # Step 5: Generate explanations
    explanation_result = await explanation_agent.generate_explanations(matching_result, patient_id)

    return {
        "success": True,
        "patient_id": patient_id,
        "anonymized_profile": anonymized_profile.model_dump(mode="json"),
        "matches": matching_result.get("matches", []),
        "explanations": explanation_result.get("explanations", []),
        "total_trials_evaluated": matching_result.get("total_trials_evaluated", 0)
    }