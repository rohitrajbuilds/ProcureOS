from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database.session import Base


class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(160), nullable=False)
    category = Column(String(80), nullable=False, index=True)
    budget = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    requirements = Column(Text, nullable=False)
    status = Column(String(40), default="created", nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    selected_vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="purchase_requests")
    selected_vendor = relationship("Vendor", back_populates="purchase_requests")
    negotiation_logs = relationship("NegotiationLog", back_populates="purchase_request", cascade="all, delete-orphan")
    decision_record = relationship("DecisionRecord", back_populates="purchase_request", uselist=False, cascade="all, delete-orphan")
