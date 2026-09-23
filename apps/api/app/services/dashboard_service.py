"""Dashboard aggregation service."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import Streak, UserCourseProgress, UserLessonProgress, XPEvent
from app.models.user import Profile
from app.schemas.dashboard import DashboardResponse, RecommendedReviewItem
from app.services.content_loader import content_loader
from app.services.mastery_service import mastery_service


class DashboardService:
    @staticmethod
    async def get_dashboard_data(db: AsyncSession, user_id: str) -> DashboardResponse:
        """Fetch composite dashboard information for learner."""
        # 1. Profile display name
        profile_stmt = select(Profile).where(Profile.user_id == user_id)
        profile = (await db.execute(profile_stmt)).scalar_one_or_none()
        display_name = profile.display_name if profile else "Python Learner"

        # 2. Streak
        streak_stmt = select(Streak).where(Streak.user_id == user_id)
        streak_rec = (await db.execute(streak_stmt)).scalar_one_or_none()
        current_streak = streak_rec.current_streak if streak_rec else 0

        # 3. Total XP
        xp_stmt = select(func.sum(XPEvent.amount)).where(XPEvent.user_id == user_id)
        total_xp = (await db.execute(xp_stmt)).scalar() or 0

        # 4. Default active course
        courses = content_loader.list_courses()
        active_slug = "python-fundamentals"
        active_title = "Python Fundamentals"
        if courses:
            active_slug = courses[0].slug
            active_title = courses[0].title

        # Check course progress
        prog_stmt = select(UserCourseProgress).where(
            UserCourseProgress.user_id == user_id,
            UserCourseProgress.course_slug == active_slug
        )
        prog_rec = (await db.execute(prog_stmt)).scalar_one_or_none()
        course_percent = prog_rec.progress_percent if prog_rec else 0.0

        # 5. Determine next lesson
        # Get all completed lesson slugs
        completed_stmt = select(UserLessonProgress.lesson_slug).where(
            UserLessonProgress.user_id == user_id,
            UserLessonProgress.course_slug == active_slug,
            UserLessonProgress.status == "COMPLETED"
        )
        completed_slugs = set((await db.execute(completed_stmt)).scalars().all())

        next_slug = "welcome-to-python"
        next_title = "Welcome to Python"

        course_detail = content_loader.get_course(active_slug)
        if course_detail:
            found = False
            for mod in course_detail.modules:
                for les in mod.lessons:
                    if les.slug not in completed_slugs:
                        next_slug = les.slug
                        next_title = les.title
                        found = True
                        break
                if found:
                    break

        # 6. Concept mastery & reviews
        mastery_items = await mastery_service.get_user_mastery(db, user_id)
        review_items = []
        for m in mastery_items:
            if m.needs_review:
                review_items.append(RecommendedReviewItem(
                    concept_id=m.concept_id,
                    concept_name=m.concept_name,
                    reason="Low mastery score or high time decay",
                    suggested_lesson_slug="lesson-01-declaration"
                ))
            if len(review_items) >= 3:
                break

        return DashboardResponse(
            display_name=display_name,
            current_streak=current_streak,
            total_xp=total_xp,
            active_course_slug=active_slug,
            active_course_title=active_title,
            course_progress_percent=course_percent,
            next_lesson_slug=next_slug,
            next_lesson_title=next_title,
            recommended_reviews=review_items,
            top_mastery=mastery_items[:5]
        )


dashboard_service = DashboardService()
