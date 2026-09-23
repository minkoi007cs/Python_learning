import React from "react";
import { Brain, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ConceptMasteryItem } from "@/lib/types";

interface MasteryOverviewProps {
  masteryItems: ConceptMasteryItem[];
}

export function MasteryOverview({ masteryItems }: MasteryOverviewProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Brain className="h-5 w-5 text-indigo-400" />
          Concept Mastery
        </h3>
        <Link
          href="/progress"
          className="text-xs font-medium text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
        >
          View All <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {masteryItems.slice(0, 5).map((item) => {
          const percent = Math.round(item.mastery_score * 100);
          return (
            <div key={item.concept_id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200">{item.concept_name}</span>
                <span className="font-mono text-slate-400">{percent}%</span>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percent >= 80
                      ? "bg-emerald-500"
                      : percent >= 50
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.max(percent, 5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
