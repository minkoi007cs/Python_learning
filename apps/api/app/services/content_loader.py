"""Curriculum content loader parsing YAML courses, modules, lessons, and exercises."""

import os
from typing import Dict, List, Optional
import yaml

from app.core.config import settings
from app.schemas.course import (
    CourseDetailSchema,
    CourseSummarySchema,
    ExerciseSchema,
    ExerciseTestSchema,
    LessonDetailSchema,
    LessonSectionSchema,
    LessonSummarySchema,
    ModuleSchema,
)


class ContentLoader:
    def __init__(self, content_dir: Optional[str] = None):
        self.content_dir = content_dir or settings.CONTENT_DIR
        self._courses: Dict[str, CourseDetailSchema] = {}
        self._lessons: Dict[str, LessonDetailSchema] = {}  # key: f"{course_slug}/{lesson_slug}"
        self._exercises: Dict[str, ExerciseSchema] = {}  # key: exercise_id
        self._ordered_lesson_keys: List[str] = []
        self.reload()

    def reload(self) -> None:
        """Scan content directory and load all curriculum files."""
        self._courses.clear()
        self._lessons.clear()
        self._exercises.clear()
        self._ordered_lesson_keys.clear()

        courses_dir = os.path.join(self.content_dir, "courses")
        if not os.path.exists(courses_dir):
            return

        for course_slug in sorted(os.listdir(courses_dir)):
            course_path = os.path.join(courses_dir, course_slug)
            if not os.path.isdir(course_path):
                continue

            course_yaml_path = os.path.join(course_path, "course.yaml")
            if not os.path.exists(course_yaml_path):
                continue

            with open(course_yaml_path, "r", encoding="utf-8") as f:
                c_data = yaml.safe_load(f) or {}

            modules_list: List[ModuleSchema] = []
            module_dirs = [d for d in os.listdir(course_path) if os.path.isdir(os.path.join(course_path, d))]
            module_dirs.sort()

            module_pos = 1
            for m_dir in module_dirs:
                m_path = os.path.join(course_path, m_dir)
                m_slug = m_dir
                m_title = m_dir.replace("-", " ").title()
                m_desc = f"Learn {m_title}"

                # Check for module.yaml metadata if present
                m_meta_file = os.path.join(m_path, "module.yaml")
                if os.path.exists(m_meta_file):
                    with open(m_meta_file, "r", encoding="utf-8") as mf:
                        m_meta = yaml.safe_load(mf) or {}
                        m_title = m_meta.get("title", m_title)
                        m_desc = m_meta.get("description", m_desc)

                lessons_in_module: List[LessonSummarySchema] = []
                lesson_files = [f for f in os.listdir(m_path) if f.endswith(".yaml") and f != "module.yaml"]
                lesson_files.sort()

                lesson_pos = 1
                for l_file in lesson_files:
                    l_path = os.path.join(m_path, l_file)
                    with open(l_path, "r", encoding="utf-8") as lf:
                        l_data = yaml.safe_load(lf) or {}

                    l_slug = l_data.get("slug", l_file.replace(".yaml", ""))
                    l_title = l_data.get("title", l_slug.replace("-", " ").title())
                    l_mins = l_data.get("estimated_minutes", 10)
                    concept_ids = l_data.get("concept_ids", [])

                    # Parse sections
                    sections_list: List[LessonSectionSchema] = []
                    for s in l_data.get("sections", []):
                        stype = s.get("type", "markdown")
                        ex_schema = None
                        if stype == "exercise":
                            ex_data = s.get("exercise", s)
                            visible_tests = [
                                ExerciseTestSchema(**vt) for vt in ex_data.get("visible_tests", [])
                            ]
                            hidden_tests = [
                                ExerciseTestSchema(**ht, is_hidden=True) for ht in ex_data.get("hidden_tests", [])
                            ]
                            ex_schema = ExerciseSchema(
                                id=ex_data.get("id", f"ex-{l_slug}"),
                                title=ex_data.get("title", f"Exercise: {l_title}"),
                                instructions=ex_data.get("instructions", ""),
                                starter_code=ex_data.get("starter_code", ""),
                                solution_code=ex_data.get("solution_code"),
                                hints=ex_data.get("hints", []),
                                explanation=ex_data.get("explanation"),
                                difficulty=ex_data.get("difficulty", "EASY"),
                                xp_reward=ex_data.get("xp_reward", 10),
                                concept_ids=concept_ids,
                                visible_tests=visible_tests,
                                hidden_tests=hidden_tests
                            )
                            self._exercises[ex_schema.id] = ex_schema

                        sections_list.append(LessonSectionSchema(
                            type=stype,
                            content=s.get("content"),
                            language=s.get("language", "python"),
                            code=s.get("code"),
                            explanation=s.get("explanation"),
                            exercise=ex_schema
                        ))

                    key = f"{course_slug}/{l_slug}"
                    self._ordered_lesson_keys.append(key)

                    lesson_detail = LessonDetailSchema(
                        id=l_data.get("id", f"lesson-{l_slug}"),
                        slug=l_slug,
                        title=l_title,
                        module_slug=m_slug,
                        course_slug=course_slug,
                        estimated_minutes=l_mins,
                        concept_ids=concept_ids,
                        sections=sections_list
                    )
                    self._lessons[key] = lesson_detail

                    lessons_in_module.append(LessonSummarySchema(
                        id=lesson_detail.id,
                        slug=l_slug,
                        title=l_title,
                        estimated_minutes=l_mins,
                        position=lesson_pos
                    ))
                    lesson_pos += 1

                modules_list.append(ModuleSchema(
                    id=f"mod-{m_slug}",
                    slug=m_slug,
                    title=m_title,
                    description=m_desc,
                    position=module_pos,
                    lessons=lessons_in_module
                ))
                module_pos += 1

            # Populate prev/next pointers for all lessons
            for i, key in enumerate(self._ordered_lesson_keys):
                if key in self._lessons:
                    if i > 0:
                        prev_key = self._ordered_lesson_keys[i - 1]
                        if prev_key.startswith(f"{course_slug}/"):
                            self._lessons[key].prev_lesson_slug = prev_key.split("/", 1)[1]
                    if i < len(self._ordered_lesson_keys) - 1:
                        next_key = self._ordered_lesson_keys[i + 1]
                        if next_key.startswith(f"{course_slug}/"):
                            self._lessons[key].next_lesson_slug = next_key.split("/", 1)[1]

            course_detail = CourseDetailSchema(
                id=c_data.get("id", f"course-{course_slug}"),
                slug=course_slug,
                title=c_data.get("title", course_slug.replace("-", " ").title()),
                description=c_data.get("description", "Interactive Python course"),
                difficulty=c_data.get("difficulty", "BEGINNER"),
                estimated_hours=c_data.get("estimated_hours", 20),
                modules=modules_list
            )
            self._courses[course_slug] = course_detail

    def list_courses(self) -> List[CourseSummarySchema]:
        summaries = []
        for slug, c in self._courses.items():
            tot_lessons = sum(len(m.lessons) for m in c.modules)
            summaries.append(CourseSummarySchema(
                id=c.id,
                slug=c.slug,
                title=c.title,
                description=c.description,
                difficulty=c.difficulty,
                estimated_hours=c.estimated_hours,
                total_modules=len(c.modules),
                total_lessons=tot_lessons
            ))
        return summaries

    def get_course(self, slug: str) -> Optional[CourseDetailSchema]:
        return self._courses.get(slug)

    def get_lesson(self, course_slug: str, lesson_slug: str) -> Optional[LessonDetailSchema]:
        return self._lessons.get(f"{course_slug}/{lesson_slug}")

    def get_exercise(self, exercise_id: str) -> Optional[ExerciseSchema]:
        return self._exercises.get(exercise_id)

    def get_all_exercises(self) -> List[ExerciseSchema]:
        return list(self._exercises.values())


content_loader = ContentLoader()
