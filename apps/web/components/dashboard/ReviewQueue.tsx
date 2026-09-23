import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { RecommendedReviewItem } from "@/lib/types";

interface ReviewQueueProps {
  reviews: RecommendedReviewItem[];
}

export function ReviewQueue({ reviews }: ReviewQueueProps) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-slate-400 text-sm">
        <Sparkles className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
        <h4 className="font-semibold text-white">All Caught Up!</h4>
        <p className="text-xs text-slate-500 mt-1">No concepts currently need review. Keep progressing!</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-amber-400" />
          Recommended Review
        </h3>
        <span className="text-xs text-slate-500">Spaced Repetition</span>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div
            key={rev.concept_id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
          >
            <div>
              <h4 className="font-semibold text-sm text-white">{rev.concept_name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{rev.reason}</p>
            </div>

            <Link
              href="/practice"
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              Practice <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
