"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Filter, Sparkles, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { Exercise } from "@/lib/types";

const TOPICS = [
  { id: "all", label: "All Topics" },
  { id: "variables", label: "Variables" },
  { id: "strings", label: "Strings" },
  { id: "numbers", label: "Numbers" },
  { id: "conditionals", label: "Conditionals" },
  { id: "lists", label: "Lists" },
  { id: "loops", label: "Loops" },
  { id: "functions", label: "Functions" },
  { id: "dicts", label: "Dictionaries" },
  { id: "oop", label: "OOP" },
  { id: "errors", label: "Error Handling" },
];

export default function PracticePage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [needsReviewOnly, setNeedsReviewOnly] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const params: { topic?: string; difficulty?: string; needs_review?: boolean } = {};
    if (selectedTopic !== "all") params.topic = selectedTopic;
    if (selectedDifficulty !== "all") params.difficulty = selectedDifficulty;
    if (needsReviewOnly) params.needs_review = true;

    api.getPractice(params)
      .then(setExercises)
      .catch(() => {
        // Fallback demo exercises if API is offline
        setExercises([
          {
            id: "ex-vars-01",
            title: "Declare Player Variables",
            instructions: "Declare name = 'Alex' and age = 18.",
            starter_code: "# code here",
            hints: ["Use name = 'Alex'"],
            difficulty: "EASY",
            xp_reward: 10,
            concept_ids: ["variables.declaration"],
            visible_tests: [{ name: "name is Alex", assertion: "name == 'Alex'" }],
            hidden_tests: [],
          },
          {
            id: "ex-loops-01",
            title: "Sum of Numbers with a Loop",
            instructions: "Compute sum from 1 to 10 with a for loop.",
            starter_code: "# code here",
            hints: ["Use range(1, 11)"],
            difficulty: "EASY",
            xp_reward: 10,
            concept_ids: ["loops.for"],
            visible_tests: [{ name: "total is 55", assertion: "total_sum == 55" }],
            hidden_tests: [],
          },
          {
            id: "ex-funcs-01",
            title: "Function Challenge: Add & Multiply",
            instructions: "Create multiply_and_add(a, b, c) returning (a * b) + c.",
            starter_code: "def multiply_and_add(a, b, c): pass",
            hints: ["Return (a * b) + c"],
            difficulty: "EASY",
            xp_reward: 15,
            concept_ids: ["functions.def"],
            visible_tests: [{ name: "Works for 2, 3, 4", assertion: "multiply_and_add(2, 3, 4) == 10" }],
            hidden_tests: [],
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [selectedTopic, selectedDifficulty, needsReviewOnly]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <Compass className="h-3.5 w-3.5" />
          <span>Deliberate Practice Mode</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Targeted Practice Drills</h1>
        <p className="text-sm text-slate-400 mt-2">
          Sharpen specific Python skills through isolated coding drills and spaced repetition.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5 shadow-sm">
        {/* Topic Filters */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Filter by Topic</span>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedTopic === topic.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty & Needs Review */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Difficulty:</span>
            {["all", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  selectedDifficulty === diff
                    ? "bg-slate-200 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {diff === "all" ? "All" : diff}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-amber-400">
            <input
              type="checkbox"
              checked={needsReviewOnly}
              onChange={(e) => setNeedsReviewOnly(e.target.checked)}
              className="rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-0"
            />
            <Sparkles className="h-3.5 w-3.5" />
            <span>Show Only Concepts Needing Review</span>
          </label>
        </div>
      </div>

      {/* Exercises List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-sm">Loading drills...</div>
      ) : exercises.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400">
          <p className="font-semibold text-white">No exercises matched your filters.</p>
          <p className="text-xs text-slate-500 mt-1">Try relaxing the topic or difficulty selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between transition hover:border-slate-700 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-slate-300 font-semibold uppercase">
                    {ex.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-blue-400 font-semibold">
                    <Award className="h-3.5 w-3.5" /> +{ex.xp_reward} XP
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{ex.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {ex.instructions}
                </p>

                <div className="text-[11px] font-mono text-slate-500">
                  Tests: {ex.visible_tests.length} behavioral assertions
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <Link
                  href="/learn/python-fundamentals/welcome-to-python"
                  className="rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition flex items-center justify-between"
                >
                  <span>Practice Exercise</span>
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
