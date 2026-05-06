from __future__ import annotations

from app.agents.base import AgentContext, BaseAgent
from app.agents.prompts import VENDOR_PROMPT


class VendorAgent(BaseAgent):
    def __init__(self):
        super().__init__("VendorAgent")

    def run(self, payload: dict[str, object], context: AgentContext) -> dict[str, object]:
        vendors = payload["vendors"]
        budget = float(payload["budget"])
        quantity = int(payload["quantity"])

        shortlisted = []
        for vendor in vendors:
            projected_cost = vendor.base_price * quantity
            budget_alignment = max(0.0, min(1.0, budget / projected_cost)) if projected_cost else 1.0
            score = round(
                (
                    (vendor.quality_score * 0.28)
                    + (vendor.reliability_score * 0.27)
                    + (vendor.sustainability_score * 0.1)
                    + (vendor.historical_success_rate * 0.2)
                    + (budget_alignment * 0.15)
                ),
                4,
            )
            shortlisted.append(
                {
                    "vendor_id": vendor.id,
                    "vendor_name": vendor.name,
                    "score": score,
                    "projected_cost": round(projected_cost, 2),
                    "summary": vendor.summary,
                }
            )

        shortlisted.sort(key=lambda item: item["score"], reverse=True)
        top_vendors = shortlisted[:3]
        reasoning = (
            f"{VENDOR_PROMPT.strip()} Selected top vendors using weighted quality, reliability, "
            "historical execution, sustainability, and budget alignment."
        )
        result = {
            "decision": "shortlist_generated",
            "reasoning": reasoning,
            "confidence": 0.89,
            "shortlisted_vendors": top_vendors,
        }
        self.remember({"input": payload, "output": result})
        context["vendor_analysis"] = result
        return result
