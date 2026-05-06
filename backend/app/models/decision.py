from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, JSON, Text, func
from sqlalchemy.orm import relationship

from app.database.session import Base


class DecisionRecord(Base):
    __tablename__ = "decision_records"

    id = Column(Integer, primary_key=True, index=True)
    purchase_request_id = Column(Integer, ForeignKey("purchase_requests.id"), unique=True, nullable=False)
    decision = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)
    selected_vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    risk_score = Column(Float, nullable=False)
    metadata_json = Column(JSON, nullable=False, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    purchase_request = relationship("PurchaseRequest", back_populates="decision_record")
