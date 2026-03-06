from typing import Dict, Any, Optional
from loguru import logger
import json
import base64
import asyncio
from models.schemas import PatientDataInput

class IngestionAgent:
    """
    Agent responsible for ingesting and validating patient data from various sources.

    Handles different data types (PDF, image, JSON) and converts them into a standardized
    format for downstream processing.
    """

    def __init__(self):
        self.logger = logger
        self.agent_id = "ingestion_agent"
        self.role = "Data Ingestion and Validation Specialist"

    async def ingest_patient_data(self, patient_data: PatientDataInput) -> Dict[str, Any]:
        """
        Ingest and validate patient data from various sources.

        Args:
            patient_data: PatientDataInput object containing data_type, content, and metadata

        Returns:
            Dict with success status, raw_data, and error if applicable
        """
        self.logger.info(f"Starting data ingestion: {patient_data.data_type}")

        try:
            # Validate input
            if not patient_data.content:
                return {
                    "success": False,
                    "error": "No content provided in patient data"
                }

            # Process based on data type
            if patient_data.data_type.lower() == "json":
                raw_data = await self._process_json_data(patient_data.content)
            elif patient_data.data_type.lower() == "pdf":
                raw_data = await self._process_pdf_data(patient_data.content)
            elif patient_data.data_type.lower() == "image":
                raw_data = await self._process_image_data(patient_data.content)
            else:
                return {
                    "success": False,
                    "error": f"Unsupported data type: {patient_data.data_type}"
                }

            # Add metadata if provided
            if patient_data.metadata:
                raw_data["metadata"] = patient_data.metadata

            # Add source information
            raw_data["source"] = patient_data.data_type
            raw_data["ingested_at"] = "2026-03-06T13:16:13.795887"  # Current timestamp

            self.logger.info(f"Data ingestion successful: {patient_data.data_type}")

            return {
                "success": True,
                "raw_data": raw_data
            }

        except Exception as e:
            self.logger.error(f"Data ingestion failed: {str(e)}")
            return {
                "success": False,
                "error": f"Ingestion failed: {str(e)}"
            }

    async def _process_json_data(self, content: str) -> Dict[str, Any]:
        """
        Process JSON data content.

        Args:
            content: JSON string content

        Returns:
            Processed data dictionary
        """
        try:
            # Parse JSON content
            data = json.loads(content)

            # Validate basic structure
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
        """
        Process PDF data content (base64 encoded).

        Args:
            content: Base64 encoded PDF content

        Returns:
            Processed data dictionary
        """
        try:
            # Decode base64 content
            pdf_bytes = base64.b64decode(content)

            # For now, return basic info (would integrate with OCR/PDF parsing)
            return {
                "data_type": "pdf",
                "content": content,  # Keep original base64
                "file_size": len(pdf_bytes),
                "extracted_text": "PDF content would be extracted here via OCR/Tesseract",
                "validation_status": "valid"
            }

        except Exception as e:
            raise ValueError(f"Invalid PDF content: {str(e)}")

    async def _process_image_data(self, content: str) -> Dict[str, Any]:
        """
        Process image data content (base64 encoded).

        Args:
            content: Base64 encoded image content

        Returns:
            Processed data dictionary
        """
        try:
            # Decode base64 content
            image_bytes = base64.b64decode(content)

            # For now, return basic info (would integrate with OCR)
            return {
                "data_type": "image",
                "content": content,  # Keep original base64
                "file_size": len(image_bytes),
                "extracted_text": "Image content would be extracted here via OCR/Tesseract",
                "validation_status": "valid"
            }

        except Exception as e:
            raise ValueError(f"Invalid image content: {str(e)}")

    def get_info(self) -> Dict[str, str]:
        """Get agent information"""
        return {
            "agent_id": self.agent_id,
            "role": self.role,
            "supported_formats": "JSON, PDF (base64), Image (base64)",
            "processing_method": "Format-specific validation and preprocessing"
        }


# Export
__all__ = ["IngestionAgent"]