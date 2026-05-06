from __future__ import annotations

from app.agents.base import AgentContext, BaseAgent
from app.agents.prompts import RISK_PROMPT


class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__("RiskAgent")

    def run(self, payload: dict[str, object], context: AgentContext) -> dict[str, object]:
        vendor_map = payload["vendor_map"]
        risk_summary = []
        for vendor_id, negotiation in payload["negotiated"].items():
            vendor = vendor_map[vendor_id]
            risk_flag_penalty = 0.08 if vendor.risk_flags else 0.0
            base_risk = 1.0 - ((vendor.reliability_score * 0.5) + (vendor.historical_success_rate * 0.5))
            geo_penalty = 0.04 if vendor.region in {"Cross-border", "APAC"} else 0.02
            score = round(min(1.0, base_risk + geo_penalty + risk_flag_penalty), 4)
            risk_summary.append(
                {
                    "vendor_id": vendor.id,
                    "vendor_name": vendor.name,
                    "risk_score": score,
                    "notes": vendor.risk_flags or "No material red flags in mock dataset.",
                    "negotiated_cost": negotiation["negotiated_cost"],
                }
            )

        risk_summary.sort(key=lambda item: item["risk_score"])
        result = {
            "decision": "risk_profile_completed",
            "reasoning": f"{RISK_PROMPT.strip()} Assessed delivery reliability, historical performance, geography, and declared flags.",
            "confidence": 0.86,
            "vendor_risk": risk_summary,
        }
        self.remember({"input": payload, "output": result})
        context["risk"] = result
        return result
