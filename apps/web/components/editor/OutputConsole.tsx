"use client";

import React, { useState } from "react";
import { Terminal, CheckCircle2, XCircle, Clock, AlertTriangle, Lightbulb } from "lucide-react";
import { TestResultItem } from "@/lib/types";
import { PythonRunner } from "@/lib/pyodide/runner";

interface OutputConsoleProps {
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  testResults: TestResultItem[];
  activeTab?: "output" | "tests";
}

export function OutputConsole({
  stdout,
  stderr,
  executionTimeMs,
  testResults,
  activeTab: controlledTab,
}: OutputConsoleProps) {
  const [internalTab, setInternalTab] = useState<"output" | "tests">("output");
  const activeTab = controlledTab || internalTab;

  const tip = PythonRunner.translateError(stderr);

  return (
    <div className="flex h-full w-full flex-col bg-slate-950 text-slate-200">
      {/* Tab Header */}
      <div className="flex h-10 w-full items-center justify-between border-b border-slate-800 bg-slate-900/60 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setInternalTab("output")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition ${
              activeTab === "output"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-blue-400" />
            <span>Output</span>
          </button>

          <button
            onClick={() => setInternalTab("tests")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition ${
              activeTab === "tests"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Test Results {testResults.length > 0 && `(${testResults.filter(t => t.passed).length}/${testResults.length})`}</span>
          </button>
        </div>

        {executionTimeMs > 0 && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
            <Clock className="h-3 w-3" />
            <span>{executionTimeMs}ms</span>
          </div>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {activeTab === "output" ? (
          <div className="space-y-3">
            {stdout ? (
              <pre className="whitespace-pre-wrap font-mono text-slate-200 leading-relaxed">
                {stdout}
              </pre>
            ) : !stderr ? (
              <p className="italic text-slate-600">Run code to view standard output here...</p>
            ) : null}

            {stderr && (
              <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-rose-300">
                <div className="flex items-center gap-1.5 font-semibold text-rose-400 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Error Output</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-xs">{stderr}</pre>
              </div>
            )}

            {tip && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-900/50 bg-amber-950/20 p-3 text-amber-200">
                <Lightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{tip}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {testResults.length === 0 ? (
              <p className="italic text-slate-600">Submit your exercise to see automated test verification.</p>
            ) : (
              testResults.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1 rounded-md border p-2.5 transition ${
                    t.passed
                      ? "border-emerald-900/40 bg-emerald-950/20 text-emerald-300"
                      : "border-rose-900/40 bg-rose-950/20 text-rose-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs flex items-center gap-2">
                      {t.passed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      {t.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        t.passed
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}
                    >
                      {t.passed ? "Passed" : "Failed"}
                    </span>
                  </div>
                  {t.errorMessage && (
                    <p className="mt-1 font-mono text-[11px] text-rose-400/90 pl-6">
                      {t.errorMessage}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
