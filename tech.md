# PyPath Technical Specification

> **Single Source of Technical Truth**  
> Any architectural change, technology addition, security policy adjustment, or curriculum storage revision must update this document.

---

## 1. Project Overview

**PyPath** is an interactive, production-grade Python learning platform designed to take students from complete novices to confident, intermediate Python practitioners who can independently construct real-world software.

Unlike passive documentation sites or static video portals, PyPath enforces an active, hands-on pedagogical loop:

```text
Learn
  ↓
See Example
  ↓
Write Code
  ↓
Run Code
  ↓
Receive Feedback
  ↓
Debug
  ↓
Submit
  ↓
Pass Exercise
  ↓
Update Progress
  ↓
Unlock Next Content
```

PyPath blends the best pedagogical characteristics of premier educational platforms:
- **Codecademy**: Split-pane, guided step-by-step interactive lessons with real-time feedback.
- **freeCodeCamp**: Structured, project-first milestones and open, mastery-driven curriculum.
- **LeetCode**: Rigorous behavioral test evaluation, edge-case validation, and instant test report generation.
- **Duolingo**: Habit-forming retention mechanics, learning streaks, bite-sized lessons, and continuous concept reinforcement.

---

## 2. Product Vision

The guiding vision of PyPath is to eliminate the friction and intimidation of learning to program:

> *"From 'I have never programmed before' to 'I understand Python fundamentals and can independently architect, debug, and build real applications.'"*

Key Product Tenets:
1. **Action Over Passive Consumption**: Every concept is immediately followed by a runnable snippet and a coding challenge.
2. **Deterministic, Helpful Feedback**: Syntax errors, runtime errors, and failed assertions yield friendly, human-actionable guidance—never unformatted stack traces or generic "Wrong" messages.
3. **Ironclad Execution Safety**: Student code runs in isolated environments; student failures never crash the browser or the server.
4. **Transparent Mastery**: Users see exactly what concepts they know, what needs review, and why.

---

## 3. Target Users

1. **Complete Beginners**: Zero prior programming knowledge; requires plain English explanations, visual mental models, and scaffolded exercises.
2. **High School & University Students**: Enrolled in introductory computer science or data courses; requires rigorous understanding of algorithms, control flow, and data structures.
3. **Self-Taught Developers & Career Switchers**: Seeking practical, employable skills through portfolio-grade projects and robust problem-solving drills.
4. **Data, AI & Automation Aspirants**: Professionals looking to acquire Python for scripting, spreadsheet automation, and data preparation.

---

## 4. Product Requirements

### 4.1 Functional Requirements
- **Interactive Code Workspace**: In-browser Monaco editor with Python syntax highlighting, autocomplete, auto-indentation, and error markers.
- **Safe In-Browser Execution**: Instant execution of Python 3 code via WebAssembly (Pyodide) running in an isolated Web Worker.
- **Automated Behavioral Grading**: Evaluates user code against visible and hidden test suites using namespace and execution assertions.
- **Progressive Hint System**: Multi-stage hints that scaffold learning without immediately giving away solutions.
- **Curriculum Navigation**: Hierarchical progression through Courses, Modules, Lessons, and Exercises with pre-requisite gating.
- **Concept Mastery Tracking**: Multi-factor scoring reflecting student performance, attempts, hints, and recency.
- **Project-Based Milestones**: Guided, multi-step mini-projects synthesizing multiple concepts.
- **User Dashboard & Analytics**: Visual progress charts, streaks, XP tally, daily goals, and personalized review queues.
- **Authentication & Profiles**: Secure sign-up via Email/Password and OAuth (Google), persisting personal progress and code attempts.

### 4.2 Non-Functional Requirements
- **Security**: Absolute prevention of arbitrary remote code execution on the backend server.
- **Reliability**: Worker-level timeout (e.g., 5 seconds) to catch infinite loops without freezing the UI.
- **Performance**: Pyodide runtime lazy-loaded only when entering coding lessons; sub-100ms UI interactions.
- **Accessibility**: Compliance with WCAG 2.1 AA standards; keyboard-friendly editor navigation.
- **Portability**: Clean separation between frontend (Next.js), backend (FastAPI), and execution engine.

---

## 5. Non-Goals

To maintain focus on educational excellence, the following are explicitly out of scope for the MVP:
- **Generic Online IDE**: PyPath is not a cloud IDE (like Replit or Gitpod) for building arbitrary multi-language applications.
- **Arbitrary Cloud Compute**: We do not provide unconstrained Linux shell access or persistent server virtual machines for student code in early phases.
- **Static Blogging / Article Archive**: PyPath will never become a collection of passive Python tutorials without interactive code execution.
- **Unsupervised AI Code Generation**: The AI Tutor assists, clarifies, and asks Socratic questions—it never writes the student's assignment for them.
- **Complex Multi-User Collaboration**: Synchronous multiplayer pair programming is deferred to future roadmap phases.

---

## 6. Mandatory Engineering Rules

1. **NO BACKEND `exec()` OR `eval()`**: Arbitrary student code must NEVER be executed inside the FastAPI backend process under any circumstances.
2. **Strict Behavioral Grading**: Student code must NEVER be graded by naive string comparison (`student_code == expected_code`). Grading must assert behavior and state within the Python runtime.
3. **Process Documentation Discipline**: Every commit touching application logic, database, curriculum, or configuration MUST be accompanied by an update to `process.md`.
4. **Architectural Parity**: Any structural, framework, database, or infrastructure modification MUST be reflected in `tech.md`.
5. **No Blind Claims**: Tests and validations reported in `process.md` must have been executed and verified.
6. **Student Data Confidentiality**: A user's code, attempts, and progress are private by default and strictly isolated by authenticated user IDs.

---

## 7. Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18 / 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons, Radix UI primitives
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **State Management**: Zustand / React Context & TanStack Query (v5)

### Python In-Browser Execution
- **Engine**: Pyodide (Python 3.11+ compiled to WebAssembly)
- **Concurrency**: Dedicated Web Worker (`python.worker.ts`)
- **Communication**: PostMessage protocol with transferrable buffers and structured events

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM / Query Builder**: SQLAlchemy 2.0 (AsyncIO)
- **Database Migrations**: Alembic
- **Validation**: Pydantic v2
- **Testing**: Pytest, pytest-asyncio, HTTPX

### Database & Auth
- **Primary Database**: PostgreSQL (via Supabase or standard PostgreSQL instance)
- **Authentication**: Supabase Auth (JWT verification on FastAPI backend)

### Tooling & CI/CD
- **Package Manager**: pnpm (workspaces)
- **Pre-commit Checks**: Husky + custom Node verification script (`scripts/verify-process-update.mjs`)
- **Continuous Integration**: GitHub Actions (Lint, Typecheck, Test, Build, Process validation)

---

## 8. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                            │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 Next.js Frontend (React / TS)                  │   │
│   │                                                                │   │
│   │   ┌──────────────┐   ┌───────────────┐   ┌─────────────────┐   │   │
│   │   │ Lesson View  │   │ Monaco Editor │   │ Progress/XP UI  │   │   │
│   │   └──────────────┘   └───────┬───────┘   └─────────────────┘   │   │
│   └──────────────────────────────┼─────────────────────────────────┘   │
│                                  │ postMessage                         │
│   ┌──────────────────────────────▼─────────────────────────────────┐   │
│   │                     Isolated Web Worker                        │   │
│   │                                                                │   │
│   │   ┌────────────────────────────────────────────────────────┐   │   │
│   │   │                 Pyodide Runtime (WASM)                 │   │   │
│   │   │   - Virtual Filesystem (Emscripten MEMFS)              │   │   │
│   │   │   - Stdout / Stderr Interceptor                        │   │   │
│   │   │   - Test Runner & Assertion Evaluator                  │   │   │
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
│   │                                                                │   │
│   │   ┌──────────────┐   ┌───────────────┐   ┌─────────────────┐   │   │
│   │   │ Auth Guard   │   │ Content API   │   │ Progress Service│   │   │
│   │   └──────┬───────┘   └───────┬───────┘   └────────┬────────┘   │   │
│   └──────────┼───────────────────┼────────────────────┼────────────┘   │
│              │                   │                    │                │
│              ▼                   ▼                    ▼                │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                 SQLAlchemy Async ORM Layer                     │   │
│   └──────────────────────────────┬─────────────────────────────────┘   │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SUPABASE / POSTGRESQL                           │
│   - Users & Profiles       - Attempt Records       - Streaks & XP      │
│   - Course & Modules       - Concept Mastery       - Achievements      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Repository Structure

```text
pypath/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI pipeline
├── .husky/
│   └── pre-commit               # Git pre-commit hook enforcing process.md
├── apps/
│   ├── api/                     # FastAPI Backend Application
│   │   ├── app/
│   │   │   ├── api/             # API Routers (courses, lessons, exercises, progress)
│   │   │   ├── core/            # Config, DB connection, Auth JWT verification
│   │   │   ├── models/          # SQLAlchemy ORM models
│   │   │   ├── repositories/    # Database query abstractions
│   │   │   ├── schemas/         # Pydantic request/response schemas
│   │   │   ├── services/        # Business logic (progress, mastery, grading)
│   │   │   └── main.py          # Application entrypoint
│   │   ├── tests/               # Pytest suite
│   │   ├── alembic/             # Database migration scripts
│   │   ├── alembic.ini          # Alembic configuration
│   │   ├── pyproject.toml       # Python dependencies & build config
│   │   └── requirements.txt     # Locked production dependencies
│   └── web/                     # Next.js Frontend Application
│       ├── app/                 # Next.js App Router (pages & layouts)
│       │   ├── (auth)/          # Login, Register, Forgot Password
│       │   ├── (dashboard)/     # Main dashboard, profile, settings
│       │   ├── courses/         # Course catalog & module syllabus
│       │   ├── learn/           # Interactive split-screen lesson runner
│       │   ├── practice/        # Practice mode & drills
│       │   └── projects/        # Guided mini-projects
│       ├── components/          # Reusable UI & domain components
│       │   ├── editor/          # Monaco editor wrapper & control toolbar
│       │   ├── exercise/        # Instructions, test results, hint accordion
│       │   ├── lesson/          # Split-pane layout, markdown viewer
│       │   └── progress/        # Streak counters, XP indicators, mastery bars
│       ├── lib/                 # Utilities, API client, Supabase client
│       ├── workers/             # Dedicated Web Workers (Pyodide execution engine)
│       ├── package.json         # Web workspace dependencies
│       └── tsconfig.json        # TypeScript configuration
├── content/                     # Version-controlled curriculum source
│   ├── courses/
│   │   └── python-fundamentals/
│   │       ├── course.yaml
│   │       ├── module-00-introduction/
│   │       ├── module-01-variables/
│   │       └── ...
├── docs/                        # Architecture diagrams & guides
├── scripts/
│   └── verify-process-update.mjs # Pre-commit & CI governance validator
├── .env.example                 # Template environment variables
├── .gitignore                   # Multi-language Git exclusion rules
├── AGENTS.md                    # Mandatory instructions for AI coding agents
├── CONTRIBUTING.md              # Human developer contribution guidelines
├── package.json                 # Monorepo root configuration
├── pnpm-workspace.yaml          # Monorepo workspace package definitions
├── process.md                   # Chronological development process ledger
├── README.md                    # Public, recruiter-ready presentation document
└── tech.md                      # Single source of technical truth
```

---

## 10. Frontend Architecture

### 10.1 Next.js App Router Structure
- `app/layout.tsx`: Root layout with dark/light theme provider, auth session context, and toast notifications.
- `app/(dashboard)/page.tsx`: Learner dashboard with recent course, progress metrics, daily streak, and review recommendations.
- `app/learn/[courseSlug]/[lessonSlug]/page.tsx`: The primary interactive split-screen workspace.

### 10.2 Component Hierarchy (Lesson Workspace)
```text
<LessonWorkspace>
  ├── <LessonHeader> (Course breadcrumbs, progress percentage, streak badge)
  ├── <ResizablePanelGroup direction="horizontal">
  │   ├── <ResizablePanel defaultSize={45}>
  │   │   └── <LessonContentPane>
  │   │       ├── <LessonMarkdownViewer>
  │   │       ├── <CodeExampleSnippet runInEditor={true} />
  │   │       ├── <ExerciseInstructions />
  │   │       └── <HintAccordion hints={exercise.hints} />
  │   ├── <ResizableHandle withHandle />
  │   └── <ResizablePanel defaultSize={55}>
  │       └── <CodeWorkspacePane>
  │           ├── <EditorToolbar onRun={...} onSubmit={...} onReset={...} />
  │           ├── <MonacoEditorContainer language="python" />
  │           └── <OutputConsolePane activeTab="output|tests">
  │               ├── <TerminalOutput stdout={...} stderr={...} />
  │               └── <TestResultsList tests={results} />
```

### 10.3 Worker Bridge Hook (`usePythonWorker`)
The frontend communicates with Pyodide through a dedicated hook that manages the Web Worker lifecycle:
- Instantiates `python.worker.ts` on demand.
- Maintains runtime status: `UNINITIALIZED`, `LOADING`, `READY`, `RUNNING`, `ERROR`, `TIMEOUT`.
- Intercepts streaming stdout/stderr messages.
- Implements a watchdog timer: kills worker and spawns a fresh worker if code runs longer than 5,000ms.

---

## 11. Backend Architecture

### 11.1 FastAPI Service Layers
The backend is structured into four distinct, loosely coupled layers:
1. **Routers (`app/api/`)**: Handle HTTP serialization, query parsing, header extraction, and status codes.
2. **Services (`app/services/`)**: Enforce business rules, progress calculation, streak updates, and mastery score aggregation.
3. **Repositories (`app/repositories/`)**: Encapsulate SQLAlchemy queries, transactions, and eager-loading joins.
4. **Core (`app/core/`)**: Application configuration, JWT validation, database engine lifecycle, and structured logging.

### 11.2 API Endpoints
- `GET /api/v1/health`: System health & database connectivity check.
- `GET /api/v1/courses`: List all published courses with module summaries.
- `GET /api/v1/courses/{slug}`: Retrieve course syllabus, module tree, and user enrollment status.
- `GET /api/v1/lessons/{id}`: Fetch lesson content, objectives, and associated exercises.
- `POST /api/v1/exercises/{id}/attempt`: Record an exercise execution attempt (code, pass/fail, tests passed, execution time).
- `POST /api/v1/exercises/{id}/submit`: Grade submission, mark lesson completion, award XP, update streaks.
- `GET /api/v1/progress`: Aggregate progress metrics for the authenticated user.
- `GET /api/v1/mastery`: Detailed concept mastery breakdown.
- `GET /api/v1/dashboard`: Composite dashboard payload (current course, next lesson, streak, review items).

---

## 12. Database Architecture

### 12.1 Core Relational Schema

```text
               ┌───────────────┐
               │     users     │
               └───────┬───────┘
                       │ 1:1
               ┌───────▼───────┐
               │   profiles    │
               └───────┬───────┘
                       │ 1:N
        ┌──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  user_course ││  user_lesson ││user_exercise ││ user_concept │
│   progress   ││   progress   ││   attempts   ││   mastery    │
└──────────────┘└──────────────┘└──────┬───────┘└──────────────┘
                                       │ N:1
                               ┌───────▼───────┐
                               │   exercises   │
                               └───────┬───────┘
                                       │ N:1
                               ┌───────▼───────┐
                               │    lessons    │
                               └───────┬───────┘
                                       │ N:1
                               ┌───────▼───────┐
                               │    modules    │
                               └───────┬───────┘
                                       │ N:1
                               ┌───────▼───────┐
                               │    courses    │
                               └───────────────┘
```

### 12.2 Key Table Specifications
- **`users`**: Synced with Supabase Auth (`id` UUID primary key, `email`, `created_at`).
- **`profiles`**: `user_id` (FK), `display_name`, `experience_level` (`BEGINNER`, `SOME_EXPERIENCE`, `INTERMEDIATE`), `daily_goal_minutes`, `timezone`.
- **`courses`**: `id`, `slug` (unique index), `title`, `description`, `difficulty`, `estimated_hours`, `published`, `position`.
- **`modules`**: `id`, `course_id` (FK), `slug`, `title`, `description`, `position`, `published`.
- **`lessons`**: `id`, `module_id` (FK), `slug`, `title`, `description`, `estimated_minutes`, `position`, `content_version`, `published`.
- **`exercises`**: `id`, `lesson_id` (FK), `title`, `instructions`, `starter_code`, `solution_code`, `visible_tests`, `hidden_tests`, `hints`, `explanation`, `difficulty`, `xp_reward`.
- **`user_exercise_attempts`**: `id`, `user_id` (FK), `exercise_id` (FK), `submitted_code`, `passed`, `tests_passed`, `tests_total`, `attempt_number`, `hints_used`, `solution_viewed`, `execution_time_ms`, `created_at`.
- **`user_concept_mastery`**: `id`, `user_id` (FK), `concept_id` (FK), `mastery_score` (0.0 to 1.0), `total_attempts`, `successful_attempts`, `last_practiced_at`.
- **`streaks`**: `id`, `user_id` (FK), `current_streak`, `longest_streak`, `last_active_date`, `created_at`, `updated_at`.
- **`xp_events`**: `id`, `user_id` (FK), `amount`, `reason` (`LESSON_COMPLETED`, `EXERCISE_PASSED`, `STREAK_MILESTONE`), `created_at`.

---

## 13. Authentication Architecture

1. **Authentication Provider**: Supabase Auth handles user registration, email verification, password resets, and Google OAuth sessions.
2. **JWT Flow**:
   - The frontend authenticates directly against Supabase and retrieves a short-lived access JWT.
   - Every API request to FastAPI sends `Authorization: Bearer <token>`.
   - FastAPI (`app/core/auth.py`) validates the JWT cryptographically using Supabase's JWT secret or public JWKS keys.
3. **Tenant Isolation**:
   - The verified `sub` claim in the JWT represents `user_id`.
   - All repository queries filter by `user_id == authenticated_user_id`.
   - Any client payload attempting to specify a `user_id` is rejected or ignored.

---

## 14. Curriculum Architecture

The curriculum is structured as a 4-level hierarchy:

```text
Course (e.g., Python Fundamentals)
  └── Module (e.g., Module 1: Variables)
        └── Lesson (e.g., Lesson 2: Reassigning Variables)
              └── Exercise (e.g., Swap Two Variables)
```

Each course additionally links to:
- **Concepts**: Atomic knowledge nodes (e.g., `variables.assignment`, `strings.indexing`, `loops.while`).
- **Projects**: Multi-step applications consolidating module concepts (e.g., *Tip Calculator*, *Number Guessing Game*).
- **Challenges**: Standalone problem-solving exercises for practice mode.

---

## 15. Lesson Content Format

Curriculum source files are authored in declarative YAML files under `content/courses/` and tracked in Git. This ensures version control, peer review, and continuous testing of all course material.

### 15.1 Lesson Schema Example
```yaml
id: lesson-variables-01
slug: introduction-to-variables
title: Introduction to Variables
estimated_minutes: 10
module_slug: module-01-variables
course_slug: python-fundamentals
concept_ids:
  - variables.declaration
  - variables.assignment

sections:
  - type: markdown
    content: |
      In Python, a **variable** is like a labeled container that stores a value.
      You create a variable by giving it a name and assigning a value to it using `=`.

  - type: code_example
    language: python
    code: |
      name = "Alex"
      age = 18
      print(name)
      print(age)
    explanation: |
      Here, `name` holds the string `"Alex"`, and `age` holds the integer `18`.

  - type: exercise
    exercise_id: ex-variables-01
    title: Store Your First Variables
    instructions: |
      1. Create a variable named `player_name` and assign it your favorite name (as a string).
      2. Create a variable named `score` and assign it the number `100`.
      3. Print both variables.
    starter_code: |
      # Create your variables below:

    hints:
      - "Remember to use the assignment operator `=` to assign values."
      - "String values must be enclosed in quotes: player_name = 'Ada'"
      - "Numeric values do not use quotes: score = 100"
    visible_tests:
      - name: "player_name exists and is a string"
        assertion: "isinstance(player_name, str) and len(player_name) > 0"
      - name: "score exists and is 100"
        assertion: "isinstance(score, int) and score == 100"
```

---

## 16. Exercise System

### Supported Exercise Types
1. **Write Code**: Student writes code from scratch to satisfy behavioral specifications.
2. **Complete Code**: Student fills in blanks (`___`) to complete a broken or incomplete script.
3. **Fix the Bug**: Student diagnoses and corrects a deliberate syntax, type, or logical error.
4. **Predict Output**: Student selects or predicts what a given snippet will output before running it.
5. **Multiple Choice**: Concept check testing theoretical understanding without coding.
6. **Function Challenge**: Student defines a function meeting specific parameter and return value contracts.
7. **Mini Project**: Multi-step coding challenge with progressive milestone criteria.

---

## 17. Code Execution Architecture

```text
┌─────────────────┐      postMessage({ code, tests })      ┌─────────────────────────┐
│                 ├───────────────────────────────────────►│                         │
│  Monaco Editor  │                                        │   Web Worker Thread     │
│  (Main Thread)  │◄───────────────────────────────────────┤                         │
└─────────────────┘      postMessage({ stdout, stderr,     │   ┌─────────────────┐   │
                                       results, time })    │   │  Pyodide WASM   │   │
                                                           │   └────────┬────────┘   │
                                                           │            │            │
                                                           │     sys.stdout / stderr │
                                                           │     interceptor         │
                                                           └─────────────────────────┘
```

### 17.1 Web Worker Isolation
- **Non-Blocking UI**: Executing heavy student loops will never freeze the browser main thread or UI interactions.
- **Watchdog Timer**: The main thread tracks worker execution time. If execution exceeds 5,000ms, the worker is forcibly terminated (`worker.terminate()`), a timeout error is emitted to the user, and a fresh worker is initialized in the background.
- **Output Safeguard**: Stdout stream buffers are capped at 50,000 characters. If exceeded, output is truncated with `[Output limit reached - execution paused]`.

### 17.2 Virtual Filesystem
Pyodide runs within Emscripten's in-memory virtual filesystem (`MEMFS`). Lessons involving file operations (Module 13) can safely execute `open("notes.txt", "w")` without modifying or endangering the host machine.

---

## 18. Auto-Grading Architecture

### 18.1 Grading Principles
- **Behavioral Evaluation**: We inspect runtime variables, function returns, output streams, and AST nodes. We never perform exact string matching against solution code.
- **Namespace Inspection**: For basic variable and expression exercises, tests verify `globals()` state:
  ```python
  assert "player_name" in globals(), "player_name variable is not defined"
  assert isinstance(globals()["player_name"], str), "player_name should be a string"
  ```
- **Function Testing**: For function exercises, tests run multiple test cases with varying edge-case inputs:
  ```python
  assert add(2, 3) == 5, "add(2, 3) should return 5"
  assert add(-1, 1) == 0, "add(-1, 1) should return 0"
  assert add(0, 0) == 0, "add(0, 0) should return 0"
  ```

### 18.2 Client-Side vs Server-Side Trade-off
In the client-side Pyodide architecture (MVP), tests execute in the browser worker.
*Security limitation documented*: Astute learners can inspect browser memory or network traffic to read hidden tests. For MVP educational purposes, this trade-off is accepted to provide instantaneous grading with zero server compute costs. Future roadmap phases will introduce server-side containerized sandboxes for certification and competitive exams.

---

## 19. Progress Tracking

### 19.1 Granularity
- **Course Level**: Percentage of completed lessons and modules.
- **Module Level**: Lessons completed vs total lessons in the module.
- **Lesson Level**: `NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`. A lesson is marked `COMPLETED` when its required exercise is passed.
- **Exercise Level**: Attempts count, pass status, hints requested, solution viewed.

### 19.2 Solution Reveal Penalty
If a student clicks **Show Solution**, the field `solution_viewed` is set to `true`. While the exercise will allow progress to continue, mastery score credit is reduced, preventing users from simply copying answers to artificially inflate concept mastery.

---

## 20. Concept Mastery

Concept mastery measures deep understanding rather than mere completion.

### 20.1 Deterministic Mastery Calculation
For any given concept $C$:
$$\text{Mastery}(C) = \text{clamp}\left( 0.4 \times \text{Accuracy} + 0.3 \times \text{HintScore} + 0.3 \times \text{RecencyScore}, 0.0, 1.0 \right)$$

Where:
- $\text{Accuracy} = \frac{\text{Passed First Try}}{\text{Total Attempts}}$
- $\text{HintScore} = 1.0 - (0.2 \times \text{HintsUsed}) - (0.5 \times \text{SolutionViewed})$
- $\text{RecencyScore} = \exp\left( -\frac{\Delta t}{14\text{ days}} \right)$ (spaced repetition decay)

---

## 21. Practice System

The **Practice Mode** allows students to reinforce specific topics outside the linear course path.
- **Topic Filters**: Variables, Strings, Numbers, Conditions, Lists, Loops, Functions, Dictionaries, Error Handling.
- **Difficulty Tiers**: Easy, Medium, Hard.
- **Smart Queues**:
  - *Needs Review*: Concepts with mastery score $< 70\%$ or high decay.
  - *Previously Failed*: Exercises where multiple attempts were required before passing.
  - *Unsolved Drills*: Fresh exercises generated for targeted repetition.

---

## 22. Project-Based Learning

Mini-projects synthesize multiple concepts into a practical command-line or text-based program:
1. **Tip Calculator** (Variables, Data Types, Floats, `input()`)
2. **Username Generator** (Strings, Slicing, Methods, Random)
3. **Grade Calculator** (Conditions, Comparators, Logical Operators)
4. **Shopping List** (Lists, Indexing, Loops, Mutability)
5. **Number Guessing Game** (While Loops, Random, Branching)
6. **Contact Book** (Dictionaries, Key-Value lookup, CRUD)
7. **Notes Manager** (File I/O, Error Handling, Context Managers)
8. **Bank Account Simulator** (OOP, Classes, Methods, State)

Each project provides step-by-step milestones, automated milestone tests, and an open-ended playground.

---

## 23. AI Tutor Architecture

*(Scheduled for Phase 10 - Deferred until core platform is fully stabilized)*

### 23.1 Role & Guardrails
- **Socratic Guide**: Helps students understand syntax errors, conceptual bugs, and edge cases.
- **Strict Progressive Hint Hierarchy**:
  1. *Conceptual clarification* (What does this error mean?)
  2. *Area of focus* (Look at line 3; what is missing at the end of the line?)
  3. *Syntax reminder* (Recall that if-statements require a colon `:`).
  4. *Direct hint* (Add `:` after `x > 5`).
  5. *Solution code* (Only if student explicitly clicks "Give me the answer").

### 23.2 Context Boundary
When prompted, the tutor receives strictly bounded prompt context:
- Current lesson title & objectives
- Exercise instructions & test criteria
- Student's current code snippet
- Python interpreter error output (stdout / stderr)
- Number of hints already viewed
*Never sent*: User passwords, personal details, or other users' data.

---

## 24. Security Requirements

1. **Host Isolation**: No student code executes on backend servers.
2. **Worker Isolation**: In-browser code runs in Web Workers without access to `window`, `document`, cookies, or localStorage.
3. **Injection Prevention**: All database queries use SQLAlchemy parameter binding; no raw SQL string formatting.
4. **Strict Token Verification**: Every API endpoint verifies cryptographic signatures and expiration of Supabase JWTs.
5. **Secret Hygiene**: Zero secret tokens stored in repository; all loaded via environment variables validated by Pydantic settings.

---

## 25. Privacy Requirements

- **Student Submissions**: User code is considered private educational data; never shared publicly or indexed by search engines.
- **AI Training Opt-Out**: Student code is never used to train third-party AI models without explicit opt-in.
- **Account Deletion**: Users may trigger a GDPR/CCPA compliant purge of their account, deleting all profile records, exercise attempts, and progress data.

---

## 26. Performance

- **Lazy-Loaded Pyodide**: The Pyodide WASM payload (~15MB compressed) is only downloaded when a user enters a coding lesson, never on landing pages or dashboards.
- **Asset Caching**: Pyodide binaries and Python stdlib modules are cached in the browser via CacheStorage / ServiceWorker.
- **Targeted DB Queries**: Paginated queries and indexed lookups for user attempts and progress.

---

## 27. Accessibility

- **Keyboard Navigation**: The code editor supports standard keyboard escape sequences (`Esc` to exit editor focus).
- **High Contrast**: Dark and light themes maintain contrast ratios $\ge 4.5:1$ for text and $\ge 3:1$ for UI controls.
- **Screen Reader Support**: ARIA attributes on tab lists, test outcome indicators, and progress bars.

---

## 28. Testing Strategy

### 28.1 Backend Tests (`pytest`)
- Unit tests for service logic (Mastery calculation, XP awards, Streak tracking).
- Integration tests for API routes using `httpx.AsyncClient` and in-memory SQLite / test Postgres.
- Authentication authorization tests ensuring user data isolation.

### 28.2 Frontend Tests (`vitest` + React Testing Library)
- Component tests for `LessonView`, `MonacoEditor`, `TestResultsList`, and `HintAccordion`.
- Hook tests for `usePythonWorker` mocking worker events.

### 28.3 End-to-End Tests (`playwright`)
- Primary learning flow: Open lesson → write code → run → receive output → submit → pass → progress updates.
- Edge cases: Infinite loop termination, syntax error display, hint requests, solution reveal.

---

## 29. Observability

- **Structured Logging**: JSON-formatted logs with timestamp, log level, `requestId`, `userId` (where authenticated), `route`, and `durationMs`.
- **Health Checks**: `/api/v1/health` verifying database pool health and API readiness.
- **Error Boundaries**: Frontend React error boundaries preventing crashes and displaying friendly error reports.

---

## 30. CI/CD

- **GitHub Actions**:
  - Job 1: `governance` (Validates `process.md` update using `scripts/verify-process-update.mjs --ci`).
  - Job 2: `lint-and-typecheck` (Runs ESLint, Prettier, TypeScript `tsc --noEmit`, Ruff, Mypy).
  - Job 3: `backend-tests` (Executes pytest test suite).
  - Job 4: `frontend-tests` (Executes Vitest suite).
  - Job 5: `build` (Validates Next.js production build).

---

## 31. Environment Variables

All environment variables are declared in `.env.example`:
- `DATABASE_URL`: PostgreSQL connection string (asyncpg driver).
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_ANON_KEY`: Supabase client-side public API key.
- `SUPABASE_JWT_SECRET`: Secret used to verify JWT tokens on backend.
- `NEXT_PUBLIC_API_URL`: Backend API base URL for client fetch calls.
- `ENVIRONMENT`: `development` | `staging` | `production`.

---

## 32. Local Development

### Prerequisites
- Node.js $\ge 20$
- pnpm $\ge 9$
- Python $\ge 3.11$
- PostgreSQL or Supabase local container

### Setup Steps
```bash
# 1. Clone repository
git clone <repo-url> && cd pypath

# 2. Configure environment
cp .env.example .env

# 3. Install frontend dependencies
pnpm install

# 4. Set up backend virtual environment
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 5. Run database migrations
alembic upgrade head

# 6. Start development servers
# Terminal 1: Backend
uvicorn app.main:app --reload --port 8000
# Terminal 2: Frontend
pnpm --filter web dev
```

---

## 33. Deployment

- **Frontend**: Hosted on Vercel with automatic edge routing and CDN caching of static assets.
- **Backend**: Containerized with Docker and deployed to Google Cloud Run or Railway.
- **Database**: Supabase Managed PostgreSQL with automated backups.

---

## 34. Database Migration Rules

1. Every schema change must be accompanied by an Alembic migration (`alembic revision --autogenerate -m "..."`).
2. Migrations must be forward and backward compatible.
3. Never edit an existing migration that has already been applied in staging or production.
4. Down migrations (`downgrade()`) must be tested and fully functional.

---

## 35. Git Workflow

- **Branching Model**: Trunk-based development or short-lived feature branches (`feat/...`, `fix/...`, `docs/...`).
- **Commit Message Convention**: Conventional Commits:
  - `feat(editor): implement web worker timeout watchdog`
  - `fix(runtime): resolve memory leak in pyodide restart`
  - `docs(governance): record PROC-002 process update`
- **Pre-commit Requirement**: Must pass `scripts/verify-process-update.mjs`.

---

## 36. process.md Requirements

`process.md` is the chronological record of project development.
- Every meaningful change MUST append an entry formatted according to the template in Section 4.
- The `Current Status` block at the top of `process.md` must be updated on every change.
- Commits omitting `process.md` updates will be blocked by local Git hooks and rejected by CI.

---

## 37. Definition of Done

A task or feature is marked DONE only when:
- [ ] Code is implemented and adheres to technology conventions.
- [ ] Type annotations pass without errors.
- [ ] Automated tests (unit, integration, or E2E) are written.
- [ ] Automated tests have been executed and pass.
- [ ] Security and authorization policies are verified.
- [ ] Accessibility standards (keyboard, contrast) are satisfied.
- [ ] `process.md` has been updated with full audit trail.
- [ ] `tech.md` has been updated if architecture or conventions changed.

---

## 38. Current Development Phase

**Current Phase**: Phase 0 — Project Governance  
**Active Objective**: Establishing repository governance, single source of technical truth (`tech.md`), development ledger (`process.md`), agent instructions (`AGENTS.md`), contributor guidelines (`CONTRIBUTING.md`), and automated pre-commit / CI verification.

---

## 39. Full Product Roadmap

| Phase | Milestone | Scope | Status |
|---|---|---|---|
| **Phase 0** | **Project Governance** | Architecture docs, process rules, pre-commit enforcement, CI checks | **In Progress** |
| **Phase 1** | **Foundation** | Next.js app, FastAPI API, Postgres schema, Supabase Auth, health checks | Not Started |
| **Phase 2** | **Curriculum System** | Course/Module/Lesson models, YAML loader, lesson navigation | Not Started |
| **Phase 3** | **Python Runtime** | Monaco editor, Pyodide in Web Worker, timeout & output safeguards | Not Started |
| **Phase 4** | **Exercise Engine** | Auto-grader, behavioral tests, hint ladder, attempt logging | Not Started |
| **Phase 5** | **Progress System** | Lesson completion, course percentage, user dashboard | Not Started |
| **Phase 6** | **Concept Mastery** | Mastery tracking algorithm, review recommendations | Not Started |
| **Phase 7** | **Project-Based Learning** | Guided beginner mini-projects with milestone tests | Not Started |
| **Phase 8** | **Practice Mode** | Targeted drills, spaced repetition queues, difficulty filters | Not Started |
| **Phase 9** | **Gamification** | XP engine, learning streaks, milestone achievements | Not Started |
| **Phase 10**| **AI Tutor** | Socratic guidance, progressive hint generation, error explainer | Not Started |
| **Phase 11**| **Intermediate Curriculum**| Data structures, file management, OOP, standard libraries | Not Started |
| **Phase 12**| **Production Hardening**| Performance optimizations, accessibility audit, security scan | Not Started |
| **Phase 13**| **Deployment** | Vercel + Cloud Run / Railway + Supabase production deployment | Not Started |

---

## 40. Known Issues

*None recorded at repository initialization.*

---

## 41. Technical Debt

| Debt ID | Description | Reason Accepted | Risk | Remediation Plan |
|---|---|---|---|---|
| **DEBT-001** | Client-side test execution (Pyodide) allows hidden test inspection | Avoids server infrastructure cost & latency during MVP | Low for novice education; high for competitive certifications | Introduce disposable server-side sandboxes in Phase 12 for verified tests |

---

## 42. Architecture Decision Records (ADRs)

### ADR-001 — Use Pyodide and Web Workers for MVP Code Execution
- **Status**: Accepted
- **Context**: Need to execute untrusted student Python code safely, responsively, and cost-effectively.
- **Decision**: Run Python 3 via Pyodide (WASM) inside an isolated browser Web Worker with a 5-second watchdog timer.
- **Alternatives Considered**: Server-side Docker containers (high cost, high latency, scaling complexity), `exec()` in backend (critical security vulnerability, strictly prohibited).
- **Consequences**: Zero server compute costs; instantaneous response; non-blocking UI. Accepts client-side test visibility limitation for MVP.

### ADR-002 — FastAPI with SQLAlchemy Async for Backend Services
- **Status**: Accepted
- **Context**: Require a performant, typed backend for user progress, curriculum serving, and authentication verification.
- **Decision**: Adopt FastAPI (Python 3.11+) with SQLAlchemy 2.0 AsyncIO and Pydantic v2.
- **Alternatives Considered**: Node.js/Express, Django, Next.js Server Actions.
- **Consequences**: Python ecosystem alignment; high throughput async performance; automatic OpenAPI documentation.

### ADR-003 — Monaco Editor for In-Browser Code Editing
- **Status**: Accepted
- **Context**: Students need an industry-standard editing experience with Python syntax highlighting and keyboard shortcuts.
- **Decision**: Integrate Monaco Editor (`@monaco-editor/react`).
- **Alternatives Considered**: CodeMirror 6, Ace Editor.
- **Consequences**: Familiar VS Code keybindings, rich Python language features, higher initial bundle size (mitigated by lazy loading).

### ADR-004 — Supabase Auth with Server-Side JWT Verification
- **Status**: Accepted
- **Context**: Require secure, hassle-free authentication supporting Email/Password and Google OAuth.
- **Decision**: Use Supabase Auth for client authentication, verifying JWTs cryptographically in FastAPI.
- **Alternatives Considered**: Custom OAuth/bcrypt implementation, NextAuth.js.
- **Consequences**: Rapid implementation; secure delegation; zero plain text password handling.

### ADR-005 — Declarative YAML for Curriculum Storage
- **Status**: Accepted
- **Context**: Course lessons and exercises must be version-controlled, testable, and maintainable.
- **Decision**: Author lessons as structured YAML files validated against Pydantic schemas during build/seeding.
- **Alternatives Considered**: Direct database authoring, hardcoded React components, MDX.
- **Consequences**: Peer-reviewable curriculum in Git, testable in CI, decoupled from UI presentation.

### ADR-006 — Deterministic Multi-Factor Mastery Scoring Algorithm
- **Status**: Accepted
- **Context**: Need to calculate concept mastery without expensive or unpredictable machine learning models.
- **Decision**: Implement a weighted deterministic formula combining first-attempt accuracy, hint deductions, and exponential time decay.
- **Alternatives Considered**: Naive percentage completed, Bayesian Knowledge Tracing (BKT).
- **Consequences**: Transparent to students, zero training overhead, immediately actionable review queue.

### ADR-007 — Constrained AI Tutor Context and Progressive Hint Hierarchy
- **Status**: Accepted
- **Context**: Generative AI assistance must facilitate active learning rather than providing immediate answers.
- **Decision**: Enforce a strict 5-stage hint hierarchy with bounded system prompts containing only current lesson and execution error data.
- **Alternatives Considered**: Unconstrained open-ended chat assistant.
- **Consequences**: Preserves educational rigor; prevents AI from completing student assignments.

---

## 43. Future Features

- **Disposable Cloud Sandboxes**: Isolated micro-VMs (e.g., Firecracker / gVisor) for running network-enabled, multi-file Python applications.
- **Collaborative Pair Programming**: Real-time shared editor sessions with audio/text chat for peer learning.
- **Interactive Python Debugger**: Visual step-through execution showing memory stack, variable frames, and pointer references.
- **Custom Teacher Classrooms**: Teacher portals for assigning custom problem sets and tracking student cohorts.

---

## 44. New Developer Onboarding

Welcome to PyPath! To get up to speed:
1. Read `README.md` for high-level product context.
2. Read `tech.md` (this document) to understand system architecture and non-negotiable rules.
3. Read `process.md` to see recent changes, active focus, and current roadmap state.
4. Run `node scripts/verify-process-update.mjs` to test governance tooling.
5. Follow Section 32 (*Local Development*) to configure your local environment.

---

## 45. AI Coding Agent Rules

All AI coding assistants (including Antigravity, Claude, ChatGPT, Cursor, Copilot) operating on this repository MUST strictly follow these rules:

1. **Context First**: Always read `tech.md`, `process.md`, and `AGENTS.md` before generating or modifying code.
2. **Never Skip `process.md`**: Any code or configuration modification MUST include an accompanying entry in `process.md`.
3. **No Phantom Claims**: Never state that tests passed unless you have explicitly executed them and verified the output.
4. **Preserve Architecture**: Do not arbitrarily introduce new frameworks, state managers, or libraries without drafting an ADR in `tech.md`.
5. **Enforce Security Boundaries**: Never use `eval()` or `exec()` in backend code.
6. **Maintain Code Style**: Use strict TypeScript types (no `any`) and Python type hints (Pydantic v2 / typing).
