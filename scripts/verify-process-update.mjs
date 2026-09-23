#!/usr/bin/env node

/**
 * scripts/verify-process-update.mjs
 * 
 * Pre-commit & CI verification script for PyPath.
 * Enforces that every meaningful development change is documented in process.md.
 */

import { execSync } from "node:child_process";
import process from "node:process";

const isCi = process.argv.includes("--ci");

function getChangedFiles() {
  try {
    if (isCi) {
      // In CI, determine comparison target
      const baseRef = process.env.GITHUB_BASE_REF;
      if (baseRef) {
        // Pull Request: compare against target base branch
        return execSync(`git diff --name-only origin/${baseRef}...HEAD`, { encoding: "utf8" })
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean);
      }
      // Push event or fallback: compare against previous commit
      try {
        return execSync("git diff --name-only HEAD~1 HEAD", { encoding: "utf8" })
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean);
      } catch {
        // If shallow or first commit, list all files in HEAD
        return execSync("git ls-tree -r --name-only HEAD", { encoding: "utf8" })
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean);
      }
    } else {
      // Local pre-commit: inspect staged files
      return execSync("git diff --cached --name-only", { encoding: "utf8" })
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);
    }
  } catch (err) {
    console.error("Error detecting changed files with git:", err.message);
    process.exit(1);
  }
}

const changedFiles = getChangedFiles();

// If no files are staged / changed, allow commit to proceed
if (changedFiles.length === 0) {
  process.exit(0);
}

const isProcessUpdated = changedFiles.includes("process.md");

// List of file patterns or paths that represent meaningful changes
function isMeaningfulChange(filePath) {
  // Exclude documentation-only changes that do not alter architecture or core behavior
  const harmlessDocs = [
    "README.md",
    "CONTRIBUTING.md",
    "AGENTS.md",
    ".gitignore",
  ];

  if (harmlessDocs.includes(filePath) || filePath.startsWith("docs/")) {
    return false;
  }

  // Any changes in apps, content, packages, scripts, core configs require process.md update
  if (
    filePath.startsWith("apps/") ||
    filePath.startsWith("content/") ||
    filePath.startsWith("packages/") ||
    filePath.startsWith("scripts/") ||
    filePath.startsWith(".github/") ||
    filePath === "package.json" ||
    filePath === "pnpm-workspace.yaml" ||
    filePath === ".env.example" ||
    filePath === "tech.md"
  ) {
    return true;
  }

  return true;
}

const meaningfulChanges = changedFiles.filter(
  (f) => f !== "process.md" && isMeaningfulChange(f)
);

if (meaningfulChanges.length > 0 && !isProcessUpdated) {
  console.error("\n" + "=".repeat(76));
  console.error("❌ ERROR: process.md must be updated before committing.");
  console.error("=".repeat(76));
  console.error("\nMeaningful changes detected without an update to process.md:\n");
  meaningfulChanges.forEach((f) => console.error(`  • ${f}`));
  console.error("\nEvery meaningful PyPath change must document:");
  console.error("  - What changed and why");
  console.error("  - Features added, modified, or removed");
  console.error("  - Tests added and test execution results");
  console.error("  - Current project state and next recommended task");
  console.error("\nPlease add/append an entry to process.md, stage it, and retry:\n");
  console.error("  git add process.md");
  console.error("=".repeat(76) + "\n");
  process.exit(1);
}

console.log("✓ Process update check passed.");
process.exit(0);
