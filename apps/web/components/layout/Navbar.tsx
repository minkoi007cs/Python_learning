"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Flame, Award, Terminal, Compass, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20">
              <Terminal className="h-5 w-5 text-white" />
            </span>
            <span>Py<span className="text-yellow-400">Path</span></span>
          </Link>

          <nav className="hidden md:ml-8 md:flex md:items-center md:gap-6 text-sm font-medium">
            <Link href="/courses" className="text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-400" /> Courses
            </Link>
            <Link href="/practice" className="text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-emerald-400" /> Practice
            </Link>
            <Link href="/projects" className="text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-purple-400" /> Projects
            </Link>
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition flex items-center gap-1.5">
              <LayoutDashboard className="h-4 w-4 text-amber-400" /> Dashboard
            </Link>
          </nav>
        </div>

        {/* User Badges: Streaks & XP */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
            <Flame className="h-4 w-4 fill-amber-400" />
            <span>1 Day Streak</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
            <Award className="h-4 w-4" />
            <span>35 XP</span>
          </div>

          <Link
            href="/courses/python-fundamentals"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition"
          >
            Resume Learning
          </Link>
        </div>
      </div>
    </header>
  );
}
