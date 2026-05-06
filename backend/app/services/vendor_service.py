from sqlalchemy.orm import Session

from app.models.vendor import Vendor


def list_vendors(db: Session) -> list[Vendor]:
    return db.query(Vendor).order_by(Vendor.category.asc(), Vendor.name.asc()).all()


def get_vendors_for_category(db: Session, category: str) -> list[Vendor]:
    matched = db.query(Vendor).filter(Vendor.category.ilike(category)).all()
    if matched:
        return matched
    return db.query(Vendor).all()
