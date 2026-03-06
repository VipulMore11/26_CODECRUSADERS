"""
Clinical Trial Matching Engine - Orchestrator

Coordinates all agents in the patient-trial matching workflow.
Implements the complete pipeline with error handling and logging.
"""

import asyncio
import time
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from loguru import logger

from agents.ingestion_agent import IngestionAgent
from agents.extraction_agent import MedicalExtractionAgent
from agents.anonymization_agent import AnonymizationAgent
from agents.trial_parser_agent import TrialParserAgent
from agents.matching_agent import MatchingAgent
from agents.explanation_agent import ExplanationAgent
from agents.report_agent import ReportAgent
from models.schemas import (
    PatientDataInput, TrialDataInput, WorkflowState, ProcessingStatus,
    AnonymizedPatientProfile, ClinicalTrial, TrialCriteria
)


class ClinicalTrialOrchestrator:
    """
    Main orchestrator coordinating all agents in the clinical trial matching workflow.
    
    Pipeline:
    1. Ingestion Agent → Accept patient data
    2. Extraction Agent → Convert to structured format
    3. Anonymization Agent → Remove PII and assign UUID
    4. Trial Parser Agent → Parse trial criteria
    5. Matching Agent → Match patient to trials
    6. Explanation Agent → Generate explanations
    7. Report Agent → Generate final report
    """
    
    def __init__(self):
        self.logger = logger
        self.orchestrator_id = f"orchestrator-{uuid.uuid4().hex[:8]}"
        
        # Initialize all agents
        self.ingestion_agent = IngestionAgent()
        self.extraction_agent = MedicalExtractionAgent()
        self.anonymization_agent = AnonymizationAgent()
        self.trial_parser_agent = TrialParserAgent()
        self.matching_agent = MatchingAgent()
        self.explanation_agent = ExplanationAgent()
        self.report_agent = ReportAgent()
        
        # Track active workflows
        self.workflows: Dict[str, WorkflowState] = {}
        
        self.logger.info(f"Orchestrator initialized: {self.orchestrator_id}")
    
    async def execute_workflow(
        self,
        patient_data: PatientDataInput,
        trials: List[TrialDataInput],
        include_explanation: bool = True,
        generate_pdf: bool = False
    ) -> Dict[str, Any]:
        """
        Execute complete patient-trial matching workflow.
        
        Args:
            patient_data: Patient data input
            trials: List of clinical trials
            include_explanation: Whether to generate explanations
            generate_pdf: Whether to generate PDF report
        
        Returns:
            Complete workflow results with all agent outputs
        """
        workflow_id = f"WF-{uuid.uuid4().hex[:8].upper()}"
        start_time = time.time()
        
        self.logger.info(f"Starting workflow {workflow_id}")
        
        try:
            # Initialize workflow state
            workflow_state = WorkflowState(
                workflow_id=workflow_id,
                status=ProcessingStatus.PROCESSING,
                step="initialization",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            self.workflows[workflow_id] = workflow_state
            
            # Step 1: Ingestion
            self.logger.info(f"{workflow_id}: Step 1 - Ingestion")
            ingestion_result = await self.ingestion_agent.ingest_patient_data(patient_data)
            
            if not ingestion_result.get("success"):
                self.logger.error(f"{workflow_id}: Ingestion failed")
                return self._create_error_response(workflow_id, ingestion_result.get("error"))
            
            workflow_state.raw_data = ingestion_result.get("raw_data")
            workflow_state.step = "extraction"
            
            # Step 2: Extraction
            self.logger.info(f"{workflow_id}: Step 2 - Extraction")
            extraction_result = await self.extraction_agent.extract_medical_profile(
                ingestion_result.get("raw_data")
            )
            
            if not extraction_result.get("success"):
                self.logger.error(f"{workflow_id}: Extraction failed")
                return self._create_error_response(workflow_id, extraction_result.get("error"))
            
            extracted_profile = extraction_result.get("extracted_profile")
            workflow_state.step = "anonymization"
            
            # Step 3: Anonymization
            self.logger.info(f"{workflow_id}: Step 3 - Anonymization")
            anonymization_result = await self.anonymization_agent.anonymize_patient_data(
                extraction_result
            )
            
            if not anonymization_result.get("success"):
                self.logger.error(f"{workflow_id}: Anonymization failed")
                return self._create_error_response(workflow_id, anonymization_result.get("error"))
            
            patient_id = anonymization_result.get("patient_id")
            anonymized_profile = anonymization_result.get("anonymized_profile")
            workflow_state.anonymized_data = anonymized_profile
            workflow_state.patient_id = patient_id
            workflow_state.step = "trial_parsing"
            
            # Step 4: Parse trials
            self.logger.info(f"{workflow_id}: Step 4 - Trial Parsing")
            parsed_trials = []
            for trial_data in trials:
                trial_parse_result = await self.trial_parser_agent.parse_trial_eligibility(
                    trial_data.eligibility_text,
                    trial_data.trial_id
                )
                
                if trial_parse_result.get("success"):
                    # Create ClinicalTrial object
                    criteria = TrialCriteria(**trial_parse_result.get("criteria", {}))
                    trial = ClinicalTrial(
                        trial_id=trial_data.trial_id,
                        trial_name=trial_data.trial_name,
                        description=f"Trial {trial_data.trial_id}",
                        phase="Phase 3",
                        status="recruiting",
                        criteria=criteria,
                        location=trial_data.location,
                        drug_name=trial_data.drug_name,
                        drug_class=trial_data.drug_class,
                        potential_side_effects=trial_data.side_effects,
                        enrollment_target=trial_data.enrollment_target,
                        duration_months=trial_data.duration_months,
                        sponsor="Research Organization"
                    )
                    parsed_trials.append(trial)
            
            if not parsed_trials:
                self.logger.error(f"{workflow_id}: No valid trials parsed")
                return self._create_error_response(workflow_id, "No valid trials to match against")
            
            workflow_state.step = "matching"
            
            # Step 5: Matching
            self.logger.info(f"{workflow_id}: Step 5 - Matching")
            
            # Convert anonymized dict back to AnonymizedPatientProfile object
            patient_profile_obj = AnonymizedPatientProfile(**anonymized_profile)
            
            matching_result = await self.matching_agent.match_patient_to_trials(
                patient_profile_obj,
                parsed_trials
            )
            
            if not matching_result.get("success"):
                self.logger.error(f"{workflow_id}: Matching failed")
                return self._create_error_response(workflow_id, matching_result.get("error"))
            
            matches = matching_result.get("matches", [])
            workflow_state.matches = matches
            workflow_state.step = "explanation"
            
            # Step 6: Explanation (optional)
            explanations = {"explanations": []}
            if include_explanation:
                self.logger.info(f"{workflow_id}: Step 6 - Explanation")
                explanations = await self.explanation_agent.generate_explanations(
                    matching_result,
                    patient_id
                )
                
                if not explanations.get("success"):
                    self.logger.warning(f"{workflow_id}: Explanation generation failed")
            
            workflow_state.step = "report_generation"
            
            # Step 7: Report Generation
            self.logger.info(f"{workflow_id}: Step 7 - Report Generation")
            report_result = await self.report_agent.generate_report(
                patient_id,
                matching_result,
                explanations,
                patient_profile=extracted_profile,
                include_pdf=generate_pdf
            )
            
            if not report_result.get("success"):
                self.logger.error(f"{workflow_id}: Report generation failed")
                return self._create_error_response(workflow_id, report_result.get("error"))
            
            # Finalize workflow
            workflow_state.status = ProcessingStatus.COMPLETED
            workflow_state.step = "completed"
            workflow_state.updated_at = datetime.utcnow()
            
            processing_time_ms = (time.time() - start_time) * 1000
            
            self.logger.info(f"{workflow_id}: Workflow completed in {processing_time_ms:.2f}ms")
            
            return {
                "success": True,
                "workflow_id": workflow_id,
                "patient_id": patient_id,
                "matches": matches,
                "explanations": explanations.get("explanations", []),
                "report": report_result.get("report_json"),
                "report_id": report_result.get("report_id"),
                "processing_time_ms": processing_time_ms,
                "status": ProcessingStatus.COMPLETED
            }
        
        except Exception as e:
            self.logger.error(f"{workflow_id}: Workflow failed: {str(e)}")
            return self._create_error_response(workflow_id, str(e))
    
    def _create_error_response(self, workflow_id: str, error: str) -> Dict[str, Any]:
        """Create error response"""
        if workflow_id in self.workflows:
            self.workflows[workflow_id].status = ProcessingStatus.FAILED
            self.workflows[workflow_id].errors.append(error)
        
        return {
            "success": False,
            "workflow_id": workflow_id,
            "error": error,
            "status": ProcessingStatus.FAILED
        }
    
    def get_workflow_status(self, workflow_id: str) -> Optional[Dict[str, Any]]:
        """Get status of a workflow"""
        if workflow_id in self.workflows:
            state = self.workflows[workflow_id]
            return {
                "workflow_id": workflow_id,
                "status": state.status,
                "step": state.step,
                "patient_id": state.patient_id,
                "errors": state.errors,
                "created_at": state.created_at,
                "updated_at": state.updated_at
            }
        return None
    
    def get_all_agents_info(self) -> Dict[str, Dict[str, Any]]:
        """Get information about all agents"""
        return {
            "ingestion": self.ingestion_agent.get_info(),
            "extraction": self.extraction_agent.get_info(),
            "anonymization": self.anonymization_agent.get_info(),
            "trial_parser": self.trial_parser_agent.get_info(),
            "matching": self.matching_agent.get_info(),
            "explanation": self.explanation_agent.get_info(),
            "report": self.report_agent.get_info(),
        }


# Global orchestrator instance
_orchestrator: Optional[ClinicalTrialOrchestrator] = None


def get_orchestrator() -> ClinicalTrialOrchestrator:
    """Get or create global orchestrator instance"""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = ClinicalTrialOrchestrator()
    return _orchestrator


__all__ = ["ClinicalTrialOrchestrator", "get_orchestrator"]
