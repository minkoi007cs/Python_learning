"""Progress and mastery schemas."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ConceptMasteryItem(BaseModel):
    concept_id: str
    concept_name: str
    category: str
    mastery_score: float  # 0.0 to 1.0
    attempts: int
    needs_review: bool


class CourseProgressDetail(BaseModel):
    course_slug: str
    course_title: str
    progress_percent: float
    completed_lessons: int
    total_lessons: int


class ProgressSummaryResponse(BaseModel):
    user_id: str
    total_xp: int
    current_streak: int
    longest_streak: int
    courses_progress: List[CourseProgressDetail] = Field(default_factory=list)
    mastery: List[ConceptMasteryItem] = Field(default_factory=list)
