"""Health and readiness check endpoints."""

from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter(tags=["Health"])


@router.get("/health", status_code=status.HTTP_200_OK)
async def check_health(db: AsyncSession = Depends(get_db)):
    """System health check verifying API readiness and database pool connectivity."""
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "pypath-api",
        "database": db_status
    }
