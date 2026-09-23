"use client";

import React from "react";
import { Play, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { WorkerStatus } from "@/lib/pyodide/runner";

interface EditorToolbarProps {
  onRun: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  workerStatus: WorkerStatus;
}

export function EditorToolbar({
  onRun,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting,
  workerStatus,
}: EditorToolbarProps) {
  const getStatusBadge = () => {
    switch (workerStatus) {
      case "LOADING":
        return (
          <span className="flex items-center gap-1.5 text-xs text-blue-400 font-mono">
            <Loader2 className="h-3 w-3 animate-spin" /> Loading Python...
          </span>
        );
      case "RUNNING":
        return (
          <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" /> Executing...
          </span>
        );
      case "ERROR":
        return (
          <span className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Runtime Error
          </span>
        );
      case "TIMEOUT":
        return (
          <span className="flex items-center gap-1.5 text-xs text-orange-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-orange-500" /> Timed Out
          </span>
        );
      case "READY":
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Python Ready
          </span>
        );
    }
  };

  return (
    <div className="flex h-12 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4">
      {/* Left: Runtime Status */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Editor</span>
        <span className="text-slate-700">|</span>
        {getStatusBadge()}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          disabled={isRunning || isSubmitting}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition disabled:opacity-50"
          title="Reset to starter code"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        <button
          onClick={onRun}
          disabled={isRunning || isSubmitting || workerStatus === "LOADING"}
          className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:bg-slate-700 transition disabled:opacity-50"
        >
          {isRunning ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
          ) : (
            <Play className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
          )}
          <span>Run</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={isRunning || isSubmitting || workerStatus === "LOADING"}
          className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
          )}
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
}
