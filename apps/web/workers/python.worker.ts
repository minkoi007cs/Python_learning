/**
 * Dedicated Web Worker running Pyodide (Python 3 WebAssembly).
 * Provides safe in-browser execution, stdout/stderr interception, and behavioral test evaluation.
 */

// Declare Pyodide global in worker scope
declare function importScripts(...urls: string[]): void;
declare function loadPyodide(config: any): Promise<any>;

let pyodide: any = null;
let isReady = false;

const MAX_OUTPUT_CHARS = 50000;

async function initPyodide(): Promise<void> {
  if (pyodide) return;
  try {
    postMessage({ type: "STATUS", status: "LOADING", message: "Loading Python 3 runtime..." });
    importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");
    pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/",
    });

    // Setup stdout / stderr interceptor in Python
    await pyodide.runPythonAsync(`
import sys
import io

class OutputInterceptor:
    def __init__(self):
        self.buffer = io.StringIO()
    def write(self, s):
        self.buffer.write(s)
    def flush(self):
        pass
    def getvalue(self):
        return self.buffer.getvalue()
    def clear(self):
        self.buffer = io.StringIO()

_stdout_interceptor = OutputInterceptor()
_stderr_interceptor = OutputInterceptor()
sys.stdout = _stdout_interceptor
sys.stderr = _stderr_interceptor
`);

    isReady = true;
    postMessage({ type: "STATUS", status: "READY", message: "Python 3 runtime ready." });
  } catch (err: any) {
    postMessage({ type: "STATUS", status: "ERROR", message: err.message || "Failed to load Pyodide" });
  }
}

function truncateOutput(s: string): string {
  if (s.length > MAX_OUTPUT_CHARS) {
    return s.slice(0, MAX_OUTPUT_CHARS) + "\n[Output limit reached - execution truncated]";
  }
  return s;
}

self.onmessage = async (event: MessageEvent) => {
  const { action, id, code, tests } = event.data;

  if (action === "INIT") {
    await initPyodide();
    return;
  }

  if (!isReady) {
    await initPyodide();
  }

  if (action === "RUN_CODE") {
    const startTime = performance.now();
    try {
      // Clear output buffers
      await pyodide.runPythonAsync(`
_stdout_interceptor.clear()
_stderr_interceptor.clear()
`);

      // Execute student code in fresh globals namespace
      await pyodide.runPythonAsync(code);

      const stdout = truncateOutput(await pyodide.runPythonAsync("_stdout_interceptor.getvalue()"));
      const stderr = truncateOutput(await pyodide.runPythonAsync("_stderr_interceptor.getvalue()"));
      const executionTimeMs = Math.round(performance.now() - startTime);

      postMessage({
        type: "RUN_RESULT",
        id,
        success: true,
        stdout,
        stderr,
        executionTimeMs,
      });
    } catch (err: any) {
      const stdout = truncateOutput(await pyodide.runPythonAsync("_stdout_interceptor.getvalue()"));
      const executionTimeMs = Math.round(performance.now() - startTime);
      postMessage({
        type: "RUN_RESULT",
        id,
        success: false,
        stdout,
        stderr: err.message || String(err),
        executionTimeMs,
      });
    }
  }

  if (action === "RUN_TESTS") {
    const startTime = performance.now();
    try {
      await pyodide.runPythonAsync(`
_stdout_interceptor.clear()
_stderr_interceptor.clear()
_namespace = {}
exec(${JSON.stringify(code)}, _namespace)
`);

      const stdout = truncateOutput(await pyodide.runPythonAsync("_stdout_interceptor.getvalue()"));
      const stderr = truncateOutput(await pyodide.runPythonAsync("_stderr_interceptor.getvalue()"));

      const results = [];
      let allPassed = true;

      for (const t of tests || []) {
        try {
          // Evaluate assertion with namespace and stdout available
          const testCode = `
namespace = _namespace
stdout = _stdout_interceptor.getvalue()
assert (${t.assertion})
`;
          await pyodide.runPythonAsync(testCode);
          results.push({ name: t.name, passed: true });
        } catch (testErr: any) {
          allPassed = false;
          results.push({
            name: t.name,
            passed: false,
            errorMessage: testErr.message || "Assertion failed",
          });
        }
      }

      const executionTimeMs = Math.round(performance.now() - startTime);
      postMessage({
        type: "TEST_RESULT",
        id,
        passed: allPassed,
        results,
        stdout,
        stderr,
        executionTimeMs,
      });
    } catch (err: any) {
      const executionTimeMs = Math.round(performance.now() - startTime);
      postMessage({
        type: "TEST_RESULT",
        id,
        passed: false,
        results: [
          {
            name: "Code Execution",
            passed: false,
            errorMessage: `Syntax or Runtime Error: ${err.message || String(err)}`,
          },
        ],
        stdout: "",
        stderr: err.message || String(err),
        executionTimeMs,
      });
    }
  }
};
