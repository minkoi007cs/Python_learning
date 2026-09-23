# Contributing to PyPath

Thank you for your interest in contributing to **PyPath**! PyPath is an open-source, interactive Python learning platform engineered to help novices transition into capable Python developers through active learning.

Because PyPath is engineered with production standards and long-term maintainability in mind, all human contributors and automated agents must adhere to the processes outlined below.

---

## 1. Core Engineering Commandments

1. **Safety First**: Arbitrary student code must **NEVER** run inside the backend server (`exec()`, `eval()`). All student code execution takes place via Pyodide inside isolated browser Web Workers.
2. **Behavioral Grading**: Exercises are graded based on behavioral assertions against runtime variables, functions, and standard output—never plain-text string equality.
3. **The `process.md` Rule**: Every PR or commit containing application code, configuration, database changes, or curriculum updates **MUST** include an update to `process.md`. A Git hook enforces this locally, and GitHub Actions enforces it in CI.
4. **The `tech.md` Rule**: If your contribution alters system architecture, technology choices, database structure, or API contracts, you must update `tech.md`.

---

## 2. Local Development Setup

### Prerequisites
- **Node.js**: $\ge 20.0.0$
- **pnpm**: $\ge 9.0.0$
- **Python**: $\ge 3.11$
- **Git**: $\ge 2.30$

### Setup Instructions
```bash
# 1. Clone the repository
git clone https://github.com/your-username/pypath.git
cd pypath

# 2. Configure Git hooks
git config core.hooksPath .husky
chmod +x scripts/verify-process-update.mjs .husky/pre-commit

# 3. Copy environment configuration
cp .env.example .env

# 4. Install dependencies
pnpm install

# 5. Set up Python backend (apps/api)
cd apps/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## 3. Git & Commit Guidelines

We enforce **Conventional Commits**:

```text
<type>(<scope>): <short description>
```

### Allowed Types
- `feat`: A new user-facing feature or pedagogical capability.
- `fix`: A bug fix in the application, runner, or curriculum.
- `docs`: Documentation updates (`tech.md`, `README.md`, comments).
- `test`: Adding or updating test suites.
- `refactor`: Code refactoring without behavioral changes.
- `perf`: Performance optimizations (e.g., Pyodide loading speed).
- `chore`: Tooling, dependency updates, or CI configuration.

### Commit Workflow
Before committing:
1. Stage your changed files:
   ```bash
   git add apps/web/some-file.tsx
   ```
2. Open `process.md`:
   - Update the `Current Status` block at the top.
   - Append a new `PROC-XXX` entry recording your changes, reasons, and test results.
3. Stage `process.md`:
   ```bash
   git add process.md
   ```
4. Commit:
   ```bash
   git commit -m "feat(editor): integrate pyodide worker watchdog"
   ```

If you forget to stage `process.md`, the pre-commit hook will reject the commit.

---

## 4. Pull Request Checklist

When submitting a Pull Request, ensure:
- [ ] Code is formatted and passes linting (`pnpm lint`, `ruff check`).
- [ ] TypeScript types pass without errors (`pnpm typecheck`).
- [ ] Unit and integration tests are added and passing (`pytest`, `vitest`).
- [ ] `process.md` contains an accurate entry detailing your changes.
- [ ] `tech.md` is updated if architectural decisions or models were altered.
- [ ] PR title follows Conventional Commits.
