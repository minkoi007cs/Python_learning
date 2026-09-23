# PyPath Development Process

## Current Status

Current Phase: Phase 0 — Project Governance
Current Milestone: Repository Governance & Architecture Initialization
Current Branch: main
Current Focus: Setting up governance controls, single source of technical truth, pre-commit enforcement, and CI validation
Last Completed Feature: Project Governance Setup (PROC-001)
Current Known Issues: None
Current Technical Debt: DEBT-001 (Client-side Pyodide test execution allows browser memory inspection of hidden tests)
Next Recommended Task: Phase 1 — Initialize foundational FastAPI backend and Next.js frontend projects

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
