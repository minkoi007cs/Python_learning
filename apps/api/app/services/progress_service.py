"""Progress tracking, streaks, and XP awarding service."""

from datetime import date, datetime, timedelta
from typing import Optional, Tuple
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.progress import (
    Streak,
    UserCourseProgress,
    UserExerciseAttempt,
    UserLessonProgress,
    XPEvent
)
from app.schemas.exercise import ExerciseAttemptCreate, ExerciseSubmissionResult
from app.services.content_loader import content_loader


class ProgressService:
    @staticmethod
    async def record_attempt(
        db: AsyncSession,
        user_id: str,
        exercise_id: str,
        attempt_data: ExerciseAttemptCreate
    ) -> ExerciseSubmissionResult:
        """Record an exercise attempt, update lesson progress, streaks, and award XP if passed."""
        # 1. Determine attempt count
        attempt_stmt = select(UserExerciseAttempt).where(
            UserExerciseAttempt.user_id == user_id,
            UserExerciseAttempt.exercise_id == exercise_id
        )
        existing_attempts = (await db.execute(attempt_stmt)).scalars().all()
        attempt_num = len(existing_attempts) + 1

        # 2. Save attempt record
        attempt = UserExerciseAttempt(
            user_id=user_id,
            exercise_id=exercise_id,
            submitted_code=attempt_data.submitted_code,
            passed=attempt_data.passed,
            tests_passed=attempt_data.tests_passed,
            tests_total=attempt_data.tests_total,
            attempt_number=attempt_num,
            hints_used=attempt_data.hints_used,
            solution_viewed=attempt_data.solution_viewed,
            execution_time_ms=attempt_data.execution_time_ms
        )
        db.add(attempt)

        xp_awarded = 0
        lesson_completed = False
        current_streak = 0
        next_lesson_slug = None

        # 3. If passed, complete lesson, advance streak, and award XP
        if attempt_data.passed:
            # Check if this exercise was already passed previously
            already_passed = any(a.passed for a in existing_attempts)
            if not already_passed:
                # Award XP
                base_xp = 10
                if attempt_data.solution_viewed:
                    base_xp = 5
                elif attempt_num == 1:
                    base_xp = 15  # Bonus for passing on first try

                xp_awarded = base_xp
                xp_event = XPEvent(
                    user_id=user_id,
                    amount=xp_awarded,
                    reason="EXERCISE_PASSED"
                )
                db.add(xp_event)

            # Update lesson progress
            lesson_stmt = select(UserLessonProgress).where(
                UserLessonProgress.user_id == user_id,
                UserLessonProgress.course_slug == attempt_data.course_slug,
                UserLessonProgress.lesson_slug == attempt_data.lesson_slug
            )
            lesson_progress = (await db.execute(lesson_stmt)).scalar_one_or_none()
            if not lesson_progress:
                lesson_progress = UserLessonProgress(
                    user_id=user_id,
                    course_slug=attempt_data.course_slug,
                    lesson_slug=attempt_data.lesson_slug,
                    status="COMPLETED",
                    completed_at=datetime.utcnow()
                )
                db.add(lesson_progress)
                lesson_completed = True
            else:
                if lesson_progress.status != "COMPLETED":
                    lesson_progress.status = "COMPLETED"
                    lesson_progress.completed_at = datetime.utcnow()
                    lesson_completed = True

            # Update streak
            current_streak = await ProgressService._update_streak(db, user_id)

            # Update course overall progress
            await ProgressService._update_course_progress(db, user_id, attempt_data.course_slug)

            # Determine next lesson slug
            lesson_detail = content_loader.get_lesson(attempt_data.course_slug, attempt_data.lesson_slug)
            if lesson_detail:
                next_lesson_slug = lesson_detail.next_lesson_slug

        await db.commit()

        message = "Exercise passed successfully!" if attempt_data.passed else "Some tests failed. Keep debugging!"
        return ExerciseSubmissionResult(
            passed=attempt_data.passed,
            message=message,
            xp_awarded=xp_awarded,
            lesson_completed=lesson_completed,
            current_streak=current_streak,
            next_lesson_slug=next_lesson_slug
        )

    @staticmethod
    async def _update_streak(db: AsyncSession, user_id: str) -> int:
        """Update consecutive daily active learning streak."""
        today = date.today()
        stmt = select(Streak).where(Streak.user_id == user_id)
        streak = (await db.execute(stmt)).scalar_one_or_none()

        if not streak:
            streak = Streak(
                user_id=user_id,
                current_streak=1,
                longest_streak=1,
                last_active_date=today
            )
            db.add(streak)
            return 1

        if streak.last_active_date == today:
            return streak.current_streak

        yesterday = today - timedelta(days=1)
        if streak.last_active_date == yesterday:
            streak.current_streak += 1
            if streak.current_streak > streak.longest_streak:
                streak.longest_streak = streak.current_streak
        else:
            streak.current_streak = 1

        streak.last_active_date = today
        return streak.current_streak

    @staticmethod
    async def _update_course_progress(db: AsyncSession, user_id: str, course_slug: str) -> None:
        """Recalculate overall course completion percentage."""
        course = content_loader.get_course(course_slug)
        if not course:
            return

        total_lessons = sum(len(m.lessons) for m in course.modules)
        if total_lessons == 0:
            return

        stmt = select(UserLessonProgress).where(
            UserLessonProgress.user_id == user_id,
            UserLessonProgress.course_slug == course_slug,
            UserLessonProgress.status == "COMPLETED"
        )
        completed_lessons = len((await db.execute(stmt)).scalars().all())

        percent = round((completed_lessons / total_lessons) * 100.0, 1)

        prog_stmt = select(UserCourseProgress).where(
            UserCourseProgress.user_id == user_id,
            UserCourseProgress.course_slug == course_slug
        )
        course_prog = (await db.execute(prog_stmt)).scalar_one_or_none()

        if not course_prog:
            course_prog = UserCourseProgress(
                user_id=user_id,
                course_slug=course_slug,
                progress_percent=percent,
                completed_lessons=completed_lessons,
                total_lessons=total_lessons
            )
            db.add(course_prog)
        else:
            course_prog.progress_percent = percent
            course_prog.completed_lessons = completed_lessons
            course_prog.total_lessons = total_lessons


progress_service = ProgressService()
