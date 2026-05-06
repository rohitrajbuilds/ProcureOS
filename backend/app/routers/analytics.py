from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics

router = APIRouter(prefix=f"{get_settings().api_prefix}/analytics", tags=["analytics"])


@router.get("", response_model=AnalyticsResponse)
def analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_analytics(db, current_user.id)
