from typing import Dict, Any
from loguru import logger
import json
import base64
from datetime import datetime
from models.schemas import PatientDataInput


class IngestionAgent:
    """
    Agent responsible for ingesting and validating patient data from various sources.

    Handles JSON, PDF (base64), and image (base64) inputs and converts them
    into a standardized raw format for downstream agents.
    """

    def __init__(self):
        self.logger = logger
        self.agent_id = "ingestion_agent"
        self.role = "Data Ingestion and Validation Specialist"

    async def ingest_patient_data(self, patient_data: PatientDataInput) -> Dict[str, Any]:

        self.logger.info(
            f"[IngestionAgent] Starting ingestion for data type: {patient_data.data_type}"
        )

        try:
            if not patient_data.content:
                return {
                    "success": False,
                    "error": "No content provided in patient data"
                }

            data_type = patient_data.data_type.lower()

            if data_type == "json":
                raw_data = await self._process_json_data(patient_data.content)

            elif data_type == "pdf":
                raw_data = await self._process_pdf_data(patient_data.content)

            elif data_type == "image":
                raw_data = await self._process_image_data(patient_data.content)

            else:
                return {
                    "success": False,
                    "error": f"Unsupported data type: {patient_data.data_type}"
                }

            # Attach metadata if available
            if patient_data.metadata:
                raw_data["metadata"] = patient_data.metadata

            raw_data["source"] = patient_data.data_type
            raw_data["ingested_at"] = datetime.utcnow().isoformat()

            self.logger.info("[IngestionAgent] Ingestion successful")

            return {
                "success": True,
                "raw_data": raw_data
            }

        except Exception as e:

            self.logger.error(f"[IngestionAgent] Failed: {str(e)}")

            return {
                "success": False,
                "error": f"Ingestion failed: {str(e)}"
            }

    async def _process_json_data(self, content: str) -> Dict[str, Any]:

        try:

            data = json.loads(content)

            if not isinstance(data, dict):
                raise ValueError("JSON content must be a dictionary")

            return {
                "data_type": "json",
                "content": data,
                "validation_status": "valid"
            }

        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON content: {str(e)}")

    async def _process_pdf_data(self, content: str) -> Dict[str, Any]:

        try:

            pdf_bytes = base64.b64decode(content)

            return {
                "data_type": "pdf",
                "content": content,
                "file_size": len(pdf_bytes),
                "extracted_text": "PDF OCR extraction placeholder",
                "validation_status": "valid"
            }

        except Exception as e:
            raise ValueError(f"Invalid PDF content: {str(e)}")

    async def _process_image_data(self, content: str) -> Dict[str, Any]:

        try:

            image_bytes = base64.b64decode(content)

            return {
                "data_type": "image",
                "content": content,
                "file_size": len(image_bytes),
                "extracted_text": "Image OCR extraction placeholder",
                "validation_status": "valid"
            }

        except Exception as e:
            raise ValueError(f"Invalid image content: {str(e)}")

    def get_info(self) -> Dict[str, str]:

        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "supported_formats": "JSON, PDF (base64), Image (base64)",
            "processing_method": "Format validation and preprocessing"
        }


__all__ = ["IngestionAgent"]