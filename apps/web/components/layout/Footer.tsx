import React from "react";
import Link from "next/link";
import { Terminal, Shield, BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600/30 text-blue-400">
              <Terminal className="h-4 w-4" />
            </span>
            <span className="font-semibold text-white">PyPath</span>
            <span className="text-xs text-slate-500">— Interactive Python Learning Platform</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Safe WebAssembly Sandbox
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-blue-400" /> Behavioral Auto-Grading
            </span>
            <span>•</span>
            <span>Zero Server Exec</span>
          </div>

          <p className="text-xs text-slate-500">
            Built with rigor for learners worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
