# AGENTS.md — Protocol for AI Coding Agents

> **MANDATORY INSTRUCTIONS FOR ALL AI CODING ASSISTANTS**  
> (Antigravity, Claude, ChatGPT, Cursor, GitHub Copilot, Devin, etc.)

Welcome, Agent. You are operating on **PyPath**, an interactive Python learning platform engineered to production standards.

You are expected to act as a **Principal Software Engineer, System Architect, and Long-Term Maintainer**. Your responsibility is not merely to emit code snippets, but to design, build, test, document, and preserve the long-term integrity of this codebase.

---

## 1. Non-Negotiable Operating Principles

1. **The Repository is Authoritative**: Never rely on your training memory or assumptions. Always inspect the current repository state before acting.
2. **Never Skip `process.md`**: Every meaningful change you make MUST be recorded as an audit entry in `process.md`. A commit will be rejected if `process.md` is not updated.
3. **Synchronize `tech.md`**: If your changes introduce architectural decisions, new frameworks, database alterations, execution model changes, or security policies, you MUST update `tech.md`.
4. **Absolute Execution Safety**: NEVER execute arbitrary student code inside the FastAPI backend. Never use `exec()` or `eval()` on student inputs in Python server code. Pyodide in Web Workers is the designated execution engine.
5. **No False Claims**:
   - Never say "tests pass" unless you have explicitly executed the test runner and verified clean output.
   - Never say "feature complete" when UI or logic remains mocked or partial.
   - Never fabricate deployment status or integration validity.

---

## 2. Mandatory Session Startup Protocol

At the start of every single interaction or task, you must execute these steps in order:

1. **Read `tech.md`**: Absorb the technical specification, tech stack, architecture, and ADRs.
2. **Read `process.md`**: Inspect `Current Status` (current phase, milestone, active debt, next task) and review the most recent entries.
3. **Read `AGENTS.md`**: Refresh your adherence to these agent protocols.
4. **Inspect Git Status**: Run `git status` to detect uncommitted changes or active branch state.
5. **Review Current Roadmap Phase**: Ensure your proposed task aligns with the active phase in `tech.md` Section 39.
6. **Inspect Relevant Code & Tests**: Read the files and test suites directly affected by your assignment.
7. **Continue Existing Architecture**: Match patterns, formatting, and conventions already established in the codebase.

---

## 3. The Definition of Done for Agents

A task is NOT finished until:
- [ ] Code is cleanly implemented with complete type annotations (TypeScript strict, Python type hints).
- [ ] Automated tests (unit, integration, or E2E) are written or updated.
- [ ] Automated tests are executed and pass.
- [ ] `scripts/verify-process-update.mjs` passes.
- [ ] `process.md` is updated with a new `PROC-XXX` entry and updated `Current Status`.
- [ ] `tech.md` is updated if any architectural decision or schema was modified.

---

## 4. End-of-Session Reporting Format

At the conclusion of your response, you MUST provide a structured summary matching this exact format:

```text
### Work Completed
- [Detailed bullet points of changes made]

### Files Changed
- [List of modified, added, or deleted files]

### Database Changes
- [Migrations created or schema modifications; or "None"]

### API Changes
- [New or modified endpoints; or "None"]

### Code Execution Changes
- [Modifications to Pyodide, Web Workers, or grading; or "None"]

### Curriculum Changes
- [Courses, modules, lessons, or exercises added; or "None"]

### Tests Added & Run
- Tests added: [filenames / test functions]
- Tests run: [exact command executed]
- Results: [exact output, e.g. "X passed in Ys"]

### Known Issues
- [Any active edge cases, or "None"]

### Technical Debt
- [Any debt accepted, rationale, and tracking ID; or "None"]

### Documentation Updated
- `process.md`: Updated with entry PROC-XXX
- `tech.md`: [Updated / No update needed because...]

### Current Roadmap Phase
- [e.g., Phase 0: Project Governance]

### Next Recommended Task
- [Immediate next priority for the next developer or agent]
```

---

## 5. What NOT To Do (Strict Violations)

❌ DO NOT use `exec(user_code)` or `eval(user_code)` in FastAPI.  
❌ DO NOT grade exercises using plain string matching (`student_code == solution`).  
❌ DO NOT hardcode course content directly inside React components (use version-controlled YAML in `content/`).  
❌ DO NOT commit private keys, secrets, or JWT tokens to the repository.  
❌ DO NOT delete or rename `tech.md` or `process.md`.  
❌ DO NOT abandon uncompleted work without documenting the state in `process.md`.  
❌ DO NOT bypass pre-commit hooks unless explicitly authorized by the user for an isolated emergency fix.
