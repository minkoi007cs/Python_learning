"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { CourseSummary } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourses()
      .then(setCourses)
      .catch(() => {
        // Fallback default course
        setCourses([
          {
            id: "course-python-fundamentals",
            slug: "python-fundamentals",
            title: "Python Fundamentals",
            description: "Master Python from scratch through interactive in-browser exercises, real-time feedback, and guided projects.",
            difficulty: "BEGINNER",
            estimated_hours: 25,
            total_modules: 16,
            total_lessons: 18,
            progress_percent: 0,
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Curriculum Catalog</span>
        <h1 className="text-3xl font-extrabold text-white mt-1">Available Courses</h1>
        <p className="text-sm text-slate-400 mt-2">Structured learning paths designed for active recall and hands-on coding.</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500 font-mono text-sm">Loading curriculum...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between transition hover:border-slate-700 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-3">
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-blue-400 font-semibold uppercase">
                    {course.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="h-3 w-3" /> ~{course.estimated_hours} Hours
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-t border-slate-800/80 pt-4">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-slate-500" /> {course.total_modules} Modules
                  </span>
                  <span>•</span>
                  <span>{course.total_lessons} Lessons</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <Link
                  href={`/courses/${course.slug}`}
                  className="text-xs font-medium text-slate-300 hover:text-white transition"
                >
                  View Syllabus
                </Link>

                <Link
                  href={`/learn/${course.slug}/welcome-to-python`}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition flex items-center gap-1.5 shadow"
                >
                  <span>Start Course</span>
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
