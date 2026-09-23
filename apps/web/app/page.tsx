import React from "react";
import Link from "next/link";
import { Terminal, Shield, Play, CheckCircle2, Award, Flame, ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden py-24 md:py-32 border-b border-slate-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive In-Browser Python 3 Runtime</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
            Master Python Through <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-yellow-400 bg-clip-text text-transparent">
              Immediate Practice
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
            Stop passively watching video tutorials. Learn Python through split-screen interactive lessons, instant WebAssembly code execution, and behavioral auto-grading.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/learn/python-fundamentals/welcome-to-python"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/courses/python-fundamentals"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
            >
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span>Explore 16 Modules</span>
            </Link>
          </div>

          {/* Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <Shield className="h-5 w-5 text-emerald-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safe WASM Engine</h4>
              <p className="text-xs text-slate-400 mt-1">Runs Python in Web Workers with timeout protection.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <CheckCircle2 className="h-5 w-5 text-blue-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Behavioral Grading</h4>
              <p className="text-xs text-slate-400 mt-1">Assessing runtime state and edge cases, not text matches.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <Layers className="h-5 w-5 text-purple-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Guided Projects</h4>
              <p className="text-xs text-slate-400 mt-1">Build real CLI utilities like Tip Calculator & Games.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <Flame className="h-5 w-5 text-amber-400 mb-2" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Concept Mastery</h4>
              <p className="text-xs text-slate-400 mt-1">Spaced repetition queues and retention streaks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PEDAGOGICAL LOOP SECTION */}
      <section className="w-full py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">The Active Learning Loop</h2>
          <h3 className="mt-2 text-3xl font-extrabold text-white">How PyPath Teaches You to Think Like a Programmer</h3>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {["Learn Concept", "See Example", "Write Code", "Run Code", "Receive Feedback", "Debug", "Submit", "Pass", "Unlock Next"].map((step, idx, arr) => (
              <React.Fragment key={step}>
                <span className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-slate-200 shadow-sm">
                  {step}
                </span>
                {idx < arr.length - 1 && (
                  <span className="text-slate-600 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* COURSE PREVIEW SECTION */}
      <section className="w-full py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">Primary Curriculum</span>
              <h3 className="text-3xl font-bold text-white mt-1">Python Fundamentals</h3>
              <p className="text-sm text-slate-400 mt-2">16 structured modules from variables and data types to OOP and modules.</p>
            </div>

            <Link
              href="/courses/python-fundamentals"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              View Full Syllabus <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { num: "00", title: "Introduction & Syntax", desc: "print(), syntax rules, and program execution flow." },
              { num: "01", title: "Variables & Memory", desc: "Variable declaration, assignment with =, naming conventions." },
              { num: "02", title: "Data Types & type()", desc: "str, int, float, bool, None, and runtime type checking." },
              { num: "03", title: "Strings & Slicing", desc: "Zero-based indexing, slicing, methods, and f-strings." },
              { num: "04", title: "Numbers & Arithmetic", desc: "Operators (+, -, *, /, //, %, **), precedence, and math." },
              { num: "05", title: "User Input & Casting", desc: "Interactive inputs with input() and type casting." },
              { num: "06", title: "Conditionals & Logic", desc: "if, elif, else branches and logical operators." },
              { num: "07", title: "Lists & Collections", desc: "Ordered lists, mutability, indexing, and append/pop." },
              { num: "08", title: "Loops & Iteration", desc: "for loops with range(), while loops, and accumulators." },
              { num: "09", title: "Functions & Scope", desc: "def, parameters, return statements, and local variables." },
              { num: "10", title: "Dictionaries", desc: "Key-value hash maps, lookups, mutations, and .get()." },
              { num: "11", title: "Tuples & Sets", desc: "Immutable tuples, unique sets, and set operations." },
              { num: "12", title: "Error Handling", desc: "try, except, finally, exception classes, and debugging." },
              { num: "13", title: "File Management", desc: "open(), context managers with open(...), virtual filesystem." },
              { num: "14", title: "Object-Oriented Python", desc: "Classes, objects, __init__, self, and methods." },
              { num: "15", title: "Standard Library", desc: "importing random, math, and building utility scripts." },
            ].map((m) => (
              <div key={m.num} className="rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                  <span>Module {m.num}</span>
                  <span className="text-emerald-400">Interactive</span>
                </div>
                <h4 className="text-lg font-bold text-white">{m.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
