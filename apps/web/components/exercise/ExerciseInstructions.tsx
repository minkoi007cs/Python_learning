import React from "react";
import { Award, Zap } from "lucide-react";
import { Exercise } from "@/lib/types";

interface ExerciseInstructionsProps {
  exercise: Exercise;
}

export function ExerciseInstructions({ exercise }: ExerciseInstructionsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h3 className="font-semibold text-base text-white flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          {exercise.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-blue-400 flex items-center gap-1">
            <Award className="h-3 w-3" /> +{exercise.xp_reward} XP
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {exercise.difficulty}
          </span>
        </div>
      </div>

      <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300 font-sans">
        {exercise.instructions}
      </div>
    </div>
  );
}
