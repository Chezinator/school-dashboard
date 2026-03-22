/**
 * HomeworkSummaryCard — Compact smart card for the home screen.
 * Shows homework completion progress per kid at a glance.
 */
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

function buildKey(weekLabel: string, kidId: string, idx: number) {
  return `schoolbase:hw:${weekLabel}:${kidId}:${idx}`;
}

export default function HomeworkSummaryCard({ delay = 0 }: { delay?: number }) {
  const { week, kids } = useWeek();
  const homework = week.homework;

  if (!homework?.length) return null;

  return (
    <AnimatedCard delay={delay}>
      <div className="bg-card rounded-2xl p-4 border border-border/40 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-900/15 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-violet-500 dark:text-violet-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Homework</h3>
            <p className="text-xs text-muted-foreground">This week's assignments</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {homework.map((kidHw) => {
            const kid = kids.find((k) => k.id === kidHw.kidId);
            if (!kid) return null;

            const total = kidHw.assignments.length;
            const completed = kidHw.assignments.filter((_, idx) => {
              const key = buildKey(week.weekLabel, kidHw.kidId, idx);
              return localStorage.getItem(key) === "true";
            }).length;

            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div key={kidHw.kidId} className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: kid.color }}
                >
                  {kid.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{kid.name}</span>
                    <span className="text-xs text-muted-foreground">{completed}/{total}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: pct === 100 ? "oklch(0.68 0.08 155)" : kid.color,
                      }}
                    />
                  </div>
                </div>
                {pct === 100 && (
                  <CheckCircle2 className="w-4 h-4 text-sage shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedCard>
  );
}
