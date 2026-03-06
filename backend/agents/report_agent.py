import uuid
from typing import Dict, Any
from datetime import datetime
from loguru import logger


class ReportAgent:
    """
    Agent responsible for assembling the final patient report.

    Combines:
    - patient profile
    - matching results
    - explanations
    """

    def __init__(self):

        self.logger = logger
        self.agent_id = "report_agent"
        self.role = "Report Generation Specialist"

    async def generate_report(
        self,
        patient_id: str,
        matching_results: Dict[str, Any],
        explanations: Dict[str, Any],
        patient_profile: Dict[str, Any] = None,
        include_pdf: bool = False,
    ) -> Dict[str, Any]:

        self.logger.info(f"[ReportAgent] Generating report for patient {patient_id}")

        try:

            report_id = f"report-{uuid.uuid4().hex[:8]}"

            report_json: Dict[str, Any] = {

                "report_id": report_id,

                "patient_id": patient_id,

                "generated_at": datetime.utcnow().isoformat(),

                "patient_profile": patient_profile,

                "matching_results": matching_results,

                "explanations": explanations.get("explanations", [])
            }

            pdf_data = None

            if include_pdf:

                pdf_data = f"PDF content placeholder for {report_id}"

                report_json["pdf"] = pdf_data

            self.logger.info(f"[ReportAgent] Report generated successfully: {report_id}")

            return {

                "success": True,

                "report_id": report_id,

                "report_json": report_json,

                "pdf_data": pdf_data,
            }

        except Exception as e:

            self.logger.error(f"[ReportAgent] Report generation failed: {str(e)}")

            return {

                "success": False,

                "error": str(e),
            }

    def get_info(self):

        return {

            "agent_id": self.agent_id,

            "role": self.role,

            "outputs": [

                "patient trial matching report",

                "clinical explanations",

                "trial eligibility summary"
            ]
        }


__all__ = ["ReportAgent"]