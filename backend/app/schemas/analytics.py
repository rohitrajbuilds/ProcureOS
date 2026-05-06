from pydantic import BaseModel


class SpendSummary(BaseModel):
    total_requests: int
    total_budget: float
    average_budget: float
    negotiated_savings: float


class VendorPerformanceItem(BaseModel):
    vendor_name: str
    win_count: int
    average_risk_score: float


class AnalyticsResponse(BaseModel):
    spend_summary: SpendSummary
    vendor_performance: list[VendorPerformanceItem]
    cost_optimization_insights: list[str]
