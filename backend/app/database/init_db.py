from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.models.user import User
from app.models.vendor import Vendor
from app.seed.vendor_seed import VENDOR_FIXTURES

DEMO_USER = {
    "full_name": "ProcureOS Demo Admin",
    "email": "demo@procureos.ai",
    "password": "ProcureOSDemo123",
}


def seed_vendors(db: Session) -> None:
    existing_count = db.query(Vendor).count()
    if existing_count > 0:
        return

    for item in VENDOR_FIXTURES:
        vendor = Vendor(**item)
        db.add(vendor)
    db.commit()


def seed_demo_user(db: Session) -> None:
    existing_user = db.query(User).filter(User.email == DEMO_USER["email"]).first()
    if existing_user:
        return

    demo_user = User(
        full_name=DEMO_USER["full_name"],
        email=DEMO_USER["email"],
        hashed_password=get_password_hash(DEMO_USER["password"]),
    )
    db.add(demo_user)
    db.commit()


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_vendors(db)
        seed_demo_user(db)
    finally:
        db.close()
