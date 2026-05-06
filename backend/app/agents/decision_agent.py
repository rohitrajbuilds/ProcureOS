from __future__ import annotations

from app.agents.base import AgentContext, BaseAgent
from app.agents.prompts import DECISION_PROMPT


class DecisionAgent(BaseAgent):
    def __init__(self):
        super().__init__("DecisionAgent")

    def run(self, payload: dict[str, object], context: AgentContext) -> dict[str, object]:
        candidates = []
        for item in payload["risk_summary"]:
            shortlist_item = payload["shortlist_map"][item["vendor_id"]]
            score = (
                (shortlist_item["score"] * 0.55)
                + ((1 - item["risk_score"]) * 0.3)
                + (min(1.0, payload["budget"] / max(item["negotiated_cost"], 1)) * 0.15)
            )
            candidates.append(
                {
                    "vendor_id": item["vendor_id"],
                    "vendor_name": item["vendor_name"],
                    "final_score": round(score, 4),
                    "risk_score": item["risk_score"],
                    "negotiated_cost": item["negotiated_cost"],
                }
            )

        candidates.sort(key=lambda item: item["final_score"], reverse=True)
        winner = candidates[0]
        retrieved_context = payload.get("retrieved_context", [])
        reasoning = (
            f"{DECISION_PROMPT.strip()} Chose {winner['vendor_name']} using vendor fit, negotiated cost, risk, and RAG context. "
            f"Retrieved {len(retrieved_context)} supporting knowledge snippets."
        )
        result = {
            "decision": "vendor_selected",
            "reasoning": reasoning,
            "confidence": 0.91,
            "selected_vendor": winner,
            "alternatives": candidates[1:],
        }
        self.remember({"input": payload, "output": result})
        context["decision"] = result
        return result
