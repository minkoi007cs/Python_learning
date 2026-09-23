"use client";

import React from "react";
import { BookOpen, Code2, ArrowRight } from "lucide-react";
import { LessonSection } from "@/lib/types";

interface LessonMarkdownViewerProps {
  sections: LessonSection[];
  onLoadExample?: (code: string) => void;
}

export function LessonMarkdownViewer({ sections, onLoadExample }: LessonMarkdownViewerProps) {
  return (
    <div className="space-y-6 text-slate-300">
      {sections.map((section, idx) => {
        if (section.type === "markdown" && section.content) {
          return (
            <div key={idx} className="prose prose-invert max-w-none text-sm leading-relaxed space-y-3">
              <div className="whitespace-pre-wrap font-sans">{section.content}</div>
            </div>
          );
        }

        if (section.type === "code_example" && section.code) {
          return (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="h-3.5 w-3.5 text-blue-400" />
                  Code Example
                </span>

                {onLoadExample && (
                  <button
                    onClick={() => onLoadExample(section.code || "")}
                    className="text-xs font-medium text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                  >
                    <span>Load in Editor</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>

              <pre className="overflow-x-auto p-4 font-mono text-xs text-yellow-300 bg-slate-950">
                {section.code}
              </pre>

              {section.explanation && (
                <div className="border-t border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-400">
                  {section.explanation}
                </div>
              )}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
