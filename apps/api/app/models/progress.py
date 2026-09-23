"""Progress, exercise attempts, XP, and streak models."""

from datetime import date, datetime
from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class UserCourseProgress(Base, TimestampMixin):
    __tablename__ = "user_course_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    course_slug: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    progress_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    completed_lessons: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_lessons: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class UserLessonProgress(Base, TimestampMixin):
    __tablename__ = "user_lesson_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    course_slug: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    lesson_slug: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="NOT_STARTED", nullable=False)  # NOT_STARTED, IN_PROGRESS, COMPLETED
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)


class UserExerciseAttempt(Base, TimestampMixin):
    __tablename__ = "user_exercise_attempts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    exercise_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    submitted_code: Mapped[str] = mapped_column(Text, nullable=False)
    passed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    tests_passed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    tests_total: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    attempt_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    hints_used: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    solution_viewed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    execution_time_ms: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)


class Streak(Base, TimestampMixin):
    __tablename__ = "streaks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    current_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_streak: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_active_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)


class XPEvent(Base, TimestampMixin):
    __tablename__ = "xp_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    amount: Mapped[int] = mapped_column(Integer, nullable=False)
    reason: Mapped[str] = mapped_column(String(50), nullable=False)  # LESSON_COMPLETED, EXERCISE_PASSED, etc.
