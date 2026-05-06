from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.decision import DecisionRecord
from app.models.purchase_request import PurchaseRequest
from app.models.vendor import Vendor
from app.schemas.analytics import AnalyticsResponse, SpendSummary, VendorPerformanceItem


def get_analytics(db: Session, owner_id: int) -> AnalyticsResponse:
    requests = db.query(PurchaseRequest).filter(PurchaseRequest.owner_id == owner_id).all()
    total_requests = len(requests)
    total_budget = round(sum(item.budget for item in requests), 2)
    average_budget = round(total_budget / total_requests, 2) if total_requests else 0.0

    negotiated_savings = 0.0
    for request in requests:
        if request.selected_vendor:
            baseline = request.selected_vendor.base_price * request.quantity
            if request.decision_record:
                negotiated = request.decision_record.metadata_json["selected_vendor"]["negotiated_cost"]
                negotiated_savings += max(0.0, baseline - negotiated)

    performance_rows = (
        db.query(
            Vendor.name,
            func.count(DecisionRecord.id),
            func.avg(DecisionRecord.risk_score),
        )
        .join(DecisionRecord, DecisionRecord.selected_vendor_id == Vendor.id)
        .join(PurchaseRequest, PurchaseRequest.id == DecisionRecord.purchase_request_id)
        .filter(PurchaseRequest.owner_id == owner_id)
        .group_by(Vendor.name)
        .all()
    )
    vendor_performance = [
        VendorPerformanceItem(
            vendor_name=name,
            win_count=win_count,
            average_risk_score=round(avg_risk or 0.0, 4),
        )
        for name, win_count, avg_risk in performance_rows
    ]

    insights = [
        "Bundle onboarding and support into negotiations to improve total value without increasing baseline spend.",
        "Vendors with strong historical success rates consistently outperform pure low-cost options in final selections.",
        "Lower-risk suppliers produce better long-term outcomes when delivery certainty matters more than absolute lowest bid.",
    ]

    return AnalyticsResponse(
        spend_summary=SpendSummary(
            total_requests=total_requests,
            total_budget=total_budget,
            average_budget=average_budget,
            negotiated_savings=round(negotiated_savings, 2),
        ),
        vendor_performance=vendor_performance,
        cost_optimization_insights=insights,
    )
