"""Exercise retrieval and submission API router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.schemas.course import ExerciseSchema
from app.schemas.exercise import ExerciseAttemptCreate, ExerciseSubmissionResult
from app.services.content_loader import content_loader
from app.services.progress_service import progress_service

router = APIRouter(prefix="/exercises", tags=["Exercises"])


@router.get("/{exercise_id}", response_model=ExerciseSchema)
async def get_exercise(
    exercise_id: str,
    user_id: str = Depends(get_current_user_id)
):
    """Retrieve exercise details including instructions, starter code, and visible tests."""
    exercise = content_loader.get_exercise(exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise '{exercise_id}' not found"
        )
    return exercise


@router.post("/{exercise_id}/submit", response_model=ExerciseSubmissionResult)
async def submit_exercise(
    exercise_id: str,
    attempt_data: ExerciseAttemptCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Record an exercise submission attempt, update progress, streaks, and XP."""
    exercise = content_loader.get_exercise(exercise_id)
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise '{exercise_id}' not found"
        )

    result = await progress_service.record_attempt(db, user_id, exercise_id, attempt_data)
    return result


@router.get("", response_model=List[ExerciseSchema])
async def list_all_exercises(
    user_id: str = Depends(get_current_user_id)
):
    """List all available exercises for practice mode."""
    return content_loader.get_all_exercises()
