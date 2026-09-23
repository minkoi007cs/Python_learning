"""Courses and modules API router."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.models.progress import UserCourseProgress
from app.schemas.course import CourseDetailSchema, CourseSummarySchema
from app.services.content_loader import content_loader

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=List[CourseSummarySchema])
async def list_courses(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve all available Python courses with user completion percentages."""
    summaries = content_loader.list_courses()

    # Enrich with user progress
    for s in summaries:
        stmt = select(UserCourseProgress).where(
            UserCourseProgress.user_id == user_id,
            UserCourseProgress.course_slug == s.slug
        )
        prog = (await db.execute(stmt)).scalar_one_or_none()
        if prog:
            s.progress_percent = prog.progress_percent

    return summaries


@router.get("/{slug}", response_model=CourseDetailSchema)
async def get_course_detail(
    slug: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve detailed course syllabus, modules, and lessons."""
    course = content_loader.get_course(slug)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Course with slug '{slug}' not found"
        )

    # Attach progress
    stmt = select(UserCourseProgress).where(
        UserCourseProgress.user_id == user_id,
        UserCourseProgress.course_slug == slug
    )
    prog = (await db.execute(stmt)).scalar_one_or_none()
    if prog:
        course.progress_percent = prog.progress_percent

    return course
