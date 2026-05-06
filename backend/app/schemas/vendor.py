from pydantic import BaseModel, ConfigDict


class VendorOut(BaseModel):
    id: int
    name: str
    category: str
    region: str
    base_price: float
    quality_score: float
    reliability_score: float
    sustainability_score: float
    risk_flags: str
    historical_success_rate: float
    summary: str

    model_config = ConfigDict(from_attributes=True)
