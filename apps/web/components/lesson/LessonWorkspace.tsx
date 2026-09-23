"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Sparkles } from "lucide-react";
import { LessonDetail, TestResultItem } from "@/lib/types";
import { PythonRunner, WorkerStatus } from "@/lib/pyodide/runner";
import { api } from "@/lib/api";
import { MonacoEditorContainer } from "../editor/MonacoEditorContainer";
import { EditorToolbar } from "../editor/EditorToolbar";
import { OutputConsole } from "../editor/OutputConsole";
import { ExerciseInstructions } from "../exercise/ExerciseInstructions";
import { HintAccordion } from "../exercise/HintAccordion";
import { LessonMarkdownViewer } from "./LessonMarkdownViewer";

interface LessonWorkspaceProps {
  lesson: LessonDetail;
}

export function LessonWorkspace({ lesson }: LessonWorkspaceProps) {
  // Find exercise section if present
  const exerciseSection = lesson.sections.find((s) => s.type === "exercise" && s.exercise);
  const exercise = exerciseSection?.exercise;

  const [code, setCode] = useState<string>(exercise?.starter_code || "# Write your Python code here\n");
  const [stdout, setStdout] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [activeConsoleTab, setActiveConsoleTab] = useState<"output" | "tests">("output");
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus>("UNINITIALIZED");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [solutionViewed, setSolutionViewed] = useState<boolean>(false);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  const runnerRef = useRef<PythonRunner | null>(null);

  useEffect(() => {
    // Initialize Pyodide runner on component mount
    runnerRef.current = new PythonRunner((status, msg) => {
      setWorkerStatus(status);
    });
    runnerRef.current.init();

    return () => {
      runnerRef.current?.terminate();
    };
  }, []);

  const handleRunCode = async () => {
    if (!runnerRef.current) return;
    setIsRunning(true);
    setActiveConsoleTab("output");
    setStderr("");

    try {
      const res = await runnerRef.current.runCode(code);
      setStdout(res.stdout);
      setStderr(res.stderr);
      setExecutionTimeMs(res.executionTimeMs);
    } catch (err: any) {
      setStderr(err.message || String(err));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitExercise = async () => {
    if (!runnerRef.current || !exercise) return;
    setIsSubmitting(true);
    setActiveConsoleTab("tests");
    setStderr("");

    try {
      // Evaluate visible tests in worker
      const res = await runnerRef.current.runTests(code, exercise.visible_tests);
      setTestResults(res.results);
      setStdout(res.stdout);
      setStderr(res.stderr);
      setExecutionTimeMs(res.executionTimeMs);

      const passed = res.passed;
      if (passed) {
        setIsPassed(true);
      }

      // Record attempt and progress to FastAPI backend
      await api.submitExercise(exercise.id, {
        course_slug: lesson.course_slug,
        lesson_slug: lesson.slug,
        submitted_code: code,
        passed,
        tests_passed: res.results.filter((t) => t.passed).length,
        tests_total: res.results.length,
        hints_used: hintsUsed,
        solution_viewed: solutionViewed,
        execution_time_ms: res.executionTimeMs,
      });
    } catch (err: any) {
      setStderr(err.message || String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCode = () => {
    if (exercise?.starter_code) {
      setCode(exercise.starter_code);
    }
  };

  const handleLoadExample = (exampleCode: string) => {
    setCode(exampleCode);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col lg:flex-row overflow-hidden bg-slate-950 text-white">
      {/* LEFT PANE: Lesson Theory, Exercises & Hints */}
      <div className="flex flex-1 flex-col overflow-y-auto border-r border-slate-800 bg-slate-950 lg:max-w-[48%]">
        {/* Lesson Header */}
        <div className="border-b border-slate-800 p-6 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
            <Link href="/courses/python-fundamentals" className="hover:underline">
              Python Fundamentals
            </Link>
            <span>/</span>
            <span className="text-slate-400">{lesson.title}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{lesson.title}</h1>

          <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-500" /> {lesson.estimated_minutes} mins
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" /> {lesson.concept_ids.join(", ")}
            </span>
          </div>
        </div>

        {/* Lesson Body */}
        <div className="flex-1 p-6 space-y-6">
          {/* Theory and Code Examples */}
          <LessonMarkdownViewer sections={lesson.sections} onLoadExample={handleLoadExample} />

          {/* Exercise Section */}
          {exercise && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <ExerciseInstructions exercise={exercise} />

              <HintAccordion
                hints={exercise.hints}
                solutionCode={exercise.solution_code}
                onHintRevealed={(count) => setHintsUsed(count)}
                onSolutionRevealed={() => setSolutionViewed(true)}
              />
            </div>
          )}

          {/* Celebration banner upon pass */}
          {isPassed && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">Exercise Completed!</h4>
                  <p className="text-xs text-emerald-400/90">XP awarded and your streak has been extended.</p>
                </div>
              </div>

              {lesson.next_lesson_slug && (
                <Link
                  href={`/learn/${lesson.course_slug}/${lesson.next_lesson_slug}`}
                  className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition flex items-center gap-1.5"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/60 p-4">
          {lesson.prev_lesson_slug ? (
            <Link
              href={`/learn/${lesson.course_slug}/${lesson.prev_lesson_slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Previous Lesson
            </Link>
          ) : (
            <div />
          )}

          {lesson.next_lesson_slug && (
            <Link
              href={`/learn/${lesson.course_slug}/${lesson.next_lesson_slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition"
            >
              Next Lesson <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Code Editor & Execution Console */}
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-900">
        <EditorToolbar
          onRun={handleRunCode}
          onSubmit={handleSubmitExercise}
          onReset={handleResetCode}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
          workerStatus={workerStatus}
        />

        {/* Monaco Editor Container */}
        <div className="h-[60%] w-full">
          <MonacoEditorContainer value={code} onChange={setCode} />
        </div>

        {/* Terminal & Test Results Console */}
        <div className="h-[40%] w-full border-t border-slate-800">
          <OutputConsole
            stdout={stdout}
            stderr={stderr}
            executionTimeMs={executionTimeMs}
            testResults={testResults}
            activeTab={activeConsoleTab}
          />
        </div>
      </div>
    </div>
  );
}
