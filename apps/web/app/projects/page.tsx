"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, Award, CheckCircle2, ArrowRight, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getProjects()
      .then(setProjects)
      .catch(() => {
        // Fallback demo projects
        setProjects([
          {
            id: "proj-tip-calc",
            slug: "tip-calculator",
            title: "Tip Calculator",
            description: "Build an interactive tip calculator computing bill totals, tip percentages, and splits.",
            difficulty: "EASY",
            starter_code: "def calculate_total(bill, tip, people=1): pass",
            milestones: [
              { step: 1, title: "Calculate Tip", description: "Multiply bill by tip %" },
              { step: 2, title: "Split Total", description: "Divide total among people" }
            ],
            completed: false,
            milestones_completed: 0
          },
          {
            id: "proj-number-guess",
            slug: "number-guessing-game",
            title: "Number Guessing Game",
            description: "A classic game using random numbers, loops, and condition comparisons.",
            difficulty: "MEDIUM",
            starter_code: "import random",
            milestones: [
              { step: 1, title: "Compare Guess", description: "Return 'Too High' or 'Too Low'" },
              { step: 2, title: "Win Condition", description: "Match secret number" }
            ],
            completed: false,
            milestones_completed: 0
          },
          {
            id: "proj-contact-book",
            slug: "contact-book",
            title: "Contact Book",
            description: "Create a dictionary-based contact manager supporting search, insert, and update.",
            difficulty: "MEDIUM",
            starter_code: "class ContactBook: pass",
            milestones: [
              { step: 1, title: "Store Contact", description: "Add key value pairs" },
              { step: 2, title: "Search Contact", description: "Return name or 'Not Found'" }
            ],
            completed: false,
            milestones_completed: 0
          }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-400 mb-3">
          <Terminal className="h-3.5 w-3.5" />
          <span>Real-World Projects</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Project-Based Learning</h1>
        <p className="text-sm text-slate-400 mt-2">
          Synthesize concepts by building full interactive CLI applications from scratch with automated milestone verification.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-sm">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between transition hover:border-slate-700 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-purple-400 font-semibold uppercase">
                    {proj.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <Award className="h-3.5 w-3.5" /> +100 XP
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {proj.description}
                </p>

                <div className="space-y-2 border-t border-slate-800/80 pt-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Milestones ({proj.milestones.length})
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {proj.milestones.map((m) => (
                      <li key={m.step} className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                          {m.step}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800">
                <Link
                  href="/learn/python-fundamentals/welcome-to-python"
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white hover:bg-purple-500 transition flex items-center justify-between shadow"
                >
                  <span>Open Project Workspace</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
