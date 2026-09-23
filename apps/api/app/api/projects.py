"""Mini-projects API router."""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user_id
from app.core.database import get_db
from app.models.progress import XPEvent
from app.models.project import UserProjectProgress

router = APIRouter(prefix="/projects", tags=["Projects"])


class Milestone(BaseModel):
    step: int
    title: str
    description: str
    test_assertion: Optional[str] = None


class ProjectDetail(BaseModel):
    id: str
    slug: str
    title: str
    description: str
    difficulty: str
    starter_code: str
    milestones: List[Milestone]
    completed: bool = False
    milestones_completed: int = 0


PROJECT_CATALOG = [
    {
        "id": "proj-tip-calc",
        "slug": "tip-calculator",
        "title": "Tip Calculator",
        "description": "Build an interactive tip calculator that computes bill totals, tip percentages, and split totals.",
        "difficulty": "EASY",
        "starter_code": (
            "# Tip Calculator\n"
            "# 1. Prompt user for the total bill\n"
            "# 2. Prompt user for tip percentage (e.g. 15, 18, 20)\n"
            "# 3. Compute tip amount and total\n\n"
            "def calculate_total(bill: float, tip_percent: float, people: int = 1) -> float:\n"
            "    # Your code here\n"
            "    pass\n"
        ),
        "milestones": [
            {"step": 1, "title": "Calculate Tip Amount", "description": "Multiply bill by tip_percent / 100", "test_assertion": "calculate_total(100.0, 15.0, 1) == 115.0"},
            {"step": 2, "title": "Split Bill Among People", "description": "Divide total bill + tip by number of people", "test_assertion": "calculate_total(100.0, 20.0, 2) == 60.0"},
            {"step": 3, "title": "Format Total", "description": "Return correctly rounded float to 2 decimal places", "test_assertion": "calculate_total(50.0, 10.0, 4) == 13.75"}
        ]
    },
    {
        "id": "proj-number-guess",
        "slug": "number-guessing-game",
        "title": "Number Guessing Game",
        "description": "Construct a classic terminal game using random number generation, while loops, and comparison logic.",
        "difficulty": "MEDIUM",
        "starter_code": (
            "import random\n\n"
            "def evaluate_guess(secret_number: int, guess: int) -> str:\n"
            "    # Return 'Too High', 'Too Low', or 'Correct!'\n"
            "    pass\n"
        ),
        "milestones": [
            {"step": 1, "title": "Compare Guess to Secret", "description": "Evaluate if guess is higher, lower, or equal", "test_assertion": "evaluate_guess(42, 50) == 'Too High' and evaluate_guess(42, 30) == 'Too Low'"},
            {"step": 2, "title": "Handle Correct Answer", "description": "Return 'Correct!' when guess matches secret", "test_assertion": "evaluate_guess(42, 42) == 'Correct!'"}
        ]
    },
    {
        "id": "proj-contact-book",
        "slug": "contact-book",
        "title": "Contact Book",
        "description": "Create a dictionary-based contact manager supporting search, insert, update, and deletion.",
        "difficulty": "MEDIUM",
        "starter_code": (
            "class ContactBook:\n"
            "    def __init__(self):\n"
            "        self.contacts = {}\n\n"
            "    def add_contact(self, name: str, phone: str):\n"
            "        self.contacts[name] = phone\n\n"
            "    def get_contact(self, name: str) -> str:\n"
            "        return self.contacts.get(name, 'Not Found')\n"
        ),
        "milestones": [
            {"step": 1, "title": "Store Contacts", "description": "Add name and phone pairs to internal storage", "test_assertion": "cb = ContactBook(); cb.add_contact('Alice', '555-1234'); cb.get_contact('Alice') == '555-1234'"},
            {"step": 2, "title": "Handle Missing Contact", "description": "Return 'Not Found' when query does not exist", "test_assertion": "cb = ContactBook(); cb.get_contact('Ghost') == 'Not Found'"}
        ]
    },
    {
        "id": "proj-password-gen",
        "slug": "password-generator",
        "title": "Password Generator",
        "description": "Build a secure random password generator combining uppercase, lowercase, numbers, and symbols.",
        "difficulty": "EASY",
        "starter_code": (
            "import random\n"
            "import string\n\n"
            "def generate_password(length: int = 12) -> str:\n"
            "    chars = string.ascii_letters + string.digits + '!@#$%^&*'\n"
            "    # Generate and return password of specified length\n"
            "    return ''.join(random.choice(chars) for _ in range(length))\n"
        ),
        "milestones": [
            {"step": 1, "title": "Correct Length", "description": "Ensure generated password matches requested length", "test_assertion": "len(generate_password(16)) == 16"},
            {"step": 2, "title": "Randomness", "description": "Ensure subsequent passwords are not identical", "test_assertion": "generate_password(12) != generate_password(12)"}
        ]
    }
]


@router.get("", response_model=List[ProjectDetail])
async def list_projects(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve list of guided mini-projects and user completion status."""
    results = []
    for p in PROJECT_CATALOG:
        stmt = select(UserProjectProgress).where(
            UserProjectProgress.user_id == user_id,
            UserProjectProgress.project_slug == p["slug"]
        )
        rec = (await db.execute(stmt)).scalar_one_or_none()
        completed = rec.completed if rec else False
        milestones_done = rec.milestones_completed if rec else 0

        results.append(ProjectDetail(
            id=p["id"],
            slug=p["slug"],
            title=p["title"],
            description=p["description"],
            difficulty=p["difficulty"],
            starter_code=p["starter_code"],
            milestones=[Milestone(**m) for m in p["milestones"]],
            completed=completed,
            milestones_completed=milestones_done
        ))
    return results


@router.get("/{slug}", response_model=ProjectDetail)
async def get_project(
    slug: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve specific project detail and milestones."""
    for p in PROJECT_CATALOG:
        if p["slug"] == slug:
            stmt = select(UserProjectProgress).where(
                UserProjectProgress.user_id == user_id,
                UserProjectProgress.project_slug == slug
            )
            rec = (await db.execute(stmt)).scalar_one_or_none()
            return ProjectDetail(
                id=p["id"],
                slug=p["slug"],
                title=p["title"],
                description=p["description"],
                difficulty=p["difficulty"],
                starter_code=p["starter_code"],
                milestones=[Milestone(**m) for m in p["milestones"]],
                completed=rec.completed if rec else False,
                milestones_completed=rec.milestones_completed if rec else 0
            )

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Project '{slug}' not found"
    )
