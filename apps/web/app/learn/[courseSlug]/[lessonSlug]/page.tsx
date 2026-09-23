"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { LessonDetail } from "@/lib/types";
import { LessonWorkspace } from "@/components/lesson/LessonWorkspace";

export default function LearnPage({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string };
}) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.getLesson(params.courseSlug, params.lessonSlug)
      .then((data) => {
        setLesson(data);
      })
      .catch((err) => {
        console.warn("Could not load lesson from API:", err);
        // Fallback default lesson for preview if backend is offline
        setLesson({
          id: "lesson-intro-01",
          slug: params.lessonSlug,
          title: "Welcome to Python",
          module_slug: "module-00-introduction",
          course_slug: params.courseSlug,
          estimated_minutes: 5,
          concept_ids: ["introduction.print", "syntax.basic"],
          sections: [
            {
              type: "markdown",
              content:
                "### What is Programming?\nProgramming is writing step-by-step instructions that tell a computer what to do.\n\n### Your First Instruction: `print()`\nIn Python, we use `print()` to output text to the screen.",
            },
            {
              type: "code_example",
              code: 'print("Hello, World!")',
              explanation: "Outputs Hello, World! to the console.",
            },
            {
              type: "exercise",
              exercise: {
                id: "ex-intro-01",
                title: "Print Your First Message",
                instructions:
                  'Use the print() function to display the exact text "Hello, PyPath!" to the screen.',
                starter_code: "# Write your print statement below:\n",
                solution_code: 'print("Hello, PyPath!")',
                hints: [
                  "Remember print is all lowercase.",
                  'Enclose text in double quotes: "Hello, PyPath!"',
                ],
                difficulty: "EASY",
                xp_reward: 10,
                concept_ids: ["introduction.print"],
                visible_tests: [
                  {
                    name: "Outputs 'Hello, PyPath!'",
                    assertion: "stdout.strip() == 'Hello, PyPath!'",
                  },
                ],
                hidden_tests: [],
              },
            },
          ],
          next_lesson_slug: "multiple-lines-and-syntax",
        });
      })
      .finally(() => setLoading(false));
  }, [params.courseSlug, params.lessonSlug]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex items-center gap-2 font-mono text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span>Loading interactive workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Lesson Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || "Could not retrieve the requested lesson."}</p>
        <Link
          href={`/courses/${params.courseSlug}`}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Syllabus
        </Link>
      </div>
    );
  }

  return <LessonWorkspace lesson={lesson} />;
}
