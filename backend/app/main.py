from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.database.init_db import initialize_database
from app.rag.store import rag_store
from app.routers import analytics, auth, decision, procurement, vendors

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    rag_store.build_index()
    yield


app = FastAPI(
    title="ProcureOS API",
    version="1.0.0",
    description="AI Autonomous Procurement SaaS backend",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(vendors.router)
app.include_router(procurement.router)
app.include_router(decision.router)
app.include_router(analytics.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
