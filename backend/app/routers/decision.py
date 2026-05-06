from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.procurement import ProcurementResult
from app.services.procurement_service import get_decision_by_request

router = APIRouter(prefix=f"{get_settings().api_prefix}/decision", tags=["decision"])


@router.get("/{request_id}", response_model=ProcurementResult)
def get_decision_alias(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = get_decision_by_request(db, request_id, current_user.id)
    if not result:
        raise HTTPException(status_code=404, detail="Decision not found")
    return result
