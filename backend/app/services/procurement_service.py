from sqlalchemy.orm import Session, joinedload

from app.agents.orchestrator import ProcurementOrchestrator
from app.models.decision import DecisionRecord
from app.models.negotiation import NegotiationLog
from app.models.purchase_request import PurchaseRequest
from app.models.user import User
from app.models.vendor import Vendor
from app.schemas.procurement import ProcurementResult, PurchaseRequestCreate
from app.services.vendor_service import get_vendors_for_category


def _serialize_result(request: PurchaseRequest) -> ProcurementResult:
    return ProcurementResult(
        request_id=request.id,
        status=request.status,
        selected_vendor=request.selected_vendor,
        decision=request.decision_record,
        negotiation_logs=request.negotiation_logs,
    )


def create_procurement_request(db: Session, current_user: User, payload: PurchaseRequestCreate) -> ProcurementResult:
    purchase_request = PurchaseRequest(
        title=payload.title,
        category=payload.category,
        budget=payload.budget,
        quantity=payload.quantity,
        requirements=payload.requirements,
        owner_id=current_user.id,
        status="processing",
    )
    db.add(purchase_request)
    db.commit()
    db.refresh(purchase_request)

    candidate_vendors = get_vendors_for_category(db, payload.category)
    orchestrator = ProcurementOrchestrator()
    workflow = orchestrator.run(payload.model_dump(), candidate_vendors)

    selected_vendor_id = workflow["decision_output"]["selected_vendor"]["vendor_id"]
    selected_vendor = db.query(Vendor).filter(Vendor.id == selected_vendor_id).first()
    purchase_request.selected_vendor_id = selected_vendor_id
    purchase_request.status = "completed"

    for vendor_round in workflow["negotiation_output"]["rounds"]:
        for turn in vendor_round["rounds"]:
            db.add(
                NegotiationLog(
                    purchase_request_id=purchase_request.id,
                    vendor_name=vendor_round["vendor_name"],
                    round_number=turn["round"],
                    agent_name="NegotiationAgent",
                    transcript=turn["message"],
                    outcome=f"Negotiated cost {vendor_round['negotiated_cost']}",
                )
            )

    risk_score = next(
        item["risk_score"]
        for item in workflow["risk_output"]["vendor_risk"]
        if item["vendor_id"] == selected_vendor_id
    )
    decision_record = DecisionRecord(
        purchase_request_id=purchase_request.id,
        decision=workflow["decision_output"]["decision"],
        reasoning=workflow["decision_output"]["reasoning"],
        confidence=workflow["decision_output"]["confidence"],
        selected_vendor_id=selected_vendor_id,
        risk_score=risk_score,
        metadata_json={
            "selected_vendor": workflow["decision_output"]["selected_vendor"],
            "alternatives": workflow["decision_output"]["alternatives"],
            "retrieved_context": workflow["retrieved_context"],
            "agent_state": workflow["agent_state"],
        },
    )
    db.add(decision_record)
    db.commit()

    request = (
        db.query(PurchaseRequest)
        .options(
            joinedload(PurchaseRequest.selected_vendor),
            joinedload(PurchaseRequest.negotiation_logs),
            joinedload(PurchaseRequest.decision_record),
        )
        .filter(PurchaseRequest.id == purchase_request.id)
        .first()
    )
    return _serialize_result(request)


def list_procurements(db: Session, owner_id: int) -> list[PurchaseRequest]:
    return (
        db.query(PurchaseRequest)
        .options(joinedload(PurchaseRequest.selected_vendor))
        .filter(PurchaseRequest.owner_id == owner_id)
        .order_by(PurchaseRequest.created_at.desc())
        .all()
    )


def get_decision_by_request(db: Session, request_id: int, owner_id: int) -> ProcurementResult | None:
    request = (
        db.query(PurchaseRequest)
        .options(
            joinedload(PurchaseRequest.selected_vendor),
            joinedload(PurchaseRequest.negotiation_logs),
            joinedload(PurchaseRequest.decision_record),
        )
        .filter(PurchaseRequest.id == request_id, PurchaseRequest.owner_id == owner_id)
        .first()
    )
    if not request or not request.decision_record:
        return None
    return _serialize_result(request)
