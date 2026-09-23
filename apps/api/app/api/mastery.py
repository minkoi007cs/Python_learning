"""Concept mastery API router."""

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.progress import ConceptMasteryItem
from app.services.mastery_service import mastery_service

router = APIRouter(prefix="/mastery", tags=["Mastery"])


@router.get("", response_model=List[ConceptMasteryItem])
async def get_mastery(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve concept mastery scores and review status for authenticated user."""
    return await mastery_service.get_user_mastery(db, user_id)
