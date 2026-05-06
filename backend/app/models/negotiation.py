from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database.session import Base


class NegotiationLog(Base):
    __tablename__ = "negotiation_logs"

    id = Column(Integer, primary_key=True, index=True)
    purchase_request_id = Column(Integer, ForeignKey("purchase_requests.id"), nullable=False, index=True)
    vendor_name = Column(String(120), nullable=False)
    round_number = Column(Integer, nullable=False)
    agent_name = Column(String(80), nullable=False)
    transcript = Column(Text, nullable=False)
    outcome = Column(String(120), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    purchase_request = relationship("PurchaseRequest", back_populates="negotiation_logs")
