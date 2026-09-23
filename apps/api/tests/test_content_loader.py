"""Tests for the YAML curriculum loader and parser."""

import pytest
from app.services.content_loader import content_loader


def test_course_loaded():
    courses = content_loader.list_courses()
    assert len(courses) >= 1
    slugs = [c.slug for c in courses]
    assert "python-fundamentals" in slugs

    pf = content_loader.get_course("python-fundamentals")
    assert pf is not None
    assert pf.title == "Python Fundamentals"
    assert len(pf.modules) >= 16  # Modules 00 through 15


def test_lessons_and_exercises_structure():
    # Verify module 00 lesson 01
    lesson1 = content_loader.get_lesson("python-fundamentals", "welcome-to-python")
    assert lesson1 is not None
    assert lesson1.title == "Welcome to Python"
    assert len(lesson1.sections) >= 3

    # Verify exercise
    ex = content_loader.get_exercise("ex-intro-01")
    assert ex is not None
    assert "Hello, PyPath!" in ex.instructions
    assert len(ex.visible_tests) >= 1
    assert len(ex.hints) >= 1


def test_all_modules_have_lessons():
    pf = content_loader.get_course("python-fundamentals")
    assert pf is not None
    for mod in pf.modules:
        assert len(mod.lessons) >= 1, f"Module {mod.slug} has no lessons!"
