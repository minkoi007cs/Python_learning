# PyPath 🐍

> **Interactive, In-Browser Python Learning Platform Engineered for Deep Mastery**

[![CI](https://github.com/your-org/pypath/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/pypath/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![WebAssembly Pyodide](https://img.shields.io/badge/Pyodide-WASM-yellowgreen.svg)](https://pyodide.org/)

---

## The Problem

Traditional programming education suffers from two major extremes:
1. **Passive Tutorials & Video Courses**: Students watch hours of video or read articles without writing code, developing a false sense of confidence that collapses when facing a blank editor.
2. **Fragmented, Frustrating Tooling**: Absolute beginners struggle for hours setting up local Python installations, PATH variables, and virtual environments before running a single `print("Hello, World!")`.

When beginners do write code, generic test suites offer cryptic error tracebacks that confuse rather than teach.

---

## The Solution

**PyPath** delivers a zero-friction, interactive learning environment combining:
- **Instant In-Browser Execution**: Safe Python 3 execution powered by WebAssembly (Pyodide) running in dedicated Web Workers. Zero local setup required.
- **The Active Learning Loop**: Every concept is immediately coupled with an editable code snippet, runnable sandbox, and behavioral test suite.
- **Actionable Pedagogical Feedback**: Syntax and assertion errors translate into human-friendly debugging advice and progressive hints.
- **Mastery & Retention**: Algorithmic concept mastery scoring, learning streaks, and targeted practice queues inspired by spaced repetition.

```text
Learn Concept ──► Run Example ──► Write Code ──► Execute in WASM ──► Behavioral Feedback ──► Unlock Next Lesson
```

---

## Key Features

- 🖥️ **Monaco Code Editor**: Professional in-browser code workspace with Python syntax highlighting, intelligent auto-indentation, and error diagnostics.
- ⚡ **Safe WebAssembly Engine**: Runs Python 3.11+ entirely within client-side Web Workers, featuring automated execution timeouts to terminate runaway loops safely.
- 🧪 **Behavioral Auto-Grading**: Asserts runtime state, variable types, function return values, and edge cases—never brittle plain-text code comparison.
- 💡 **Progressive 3-Stage Hints**: Scaffolds student reasoning from conceptual nudges to syntax reminders without immediately giving away the answer.
- 📊 **Concept Mastery Matrix**: Tracks granular topic fluency (variables, loops, strings, functions) using accuracy, attempts, and memory decay.
- 🎯 **Practice Mode**: Tailored problem sets filtered by topic, difficulty tier, and personalized "Needs Review" queues.
- 🛠️ **Milestone Projects**: Guided, multi-step command-line projects synthesizing real-world programming concepts (e.g., Tip Calculator, Number Guessing Game, Contact Book).
- 🔥 **Retention Mechanics**: Daily streaks, XP point progression, and milestone badges.

---

## System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 Next.js Frontend (React / TS)                  │   │
│   │                                                                │   │
│   │   ┌──────────────┐   ┌───────────────┐   ┌─────────────────┐   │   │
│   │   │ Lesson View  │   │ Monaco Editor │   │ Progress & XP   │   │   │
│   │   └──────────────┘   └───────┬───────┘   └─────────────────┘   │   │
│   └──────────────────────────────┼─────────────────────────────────┘   │
│                                  │ postMessage                         │
│   ┌──────────────────────────────▼─────────────────────────────────┐   │
│   │                     Isolated Web Worker                        │   │
│   │                                                                │   │
│   │   ┌────────────────────────────────────────────────────────┐   │   │
│   │   │                 Pyodide Runtime (WASM)                 │   │   │
│   │   │   - Virtual In-Memory Filesystem (MEMFS)               │   │   │
│   │   │   - Stdout / Stderr Stream Interceptor                 │   │   │
│   │   │   - Behavioral Test Assertion Engine                   │   │   │
│   │   └────────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST (JWT)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              BACKEND API                               │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 FastAPI Application (Python)                   │   │
│   │   - JWT Verification Guard     - Curriculum Content Engine     │   │
│   │   - Progress & Streak Service  - Concept Mastery Calculator    │   │
│   └──────────────────────────────┬─────────────────────────────────┘   │
│                                  │ SQLAlchemy 2.0 AsyncIO              │
│                                  ▼                                     │
│                     PostgreSQL Database (Supabase)                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Interactive Python Execution Design

Arbitrary user code execution is notoriously difficult to secure. PyPath solves this through a multi-tier defense:

1. **Zero Server Execution**: The backend server **NEVER** runs student code (`exec()` and `eval()` are strictly forbidden in FastAPI).
2. **WebAssembly Sandbox**: Python executes inside the browser's Pyodide engine compiled to WASM. Code has no access to the host machine's filesystem or network.
3. **Web Worker Threading**: Pyodide runs on a background Web Worker. Heavy computations or infinite loops (`while True: pass`) cannot freeze the browser's UI thread.
4. **Watchdog Termination**: A 5,000ms watchdog forcibly terminates unresponsive workers, alerts the user, and spawns a clean interpreter instance instantly.
5. **Output Safeguards**: Stdout streams are capped at 50,000 characters to prevent buffer bloat.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Radix UI |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Python Runtime** | Pyodide (WASM), Web Worker, Emscripten Virtual MEMFS |
| **Backend API** | FastAPI (Python 3.11+), Pydantic v2, Uvicorn |
| **Database & ORM** | PostgreSQL, SQLAlchemy 2.0 (AsyncIO), Alembic Migrations |
| **Authentication** | Supabase Auth (JWT validation on FastAPI backend) |
| **Testing** | Pytest, Vitest, React Testing Library, Playwright |
| **Governance & CI** | GitHub Actions, Husky, Custom pre-commit process verification |

---

## Course Structure: Python Fundamentals

```text
Module 00: Introduction (Syntax, print(), Comments, Mental Model)
Module 01: Variables (Names, Assignment, Reassignment)
Module 02: Data Types (str, int, float, bool, None, type())
Module 03: Strings (Indexing, Slicing, Methods, f-strings)
Module 04: Numbers & Arithmetic (Operators, Precedence, Math)
Module 05: User Input (input(), Type Conversion)
Module 06: Conditionals (if, elif, else, Comparison & Logical Operators)
Module 07: Lists (Sequences, Indexing, Slicing, Mutability, List Methods)
Module 08: Loops (for, while, range(), break, continue)
Module 09: Functions (def, Parameters, Return, Scope, Defaults)
Module 10: Dictionaries (Key-Value pairs, Hash maps, Iteration)
Module 11: Tuples & Sets (Immutability, Uniqueness, Set Operations)
Module 12: Error Handling (try, except, Tracebacks, Exception types)
Module 13: Files (open(), with context managers, Read/Write Virtual FS)
Module 14: Object-Oriented Programming (Classes, Objects, __init__, Methods)
Module 15: Modules & Standard Library (random, math, datetime)
```

---

## Testing Strategy

- **Backend Unit & Integration Tests**: Executed via `pytest` covering API endpoints, authentication boundaries, and mastery calculation formulas.
- **Frontend Component Tests**: Executed via `vitest` covering Monaco editor integration, test results rendering, and hint accordions.
- **End-to-End Verification**: Executed via `playwright` simulating the complete student journey from registration through lesson completion.

---

## Security & Privacy

- **Host Safety**: Server compute is entirely decoupled from code execution.
- **Tenant Isolation**: All progress, code attempts, and profile endpoints enforce strict JWT-based ownership queries.
- **Data Privacy**: Student code submissions are confidential, never published publicly, and never used to train third-party AI models without explicit consent.

---

## Local Development

### Prerequisites
- Node.js $\ge 20$
- pnpm $\ge 9$
- Python $\ge 3.11$

### Quickstart
```bash
# 1. Clone repository
git clone https://github.com/your-username/pypath.git
cd pypath

# 2. Configure environment
cp .env.example .env

# 3. Configure git pre-commit hook
git config core.hooksPath .husky
chmod +x scripts/verify-process-update.mjs .husky/pre-commit

# 4. Install dependencies
pnpm install

# 5. Start development servers
# Backend API
cd apps/api && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (in a separate terminal)
pnpm --filter web dev
```

---

## Project Roadmap

- [x] **Phase 0: Project Governance** (Specs, process ledger, pre-commit enforcement, CI)
- [ ] **Phase 1: Foundation** (Next.js frontend, FastAPI backend, Postgres schema, Auth)
- [ ] **Phase 2: Curriculum System** (YAML course loader, lesson navigation, syllabus)
- [ ] **Phase 3: Python Runtime** (Monaco editor + Pyodide in Web Worker, timeout watchdog)
- [ ] **Phase 4: Exercise Engine** (Behavioral auto-grading, test suites, hint ladder)
- [ ] **Phase 5: Progress System** (Lesson completion, course progress, user dashboard)
- [ ] **Phase 6: Concept Mastery** (Multi-factor mastery scoring, review queues)
- [ ] **Phase 7: Project-Based Learning** (Milestone mini-projects)
- [ ] **Phase 8: Practice Mode** (Targeted topic drills and difficulty filtering)
- [ ] **Phase 9: Gamification** (XP, streaks, milestone achievements)
- [ ] **Phase 10: AI Tutor** (Socratic guidance and progressive hint assistance)
- [ ] **Phase 11: Intermediate Curriculum** (OOP, files, data structures)
- [ ] **Phase 12: Production Hardening** (Security audit, performance, observability)
- [ ] **Phase 13: Production Deployment** (Vercel, Cloud Run, Supabase)

---

## Author & Maintainers

PyPath is designed and maintained by the PyPath Engineering Team.  
For technical architecture details, refer to [`tech.md`](tech.md).  
For the development audit trail, refer to [`process.md`](process.md).  
For AI agent instructions, refer to [`AGENTS.md`](AGENTS.md).
