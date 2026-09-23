"""Dashboard composite response schema."""

from typing import List, Optional
from pydantic import BaseModel, Field

from app.schemas.progress import ConceptMasteryItem


class RecommendedReviewItem(BaseModel):
    concept_id: str
    concept_name: str
    reason: str
    suggested_lesson_slug: str


class DashboardResponse(BaseModel):
    display_name: str
    current_streak: int
    total_xp: int
    active_course_slug: str
    active_course_title: str
    course_progress_percent: float
    next_lesson_slug: str
    next_lesson_title: str
    recommended_reviews: List[RecommendedReviewItem] = Field(default_factory=list)
    top_mastery: List[ConceptMasteryItem] = Field(default_factory=list)
