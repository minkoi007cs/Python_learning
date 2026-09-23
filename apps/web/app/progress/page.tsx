"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Award, Flame, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { ConceptMasteryItem, DashboardData } from "@/lib/types";

export default function ProgressPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [mastery, setMastery] = useState<ConceptMasteryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboard().catch(() => null),
      api.getPractice().catch(() => []),
    ])
      .then(([dash]) => {
        if (dash) {
          setDashboard(dash);
          setMastery(dash.top_mastery);
        } else {
          // Fallback preview
          setDashboard({
            display_name: "Python Learner",
            current_streak: 1,
            total_xp: 35,
            active_course_slug: "python-fundamentals",
            active_course_title: "Python Fundamentals",
            course_progress_percent: 12.5,
            next_lesson_slug: "welcome-to-python",
            next_lesson_title: "Welcome to Python",
            recommended_reviews: [],
            top_mastery: []
          });
          setMastery([
            { concept_id: "intro.print", concept_name: "print() Function", category: "Syntax", mastery_score: 0.9, attempts: 2, needs_review: false },
            { concept_id: "vars.declaration", concept_name: "Variables & Assignment", category: "State", mastery_score: 0.85, attempts: 2, needs_review: false },
            { concept_id: "types.primitives", concept_name: "Data Types", category: "Types", mastery_score: 0.75, attempts: 1, needs_review: false },
            { concept_id: "strings.slicing", concept_name: "String Slicing & f-strings", category: "Text", mastery_score: 0.55, attempts: 1, needs_review: true },
            { concept_id: "loops.while", concept_name: "While Loops", category: "Control Flow", mastery_score: 0.40, attempts: 1, needs_review: true },
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Analytics & Competence</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Concept Mastery Matrix</h1>
        <p className="text-sm text-slate-400 mt-2">
          Your mastery score is deterministically computed from first-try accuracy, hint usage, and spaced repetition time decay.
        </p>
      </div>

      {/* Top metrics row */}
      {dashboard && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <span className="text-xs font-mono text-slate-400">Total Experience</span>
            <div className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-blue-400">
              <Award className="h-7 w-7 text-blue-400" />
              <span>{dashboard.total_xp} XP</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <span className="text-xs font-mono text-slate-400">Active Habit</span>
            <div className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-amber-400">
              <Flame className="h-7 w-7 fill-amber-400 text-amber-400" />
              <span>{dashboard.current_streak} {dashboard.current_streak === 1 ? "Day" : "Days"}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <span className="text-xs font-mono text-slate-400">Course Completion</span>
            <div className="mt-2 flex items-center gap-2 text-3xl font-extrabold text-emerald-400">
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              <span>{dashboard.course_progress_percent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Concept Mastery Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-400" />
            Concept Breakdown
          </h2>
          <span className="text-xs text-slate-500 font-mono">Mastery &ge; 70% considered fluent</span>
        </div>

        <div className="space-y-4">
          {mastery.map((item) => {
            const percent = Math.round(item.mastery_score * 100);
            return (
              <div
                key={item.concept_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-800/80 bg-slate-950 p-4"
              >
                <div className="space-y-1 sm:max-w-[40%]">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-semibold text-sm text-white">{item.concept_name}</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    ID: {item.concept_id} • {item.attempts} attempts
                  </span>
                </div>

                <div className="flex flex-1 items-center gap-4 sm:max-w-[40%]">
                  <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percent >= 80
                          ? "bg-emerald-500"
                          : percent >= 70
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.max(percent, 5)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-bold text-white w-10 text-right">{percent}%</span>
                </div>

                <div>
                  {item.needs_review ? (
                    <Link
                      href="/practice"
                      className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 hover:bg-amber-500/20 transition"
                    >
                      Review
                    </Link>
                  ) : (
                    <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                      Fluent
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
