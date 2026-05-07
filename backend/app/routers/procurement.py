from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.database.init_db import DEMO_USER
from app.database.session import get_db
from app.models.user import User
from app.schemas.procurement import ProcurementResult, ProcurementSummary, PurchaseRequestCreate
from app.services.procurement_service import (
    create_procurement_request,
    get_decision_by_request,
    list_procurements,
    reset_procurements_for_user,
)

router = APIRouter(prefix=f"{get_settings().api_prefix}/procurement", tags=["procurement"])


@router.post("/create", response_model=ProcurementResult)
def create_procurement(
    payload: PurchaseRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return create_procurement_request(db, current_user, payload)


@router.get("", response_model=list[ProcurementSummary])
def get_procurements(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_procurements(db, current_user.id)


@router.get("/decision/{request_id}", response_model=ProcurementResult)
def get_decision(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = get_decision_by_request(db, request_id, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Decision not found")
    return result


@router.post("/reset-demo")
def reset_demo_workspace(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.email != DEMO_USER["email"]:
        raise HTTPException(status_code=403, detail="Demo workspace reset is only available for the demo account")

    reset_count = reset_procurements_for_user(db, current_user.id)
    return {"status": "ok", "reset_requests": reset_count}
