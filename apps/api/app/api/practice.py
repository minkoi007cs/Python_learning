"""Practice mode API router."""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.course import ExerciseSchema
from app.services.content_loader import content_loader
from app.services.mastery_service import mastery_service

router = APIRouter(prefix="/practice", tags=["Practice"])


@router.get("", response_model=List[ExerciseSchema])
async def get_practice_exercises(
    topic: Optional[str] = Query(None, description="Topic filter (e.g. variables, loops, strings)"),
    difficulty: Optional[str] = Query(None, description="Difficulty filter (EASY, MEDIUM, HARD)"),
    needs_review: bool = Query(False, description="Filter exercises for concepts needing review"),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve filtered exercises for practice mode drills."""
    all_exercises = content_loader.get_all_exercises()

    # Determine concepts needing review if requested
    review_concept_ids = set()
    if needs_review:
        mastery_items = await mastery_service.get_user_mastery(db, user_id)
        for m in mastery_items:
            if m.needs_review:
                review_concept_ids.add(m.concept_id)

    filtered = []
    for ex in all_exercises:
        if topic:
            topic_lower = topic.lower()
            matches_topic = any(topic_lower in cid.lower() for cid in ex.concept_ids) or (topic_lower in ex.title.lower())
            if not matches_topic:
                continue

        if difficulty and ex.difficulty.upper() != difficulty.upper():
            continue

        if needs_review:
            matches_review = any(cid in review_concept_ids for cid in ex.concept_ids)
            if not matches_review:
                continue

        filtered.append(ex)

    return filtered
