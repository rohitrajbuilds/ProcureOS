from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.session import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False, index=True)
    category = Column(String(80), nullable=False, index=True)
    region = Column(String(80), nullable=False)
    base_price = Column(Float, nullable=False)
    quality_score = Column(Float, nullable=False)
    reliability_score = Column(Float, nullable=False)
    sustainability_score = Column(Float, nullable=False)
    risk_flags = Column(String(255), default="")
    historical_success_rate = Column(Float, nullable=False)
    summary = Column(Text, nullable=False)

    purchase_requests = relationship("PurchaseRequest", back_populates="selected_vendor")
