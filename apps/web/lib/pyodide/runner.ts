/**
 * Pyodide Worker Manager with Watchdog Timeout Protection and Friendly Error Formatting.
 */

import { ExecutionResult, ExerciseTest, TestSuiteResult } from "../types";

export type WorkerStatus = "UNINITIALIZED" | "LOADING" | "READY" | "RUNNING" | "ERROR" | "TIMEOUT";

export class PythonRunner {
  private worker: Worker | null = null;
  private status: WorkerStatus = "UNINITIALIZED";
  private onStatusChange?: (status: WorkerStatus, message?: string) => void;
  private pendingRequests = new Map<string, { resolve: Function; reject: Function; timeoutId: any }>();
  private readonly TIMEOUT_MS = 5000;

  constructor(onStatusChange?: (status: WorkerStatus, message?: string) => void) {
    this.onStatusChange = onStatusChange;
  }

  public init(): void {
    if (typeof window === "undefined" || this.worker) return;

    try {
      this.setStatus("LOADING", "Initializing Python runtime...");
      // Instantiate worker from static or inline blob
      this.worker = new Worker(new URL("../../workers/python.worker.ts", import.meta.url), {
        type: "module",
      });

      this.worker.onmessage = (event: MessageEvent) => {
        const { type, id, status, message, ...data } = event.data;

        if (type === "STATUS") {
          this.setStatus(status, message);
          return;
        }

        if (id && this.pendingRequests.has(id)) {
          const req = this.pendingRequests.get(id)!;
          clearTimeout(req.timeoutId);
          this.pendingRequests.delete(id);
          this.setStatus("READY");
          req.resolve(data);
        }
      };

      this.worker.onerror = (err) => {
        console.error("Worker internal error:", err);
        this.setStatus("ERROR", "Worker encountered an unhandled error");
      };

      this.worker.postMessage({ action: "INIT" });
    } catch (err: any) {
      this.setStatus("ERROR", err.message || "Failed to create Web Worker");
    }
  }

  private setStatus(status: WorkerStatus, message?: string): void {
    this.status = status;
    if (this.onStatusChange) {
      this.onStatusChange(status, message);
    }
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    // Reject any pending requests
    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timeoutId);
      req.reject(new Error("Worker terminated"));
    }
    this.pendingRequests.clear();
    this.setStatus("UNINITIALIZED");
  }

  public restart(): void {
    this.terminate();
    this.init();
  }

  public async runCode(code: string): Promise<ExecutionResult> {
    if (!this.worker) this.init();
    const id = Math.random().toString(36).substring(7);

    return new Promise((resolve, reject) => {
      this.setStatus("RUNNING");

      const timeoutId = setTimeout(() => {
        console.warn(`[PythonRunner Watchdog]: Code execution exceeded ${this.TIMEOUT_MS}ms. Terminating worker.`);
        this.restart();
        this.setStatus("TIMEOUT", "Execution timed out (5s limit reached). Terminated runaway loop.");
        resolve({
          stdout: "",
          stderr: "Your program ran for too long (over 5 seconds) and was safely stopped to prevent freezing.",
          executionTimeMs: this.TIMEOUT_MS,
          error: "TIMEOUT",
        });
      }, this.TIMEOUT_MS);

      this.pendingRequests.set(id, { resolve, reject, timeoutId });
      this.worker?.postMessage({ action: "RUN_CODE", id, code });
    });
  }

  public async runTests(code: string, tests: ExerciseTest[]): Promise<TestSuiteResult> {
    if (!this.worker) this.init();
    const id = Math.random().toString(36).substring(7);

    return new Promise((resolve, reject) => {
      this.setStatus("RUNNING");

      const timeoutId = setTimeout(() => {
        console.warn(`[PythonRunner Watchdog]: Test execution exceeded ${this.TIMEOUT_MS}ms. Terminating worker.`);
        this.restart();
        this.setStatus("TIMEOUT", "Test execution timed out.");
        resolve({
          passed: false,
          results: [
            {
              name: "Timeout Guard",
              passed: false,
              errorMessage: "Tests exceeded execution time limit of 5000ms.",
            },
          ],
          stdout: "",
          stderr: "Execution timed out.",
          executionTimeMs: this.TIMEOUT_MS,
        });
      }, this.TIMEOUT_MS);

      this.pendingRequests.set(id, { resolve, reject, timeoutId });
      this.worker?.postMessage({ action: "RUN_TESTS", id, code, tests });
    });
  }

  public static translateError(stderr: string): string {
    if (!stderr) return "";
    if (stderr.includes("SyntaxError")) {
      return "💡 Syntax Tip: Check for missing quotes, unmatched parentheses (), brackets [], or a missing colon : at the end of a header line.";
    }
    if (stderr.includes("NameError")) {
      return "💡 NameError Tip: Python encountered a variable or function name that has not been defined yet. Check spelling and capitalization!";
    }
    if (stderr.includes("TypeError")) {
      return "💡 TypeError Tip: An operation was attempted on incompatible types (e.g. adding a string to an integer). Use int(), float(), or str() to convert types.";
    }
    if (stderr.includes("IndexError")) {
      return "💡 IndexError Tip: You tried to access an index that doesn't exist in the sequence. Remember Python sequences are zero-indexed from 0 to len - 1.";
    }
    if (stderr.includes("KeyError")) {
      return "💡 KeyError Tip: The requested key was not found in the dictionary. Consider using .get(key, default) for safe lookups.";
    }
    if (stderr.includes("ZeroDivisionError")) {
      return "💡 Math Tip: Cannot divide by zero. Check your division operand or condition.";
    }
    return "";
  }
}
