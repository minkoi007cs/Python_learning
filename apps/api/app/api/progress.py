"""User progress retrieval API router."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.models.progress import Streak, UserCourseProgress, UserLessonProgress, XPEvent
from app.schemas.progress import CourseProgressDetail, ProgressSummaryResponse
from app.services.content_loader import content_loader
from app.services.mastery_service import mastery_service

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("", response_model=ProgressSummaryResponse)
async def get_user_progress(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full progress summary for the authenticated user."""
    # 1. Total XP
    xp_stmt = select(func.sum(XPEvent.amount)).where(XPEvent.user_id == user_id)
    total_xp = (await db.execute(xp_stmt)).scalar() or 0

    # 2. Streaks
    streak_stmt = select(Streak).where(Streak.user_id == user_id)
    streak_rec = (await db.execute(streak_stmt)).scalar_one_or_none()
    current_streak = streak_rec.current_streak if streak_rec else 0
    longest_streak = streak_rec.longest_streak if streak_rec else 0

    # 3. Course progress list
    courses = content_loader.list_courses()
    course_progress_list = []
    for c in courses:
        prog_stmt = select(UserCourseProgress).where(
            UserCourseProgress.user_id == user_id,
            UserCourseProgress.course_slug == c.slug
        )
        prog_rec = (await db.execute(prog_stmt)).scalar_one_or_none()
        percent = prog_rec.progress_percent if prog_rec else 0.0
        completed = prog_rec.completed_lessons if prog_rec else 0
        total = c.total_lessons

        course_progress_list.append(CourseProgressDetail(
            course_slug=c.slug,
            course_title=c.title,
            progress_percent=percent,
            completed_lessons=completed,
            total_lessons=total
        ))

    # 4. Concept mastery
    mastery_items = await mastery_service.get_user_mastery(db, user_id)

    return ProgressSummaryResponse(
        user_id=user_id,
        total_xp=total_xp,
        current_streak=current_streak,
        longest_streak=longest_streak,
        courses_progress=course_progress_list,
        mastery=mastery_items
    )
