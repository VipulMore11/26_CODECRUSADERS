from typing import Dict, Any, List
from loguru import logger
from models.schemas import PatientTrialExplanation, ExplanationDetail

class ExplanationAgent:
    """
    Agent responsible for generating transparent, explainable reasoning.
    
    Provides human-readable explanations for:
    - Why a patient matches/doesn't match a trial
    - Which criteria were met or unmet
    - Confidence levels in recommendations
    """
    
    def __init__(self):
        self.logger = logger
        self.agent_id = "explanation_agent"
        self.role = "Explainability & Reasoning Specialist"
    
    async def generate_explanations(self, matching_results: Dict[str, Any], patient_id: str) -> Dict[str, Any]:
        """
        Generate explanations for patient-trial matches.
        
        Args:
            matching_results: Output from matching agent
            patient_id: Patient identifier
        
        Returns:
            Detailed explanations
        """
        self.logger.info(f"Generating explanations for {patient_id}")
        
        try:
            matches = matching_results.get("matches", [])
            explanations = []
            
            for match in matches:
                explanation = self._create_explanation(match, patient_id)
                explanations.append(explanation)
            
            self.logger.info(f"Generated {len(explanations)} explanations")
            
            return {
                "success": True,
                "patient_id": patient_id,
                "explanations": explanations
            }
        
        except Exception as e:
            self.logger.error(f"Explanation generation failed: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _create_explanation(self, match: Dict[str, Any], patient_id: str) -> Dict[str, Any]:
        """Create detailed explanation for a single trial match"""
        
        score = match.get("eligibility_score", 0)
        is_eligible = match.get("is_eligible", False)
        matched_criteria = match.get("matched_criteria", [])
        unmatched_criteria = match.get("unmatched_criteria", [])
        details = match.get("details", [])
        risk_factors = match.get("risk_factors", [])
        
        # Create summary
        trial_name = match.get("trial_name","Unknown Trial")
        if is_eligible:
            summary = f"Patient is ELIGIBLE for {trial_name} with {int(score*100)}% confidence."
        else:
            summary = f"Patient is NOT ELIGIBLE for {trial_name}. Eligibility: {int(score*100)}%."
        
        # Create detailed explanations
        detailed_explanations = []
        for detail in details:
            exp_detail = ExplanationDetail(
                criterion=detail.get("criterion", "Unknown"),
                status="matched" if detail.get("matched") else "not_matched",
                reasoning=detail.get("explanation", ""),
                confidence=detail.get("confidence_score", 0)
            )
            detailed_explanations.append(exp_detail)
        
        # Create overall assessment
        if is_eligible:
            assessment = self._create_positive_assessment(matched_criteria, unmatched_criteria, risk_factors)
        else:
            assessment = self._create_negative_assessment(matched_criteria, unmatched_criteria)
        
        # Create next steps
        next_steps = self._create_next_steps(is_eligible, score, risk_factors)
        
        result = PatientTrialExplanation(
            patient_id=patient_id,
            trial_id=match["trial_id"],
            trial_name=trial_name,
            summary=summary,
            detailed_explanations=detailed_explanations,
            overall_assessment=assessment,
            next_steps=next_steps
        )

        return result.model_dump() if hasattr(result,"model_dump") else result.dict()
    
    @staticmethod
    def _create_positive_assessment(matched: List[str], unmatched: List[str], risk_factors: List[str]) -> str:
        """Create assessment for eligible patient"""
        msg = f"✓ Patient qualifies based on matched criteria: {', '.join(matched)}."
        
        if unmatched:
            msg += f"\n⚠ Note: Unmatched criteria ({', '.join(unmatched)}) did not prevent eligibility."
        
        if risk_factors:
            msg += f"\n⚠ Risk factors identified: {'; '.join(risk_factors)}"
            msg += " These should be monitored during the trial."
        
        return msg
    
    @staticmethod
    def _create_negative_assessment(matched: List[str], unmatched: List[str]) -> str:
        """Create assessment for ineligible patient"""
        msg = f"✗ Patient does not meet trial requirements.\n"
        msg += f"Matched criteria: {', '.join(matched) if matched else 'None'}\n"
        msg += f"Unmet criteria: {', '.join(unmatched)}"
        return msg
    
    @staticmethod
    def _create_next_steps(is_eligible: bool, score: float, risk_factors: List[str]) -> str:
        """Create actionable next steps"""
        if is_eligible:
            if score >= 0.9:
                next_steps = "1. Proceed directly to trial enrollment\n"
            elif score >= 0.7:
                next_steps = "1. Schedule screening visit\n2. Conduct final medical review\n"
            else:
                next_steps = "1. Schedule detailed assessment\n2. Discuss trial participation with clinician\n"
            
            next_steps += "3. Review informed consent form\n"
            
            if risk_factors:
                next_steps += "4. Discuss identified risk factors with trial coordinator\n"
        else:
            next_steps = "1. Review alternative trials with matching eligibility\n"
            next_steps += "2. Consult with clinician about eligibility barriers\n"
            next_steps += "3. Consider retesting in 3-6 months if borderline criteria\n"
        
        return next_steps
    
    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "outputs": ["human-readable explanations", "risk assessments", "actionable next steps"]
        }


# Export
__all__ = ["ExplanationAgent"]
