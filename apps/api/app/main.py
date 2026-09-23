"""FastAPI application factory for PyPath."""

import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api import (
    courses,
    dashboard,
    exercises,
    health,
    lessons,
    mastery,
    practice,
    progress,
    projects,
)
from app.core.config import settings
from app.core.database import init_db
from app.services.content_loader import content_loader


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables created and load YAML curriculum
    await init_db()
    content_loader.reload()
    yield
    # Shutdown logic (if any)


app = FastAPI(
    title="PyPath API",
    description="Interactive Python Learning Platform Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def structured_logging_middleware(request: Request, call_next):
    """Enforces structured logging with requestId, route, status, and duration."""
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    start_time = time.time()

    response = await call_next(request)

    duration_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Request-ID"] = request_id

    # Avoid noisy health logs in normal output
    if not request.url.path.endswith("/health"):
        print(f'{{"requestId": "{request_id}", "method": "{request.method}", "path": "{request.url.path}", "status": {response.status_code}, "durationMs": {duration_ms}}}')

    return response


# Include Routers with /api/v1 prefix
app.include_router(health.router, prefix="/api/v1")
app.include_router(courses.router, prefix="/api/v1")
app.include_router(lessons.router, prefix="/api/v1")
app.include_router(exercises.router, prefix="/api/v1")
app.include_router(progress.router, prefix="/api/v1")
app.include_router(mastery.router, prefix="/api/v1")
app.include_router(practice.router, prefix="/api/v1")
app.include_router(projects.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "message": "Welcome to PyPath API",
        "docs": "/docs",
        "health": "/api/v1/health"
    }
