"use client";

import React, { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp, Eye } from "lucide-react";

interface HintAccordionProps {
  hints: string[];
  onHintRevealed?: (count: number) => void;
  onSolutionRevealed?: () => void;
  solutionCode?: string;
}

export function HintAccordion({
  hints,
  onHintRevealed,
  onSolutionRevealed,
  solutionCode,
}: HintAccordionProps) {
  const [unlockedCount, setUnlockedCount] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleUnlockNext = () => {
    if (unlockedCount < hints.length) {
      const next = unlockedCount + 1;
      setUnlockedCount(next);
      if (onHintRevealed) onHintRevealed(next);
    }
  };

  const handleRevealSolution = () => {
    setShowSolution(true);
    if (onSolutionRevealed) onSolutionRevealed();
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Lightbulb className="h-4 w-4 text-amber-400" />
          Hints & Assistance ({unlockedCount}/{hints.length})
        </span>

        {unlockedCount < hints.length ? (
          <button
            onClick={handleUnlockNext}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 transition underline underline-offset-4"
          >
            Get Hint {unlockedCount + 1}
          </button>
        ) : (
          !showSolution && solutionCode && (
            <button
              onClick={handleRevealSolution}
              className="text-xs font-medium text-rose-400 hover:text-rose-300 transition flex items-center gap-1"
            >
              <Eye className="h-3 w-3" /> Show Solution
            </button>
          )
        )}
      </div>

      {/* Render unlocked hints */}
      <div className="space-y-2">
        {hints.slice(0, unlockedCount).map((hint, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200/90 leading-relaxed"
          >
            <span className="font-bold text-amber-400 mr-2">Hint {idx + 1}:</span>
            {hint}
          </div>
        ))}
      </div>

      {/* Solution reveal */}
      {showSolution && solutionCode && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 space-y-2">
          <div className="text-xs font-bold text-rose-400">Official Solution:</div>
          <pre className="overflow-x-auto rounded bg-slate-950 p-2.5 font-mono text-xs text-emerald-400">
            {solutionCode}
          </pre>
          <p className="text-[11px] text-slate-500 italic">
            Viewing the solution records full transparency in your learning progress.
          </p>
        </div>
      )}
    </div>
  );
}
