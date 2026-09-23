"""Lesson retrieval API router."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user_id
from app.schemas.course import LessonDetailSchema
from app.services.content_loader import content_loader

router = APIRouter(prefix="/courses/{course_slug}/lessons", tags=["Lessons"])


@router.get("/{lesson_slug}", response_model=LessonDetailSchema)
async def get_lesson(
    course_slug: str,
    lesson_slug: str,
    user_id: str = Depends(get_current_user_id)
):
    """Retrieve full lesson content, markdown text, code snippets, and coding exercise."""
    lesson = content_loader.get_lesson(course_slug, lesson_slug)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson '{lesson_slug}' in course '{course_slug}' not found"
        )
    return lesson
