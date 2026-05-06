from __future__ import annotations

import faiss
import numpy as np

from app.rag.embeddings import embed_text
from app.rag.knowledge_base import RAG_DOCUMENTS


class RAGStore:
    def __init__(self, dim: int = 64):
        self.dim = dim
        self.index = faiss.IndexFlatL2(dim)
        self.documents: list[dict[str, str]] = []
        self.ready = False

    def build_index(self) -> None:
        self.index.reset()
        self.documents = list(RAG_DOCUMENTS)
        embeddings = np.array([embed_text(item["text"], self.dim) for item in self.documents], dtype="float32")
        self.index.add(embeddings)
        self.ready = True

    def retrieve(self, query: str, top_k: int = 3) -> list[dict[str, object]]:
        if not self.ready or not self.documents:
            return []
        query_vector = np.array([embed_text(query, self.dim)], dtype="float32")
        distances, indices = self.index.search(query_vector, min(top_k, len(self.documents)))
        results = []
        for distance, idx in zip(distances[0], indices[0], strict=False):
            document = self.documents[int(idx)]
            results.append(
                {
                    "id": document["id"],
                    "source": document["source"],
                    "text": document["text"],
                    "distance": round(float(distance), 4),
                }
            )
        return results


rag_store = RAGStore()
