"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2, Award } from "lucide-react";
import { api } from "@/lib/api";
import { DashboardData } from "@/lib/types";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { MasteryOverview } from "@/components/dashboard/MasteryOverview";
import { ReviewQueue } from "@/components/dashboard/ReviewQueue";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getDashboard()
      .then((d) => setData(d))
      .catch((err) => {
        console.warn("Could not load backend dashboard, loading local preview data", err);
        setData({
          display_name: "Python Learner",
          current_streak: 1,
          total_xp: 35,
          active_course_slug: "python-fundamentals",
          active_course_title: "Python Fundamentals",
          course_progress_percent: 12.5,
          next_lesson_slug: "welcome-to-python",
          next_lesson_title: "Welcome to Python",
          recommended_reviews: [
            {
              concept_id: "variables.declaration",
              concept_name: "Variables & Memory",
              reason: "Low mastery score or high time decay",
              suggested_lesson_slug: "creating-variables"
            }
          ],
          top_mastery: [
            { concept_id: "intro.print", concept_name: "print() Function", category: "Syntax", mastery_score: 0.9, attempts: 2, needs_review: false },
            { concept_id: "vars.declaration", concept_name: "Variables", category: "State", mastery_score: 0.8, attempts: 2, needs_review: false },
            { concept_id: "types.primitives", concept_name: "Data Types", category: "Types", mastery_score: 0.65, attempts: 1, needs_review: true }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500 font-mono text-sm">
        Loading learner dashboard...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Welcome back</span>
          <h1 className="text-3xl font-extrabold text-white mt-1">{data.display_name}</h1>
          <p className="text-sm text-slate-400 mt-1">Keep the momentum going. Learn Python one step at a time.</p>
        </div>

        <Link
          href={`/learn/${data.active_course_slug}/${data.next_lesson_slug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition"
        >
          <span>Continue: {data.next_lesson_title}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid: Streak & Active Course */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StreakCard currentStreak={data.current_streak} totalXp={data.total_xp} />

        {/* Active Course Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Current Course</span>
              <span className="text-blue-400 font-bold">{data.course_progress_percent}% Complete</span>
            </div>

            <h3 className="text-2xl font-bold text-white mt-2">{data.active_course_title}</h3>
            <p className="text-xs text-slate-400 mt-1">Next up: {data.next_lesson_title}</p>

            <div className="mt-6 h-3 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${Math.max(data.course_progress_percent, 5)}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-4">
            <Link
              href={`/courses/${data.active_course_slug}`}
              className="text-xs font-medium text-slate-400 hover:text-white transition"
            >
              View Syllabus
            </Link>

            <Link
              href={`/learn/${data.active_course_slug}/${data.next_lesson_slug}`}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              Resume Lesson <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Review Queue & Mastery Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReviewQueue reviews={data.recommended_reviews} />
        <MasteryOverview masteryItems={data.top_mastery} />
      </div>
    </div>
  );
}
