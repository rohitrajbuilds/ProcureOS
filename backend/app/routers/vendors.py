from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.database.session import get_db
from app.schemas.vendor import VendorOut
from app.services.vendor_service import list_vendors

router = APIRouter(prefix=f"{get_settings().api_prefix}/vendors", tags=["vendors"])


@router.get("", response_model=list[VendorOut])
def get_vendors(_: object = Depends(get_current_user), db: Session = Depends(get_db)):
    return list_vendors(db)
