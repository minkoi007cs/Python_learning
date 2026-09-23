"""Pydantic schemas for courses, modules, lessons, and exercises."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ExerciseTestSchema(BaseModel):
    name: str
    assertion: str
    is_hidden: bool = False


class ExerciseSchema(BaseModel):
    id: str
    title: str
    instructions: str
    starter_code: str
    solution_code: Optional[str] = None
    hints: List[str] = Field(default_factory=list)
    explanation: Optional[str] = None
    difficulty: str = "EASY"  # EASY, MEDIUM, HARD
    xp_reward: int = 10
    concept_ids: List[str] = Field(default_factory=list)
    visible_tests: List[ExerciseTestSchema] = Field(default_factory=list)
    hidden_tests: List[ExerciseTestSchema] = Field(default_factory=list)


class LessonSectionSchema(BaseModel):
    type: str  # markdown, code_example, exercise, quiz
    content: Optional[str] = None
    language: Optional[str] = "python"
    code: Optional[str] = None
    explanation: Optional[str] = None
    exercise: Optional[ExerciseSchema] = None


class LessonSummarySchema(BaseModel):
    id: str
    slug: str
    title: str
    estimated_minutes: int = 10
    position: int = 1
    status: str = "NOT_STARTED"  # NOT_STARTED, IN_PROGRESS, COMPLETED


class LessonDetailSchema(BaseModel):
    id: str
    slug: str
    title: str
    module_slug: str
    course_slug: str
    estimated_minutes: int
    concept_ids: List[str] = Field(default_factory=list)
    sections: List[LessonSectionSchema] = Field(default_factory=list)
    next_lesson_slug: Optional[str] = None
    prev_lesson_slug: Optional[str] = None


class ModuleSchema(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    position: int
    lessons: List[LessonSummarySchema] = Field(default_factory=list)


class CourseSummarySchema(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    difficulty: str
    estimated_hours: int
    total_modules: int = 0
    total_lessons: int = 0
    progress_percent: float = 0.0


class CourseDetailSchema(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    difficulty: str
    estimated_hours: int
    modules: List[ModuleSchema] = Field(default_factory=list)
    progress_percent: float = 0.0
