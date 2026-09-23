"""Dashboard API router."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve complete composite dashboard view for user."""
    return await dashboard_service.get_dashboard_data(db, user_id)
