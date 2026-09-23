"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle2, ChevronRight, Terminal } from "lucide-react";
import { api } from "@/lib/api";
import { CourseDetail } from "@/lib/types";

export default function CourseDetailPage({ params }: { params: { slug: string } }) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourse(params.slug)
      .then(setCourse)
      .catch((err) => {
        console.warn("Could not load course detail from API", err);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-mono text-sm">Loading syllabus...</div>;
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h2 className="text-xl font-bold text-white">Course Not Found</h2>
        <Link href="/courses" className="mt-4 inline-block text-xs font-semibold text-blue-400 hover:underline">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Course Hero */}
      <div className="space-y-4 border-b border-slate-800 pb-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All Courses
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {course.difficulty}
            </span>
            <h1 className="text-4xl font-extrabold text-white mt-2">{course.title}</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">{course.description}</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> ~{course.estimated_hours} Hours Estimated
            </span>
            <Link
              href={`/learn/${course.slug}/${course.modules[0]?.lessons[0]?.slug || "welcome-to-python"}`}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition flex items-center gap-2"
            >
              <span>Start First Lesson</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Syllabus Modules */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Course Syllabus ({course.modules.length} Modules)</h2>

        <div className="space-y-4">
          {course.modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 transition hover:border-slate-700/80 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold uppercase tracking-wider">
                    Module {modIdx.toString().padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
                </div>
              </div>

              {/* Lessons within this module */}
              <div className="divide-y divide-slate-800/60 rounded-xl border border-slate-800/80 bg-slate-950/80 overflow-hidden">
                {mod.lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/learn/${course.slug}/${lesson.slug}`}
                    className="flex items-center justify-between p-4 hover:bg-slate-900/60 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                        <Terminal className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition">
                          {lesson.title}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {lesson.estimated_minutes} mins • Interactive Exercise
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-300 transition" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
