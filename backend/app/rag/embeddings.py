import hashlib

import numpy as np


def embed_text(text: str, dim: int = 64) -> np.ndarray:
    vector = np.zeros(dim, dtype="float32")
    tokens = text.lower().split()
    if not tokens:
        return vector

    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        for idx in range(dim):
            vector[idx] += digest[idx % len(digest)] / 255.0

    norm = np.linalg.norm(vector)
    if norm == 0:
        return vector
    return vector / norm
