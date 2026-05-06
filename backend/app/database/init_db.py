from sqlalchemy.orm import Session

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models.vendor import Vendor
from app.seed.vendor_seed import VENDOR_FIXTURES


def seed_vendors(db: Session) -> None:
    existing_count = db.query(Vendor).count()
    if existing_count > 0:
        return

    for item in VENDOR_FIXTURES:
        vendor = Vendor(**item)
        db.add(vendor)
    db.commit()


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_vendors(db)
    finally:
        db.close()
