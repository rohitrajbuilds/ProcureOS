from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class AgentContext(dict):
    pass


class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name
        self.state: dict[str, Any] = {"history": []}

    def remember(self, message: dict[str, Any]) -> None:
        self.state["history"].append(message)

    @abstractmethod
    def run(self, payload: dict[str, Any], context: AgentContext) -> dict[str, Any]:
        raise NotImplementedError
