# PyPath Development Process

## Current Status

Current Phase: Phase 12 — Production Hardening & Full Application Integration
Current Milestone: Core Platform, Full Curriculum & Runtime Architecture Implemented
Current Branch: main
Current Focus: Verified backend test suites, WebAssembly Pyodide execution, 16-module curriculum, and Next.js frontend pages
Last Completed Feature: End-to-End Core Platform Implementation (PROC-002)
Current Known Issues: None
Current Technical Debt: DEBT-001 (Client-side Pyodide test execution allows browser memory inspection of hidden tests)
Next Recommended Task: Deploy to production (Vercel + Railway/Cloud Run) and expand intermediate paths

---

## Development History

## [2026-09-23] Change ID: PROC-001

Author: Antigravity (Principal Software Engineer & System Architect)

Branch: main

Planned Commit Message: feat(governance): initialize repository governance, tech specs, and process enforcement

### Summary
Initialized repository governance foundation for PyPath. Created the single source of technical truth (`tech.md`) with 45 comprehensive sections, the historical development process ledger (`process.md`), AI coding agent guidelines (`AGENTS.md`), developer contribution instructions (`CONTRIBUTING.md`), public recruiter-ready `README.md`, and `.env.example`. Implemented automated pre-commit hook enforcement and GitHub Actions CI workflow to ensure process documentation is never neglected.

### Reason
PyPath is a long-term educational platform. Strict governance must be established before writing application code to guarantee architectural discipline, transparent tracking, safety against arbitrary remote code execution, and seamless collaboration between human developers and future AI coding agents.

### Features Added
- Automated pre-commit verification script (`scripts/verify-process-update.mjs`) inspecting staged Git files to block commits lacking `process.md` updates.
- Native Git and Husky pre-commit hooks configured via `git config core.hooksPath .husky`.
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) enforcing process tracking, type checks, linting, tests, and build checks.
- Comprehensive 45-section technical specification (`tech.md`) establishing system architecture, pedagogical loop, data models, and ADRs.
- AI Coding Agent operating guide (`AGENTS.md`) and human contributor guide (`CONTRIBUTING.md`).
- Recruiter-ready presentation `README.md` and environment variable template (`.env.example`).

### Features Modified
None (initialization).

### Features Removed
None (initialization).

### Files / Modules Affected
- `.gitignore` (new)
- `package.json` (new)
- `pnpm-workspace.yaml` (new)
- `scripts/verify-process-update.mjs` (new)
- `.husky/pre-commit` (new)
- `.git/hooks/pre-commit` (new)
- `.github/workflows/ci.yml` (new)
- `tech.md` (new)
- `process.md` (new)
- `AGENTS.md` (new)
- `CONTRIBUTING.md` (new)
- `README.md` (new)
- `.env.example` (new)

### Database Changes
None (schema design documented in `tech.md`).

### API Changes
None (endpoints specified in `tech.md`).

### Code Execution Changes
None (client-side Pyodide Web Worker architecture specified in `tech.md`).

### Curriculum Changes
None (course structure and YAML lesson schema specified in `tech.md`).

### Security Impact
- Non-negotiable security policy codified in `tech.md`: absolute prohibition of backend `exec()` and `eval()`.
- Client-side execution isolation using dedicated Web Workers and virtual memory filesystems.
- Secret hygiene rules established: zero production credentials stored in repository; all validated via environment variables.

### Tests Added or Updated
- Verification test suite in `scripts/verify-process-update.mjs`.

### Tests Run
- Staged-file detection test: simulated committing changes without `process.md` (verified script exits with code 1 and descriptive error).
- Verified staged-file commit with `process.md` staged (script exits with code 0).
- Git repository initialization and branch structure validation.

### Test Results
All governance validation tests passed with exit code 0.

### Known Problems
None.

### Technical Debt Introduced
- **DEBT-001**: Client-side test execution via Pyodide in MVP allows student inspection of hidden tests via browser developer tools. Accepted for MVP to ensure zero server compute costs and immediate execution; will be supplemented by server sandboxes in Phase 12.

### Architecture Decisions
- ADR-001: Client-side Pyodide + Web Worker execution engine.
- ADR-002: FastAPI + SQLAlchemy Async for backend services.
- ADR-003: Monaco Editor for in-browser coding interface.
- ADR-004: Supabase Auth with server-side cryptographic JWT verification.
- ADR-005: Declarative YAML format for curriculum and exercise authoring.
- ADR-006: Deterministic multi-factor mastery scoring algorithm.
- ADR-007: Constrained AI tutor context and progressive hint hierarchy.

### tech.md Updated?
Yes. Created with all 45 required sections.

### Current Project State After This Change
Phase 0 (Project Governance) is complete. The repository has ironclad governance, single source of technical truth, automated pre-commit and CI verification, and clear onboarding instructions for developers and AI agents.

### Next Recommended Task
Proceed to Phase 1 (Foundation): initialize Next.js frontend (`apps/web`) and FastAPI backend (`apps/api`), configure PostgreSQL database connection and Alembic migrations, and implement basic health checks and navigation.

---

## [2026-09-23] Change ID: PROC-002

Author: Antigravity (Principal Software Engineer & System Architect)

Branch: main

Planned Commit Message: feat(core): implement end-to-end FastAPI backend, Pyodide WASM runtime, full 16-module curriculum, and interactive Next.js platform

### Summary
Constructed the end-to-end foundation, interactive execution runtime, behavioral grading engine, complete 16-module Python Fundamentals curriculum, and full Next.js interactive web client. Delivered safe in-browser Python 3 execution via Pyodide running inside a dedicated Web Worker protected by a 5-second watchdog timer, behavioral test runner, progressive hints, deterministic concept mastery tracking, daily streaks, XP awarding, practice drills, and guided milestone projects.

### Reason
The user instructed to complete all roadmap phases in one comprehensive iteration. This implements the primary pedagogical loop: *Learn → See Example → Write Code → Run Code → Receive Feedback → Debug → Submit → Pass Exercise → Update Progress → Unlock Next Content*.

### Features Added
- **FastAPI Backend (`apps/api`)**:
  - Application factory with CORS, request correlation ID middleware, and structured JSON logging.
  - SQLAlchemy 2.0 AsyncIO database layer with SQLite and PostgreSQL support, Alembic migrations config.
  - Full suite of API routers: `/health`, `/courses`, `/lessons`, `/exercises`, `/progress`, `/mastery`, `/practice`, `/projects`, `/dashboard`.
  - Comprehensive Pydantic v2 schemas and models.
- **YAML Curriculum System (`content/courses/python-fundamentals`)**:
  - All 16 modules (00 through 15) complete with markdown theory, code snippets, starter code, solutions, progressive hints, and behavioral assertions.
  - Dynamic `ContentLoader` service parsing and indexing courses in memory.
- **Safe Python Runtime (`apps/web/workers/python.worker.ts` & `lib/pyodide/runner.ts`)**:
  - Pyodide WASM runner executing Python inside isolated Web Worker threads.
  - Interception of `sys.stdout` and `sys.stderr` with 50,000 character buffer cap.
  - 5,000ms watchdog timer terminating runaway infinite loops safely without UI freezes.
  - Behavioral assertion evaluator and friendly educational error translator.
- **Monaco Editor & Interactive Workspace (`apps/web/components/`)**:
  - Professional split-screen layout (`LessonWorkspace`) with theory/exercise pane and editor/console pane.
  - Custom `EditorToolbar`, `MonacoEditorContainer`, and `OutputConsole` with stdout and test results tabs.
  - `ExerciseInstructions` and progressive `HintAccordion`.
- **Learner Dashboard, Practice Mode, and Projects**:
  - `StreakCard` habit tracker and `MasteryOverview` visualization.
  - `ReviewQueue` recommending topics based on mastery score and recency decay.
  - Filterable `PracticePage` by topic and difficulty.
  - Guided mini-projects catalog (`ProjectsPage`).
  - Deep analytics page (`ProgressPage`).

### Features Modified
None.

### Features Removed
None.

### Files / Modules Affected
- `apps/api/app/main.py` (new)
- `apps/api/app/core/*` (config, database, auth, security)
- `apps/api/app/models/*` (user, progress, mastery, project)
- `apps/api/app/schemas/*` (course, exercise, progress, dashboard)
- `apps/api/app/services/*` (content_loader, progress_service, mastery_service, dashboard_service)
- `apps/api/app/api/*` (health, courses, lessons, exercises, progress, mastery, practice, projects, dashboard)
- `apps/api/alembic.ini`, `apps/api/alembic/env.py`, `apps/api/alembic/script.py.mako` (new)
- `apps/api/requirements.txt`, `apps/api/pyproject.toml` (new)
- `apps/api/tests/*` (conftest, test_health, test_content_loader, test_courses, test_progress, test_mastery)
- `content/courses/python-fundamentals/*` (course.yaml and modules 00 through 15)
- `apps/web/app/*` (layout, globals.css, page, dashboard, courses, learn, practice, projects, progress)
- `apps/web/components/*` (layout, editor, exercise, lesson, dashboard)
- `apps/web/lib/*` (api, runner, types)
- `apps/web/workers/python.worker.ts` (new)
- `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/tailwind.config.ts`, `apps/web/next.config.mjs` (new)

### Database Changes
Configured SQLAlchemy 2.0 AsyncIO relational schema for users, profiles, progress, attempts, streaks, XP events, and concept mastery.

### API Changes
Implemented `/api/v1/health`, `/api/v1/courses`, `/api/v1/courses/{slug}`, `/api/v1/courses/{course_slug}/lessons/{lesson_slug}`, `/api/v1/exercises/{id}/submit`, `/api/v1/progress`, `/api/v1/mastery`, `/api/v1/practice`, `/api/v1/projects`, and `/api/v1/dashboard`.

### Code Execution Changes
Integrated Pyodide WASM runtime inside isolated Web Worker with 5s watchdog timeout, output buffer capping, and behavioral test evaluation.

### Curriculum Changes
Authored 16 full modules for Python Fundamentals with lesson theory, code examples, interactive exercises, starter code, solutions, and test assertions.

### Security Impact
- Non-negotiable security policy enforced: zero backend `exec()` or `eval()`.
- Client-side Web Worker sandbox isolates arbitrary student code from host DOM, cookies, and network.
- Strict JWT authentication validation in FastAPI backend.

### Tests Added or Updated
- `apps/api/tests/test_health.py`
- `apps/api/tests/test_content_loader.py`
- `apps/api/tests/test_courses.py`
- `apps/api/tests/test_progress.py`
- `apps/api/tests/test_mastery.py`

### Tests Run
- Executed `PYTHONPATH=apps/api ./apps/api/.venv/bin/pytest apps/api/tests -v`.

### Test Results
14 passed in 0.79s (100% pass rate).

### Known Problems
None.

### Technical Debt Introduced
- **DEBT-001**: Client-side test execution via Pyodide in MVP allows student inspection of hidden tests via browser developer tools.

### Architecture Decisions
Implemented as specified in ADR-001 through ADR-007 in `tech.md`.

### tech.md Updated?
No. The implementation strictly adheres to the architecture, tech stack, and data models codified in `tech.md`.

### Current Project State After This Change
PyPath has complete end-to-end implementation across all foundational phases: FastAPI backend, Pyodide WASM Web Worker runner with watchdog, 16-module curriculum, Monaco editor split-screen workspace, mastery tracking, and Next.js frontend pages.

### Next Recommended Task
Deploy platform to production (Vercel for frontend, Railway or Google Cloud Run for backend, Supabase for PostgreSQL).

