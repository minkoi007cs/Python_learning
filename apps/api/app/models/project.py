"""Project progress tracking models."""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid


class UserProjectProgress(Base, TimestampMixin):
    __tablename__ = "user_project_progress"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    project_slug: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    milestones_completed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_milestones: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
