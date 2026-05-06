from __future__ import annotations

from app.agents.base import AgentContext
from app.agents.decision_agent import DecisionAgent
from app.agents.negotiation_agent import NegotiationAgent
from app.agents.risk_agent import RiskAgent
from app.agents.vendor_agent import VendorAgent
from app.models.vendor import Vendor
from app.rag.store import rag_store


class ProcurementOrchestrator:
    def __init__(self):
        self.vendor_agent = VendorAgent()
        self.negotiation_agent = NegotiationAgent()
        self.risk_agent = RiskAgent()
        self.decision_agent = DecisionAgent()

    def run(self, request_payload: dict[str, object], vendors: list[Vendor]) -> dict[str, object]:
        context = AgentContext()
        vendor_output = self.vendor_agent.run(
            {
                "vendors": vendors,
                "budget": request_payload["budget"],
                "quantity": request_payload["quantity"],
            },
            context,
        )

        negotiation_output = self.negotiation_agent.run(
            {"shortlisted_vendors": vendor_output["shortlisted_vendors"]},
            context,
        )

        negotiated = {
            item["vendor_id"]: item
            for item in negotiation_output["rounds"]
        }
        vendor_map = {vendor.id: vendor for vendor in vendors}
        risk_output = self.risk_agent.run(
            {"vendor_map": vendor_map, "negotiated": negotiated},
            context,
        )

        query = f"{request_payload['category']} {request_payload['requirements']}"
        retrieved_context = rag_store.retrieve(query, top_k=4)
        decision_output = self.decision_agent.run(
            {
                "risk_summary": risk_output["vendor_risk"],
                "shortlist_map": {item["vendor_id"]: item for item in vendor_output["shortlisted_vendors"]},
                "budget": request_payload["budget"],
                "retrieved_context": retrieved_context,
            },
            context,
        )

        return {
            "vendor_output": vendor_output,
            "negotiation_output": negotiation_output,
            "risk_output": risk_output,
            "decision_output": decision_output,
            "retrieved_context": retrieved_context,
            "agent_state": {
                "vendor": self.vendor_agent.state,
                "negotiation": self.negotiation_agent.state,
                "risk": self.risk_agent.state,
                "decision": self.decision_agent.state,
            },
        }
