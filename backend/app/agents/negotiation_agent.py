from __future__ import annotations

from app.agents.base import AgentContext, BaseAgent
from app.agents.prompts import NEGOTIATION_PROMPT


class NegotiationAgent(BaseAgent):
    def __init__(self):
        super().__init__("NegotiationAgent")

    def run(self, payload: dict[str, object], context: AgentContext) -> dict[str, object]:
        rounds = []
        for rank, vendor in enumerate(payload["shortlisted_vendors"], start=1):
            projected_cost = vendor["projected_cost"]
            discount_factor = 0.02 * (4 - rank)
            negotiated_cost = round(projected_cost * (1 - discount_factor), 2)
            rounds.append(
                {
                    "vendor_id": vendor["vendor_id"],
                    "vendor_name": vendor["vendor_name"],
                    "rounds": [
                        {
                            "round": 1,
                            "message": f"Requested {round(discount_factor * 100 + 1, 1)}% concession and 30-day payment terms.",
                        },
                        {
                            "round": 2,
                            "message": "Vendor countered with bundled support and expedited delivery.",
                        },
                        {
                            "round": 3,
                            "message": f"Settled at total cost {negotiated_cost} with onboarding support included.",
                        },
                    ],
                    "negotiated_cost": negotiated_cost,
                    "value_add": "Priority support, onboarding, and quarterly business review",
                }
            )

        result = {
            "decision": "negotiation_completed",
            "reasoning": f"{NEGOTIATION_PROMPT.strip()} Completed a deterministic multi-turn negotiation for each shortlisted vendor.",
            "confidence": 0.84,
            "rounds": rounds,
        }
        self.remember({"input": payload, "output": result})
        context["negotiation"] = result
        return result
