import React from "react";
import { Flame, Calendar, Award } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  totalXp: number;
}

export function StreakCard({ currentStreak, totalXp }: StreakCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Activity & Habits</span>
          <h3 className="mt-1 text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="h-6 w-6 text-amber-500 fill-amber-500" />
            {currentStreak} {currentStreak === 1 ? "Day" : "Days"} Streak
          </h3>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-slate-500 font-mono">Total Earned</span>
          <span className="text-xl font-bold text-blue-400 flex items-center gap-1">
            <Award className="h-5 w-5 text-blue-400" /> {totalXp} XP
          </span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
          const isActive = idx <= (currentStreak - 1);
          return (
            <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  isActive
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                    : "bg-slate-800/60 border border-slate-800 text-slate-500"
                }`}
              >
                {isActive ? <Flame className="h-3.5 w-3.5 fill-amber-400" /> : day[0]}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
