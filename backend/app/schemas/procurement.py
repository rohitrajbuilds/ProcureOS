from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict

from app.schemas.vendor import VendorOut


class PurchaseRequestCreate(BaseModel):
    title: str
    category: str
    budget: float
    quantity: int
    requirements: str


class NegotiationLogOut(BaseModel):
    id: int
    vendor_name: str
    round_number: int
    agent_name: str
    transcript: str
    outcome: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DecisionOut(BaseModel):
    id: int
    purchase_request_id: int
    decision: str
    reasoning: str
    confidence: float
    risk_score: float
    metadata_json: dict[str, Any]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProcurementResult(BaseModel):
    request_id: int
    status: str
    selected_vendor: VendorOut | None
    decision: DecisionOut
    negotiation_logs: list[NegotiationLogOut]


class ProcurementSummary(BaseModel):
    id: int
    title: str
    category: str
    budget: float
    quantity: int
    status: str
    created_at: datetime
    selected_vendor: VendorOut | None

    model_config = ConfigDict(from_attributes=True)
