/**
 * HomeworkSummaryCard — Dayhaven mockup style:
 * Solid PINK background, homework progress per kid.
 * No borders, no shadows.
 */
import { BookOpen, CheckCircle2 } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

function buildKey(weekLabel: string, kidId: string, idx: number) {
  return `schoolbase:hw:${weekLabel}:${kidId}:${idx}`;
}

export default function HomeworkSummaryCard({ delay = 0 }: { delay?: number }) {
  const { week, kids } = useWeek();
  const homework = week.homework;

  if (!homework?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-pink"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 opacity-70" />
        <h3 className="font-display text-sm font-semibold">Homework</h3>
      </div>

      <div className="space-y-3">
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
            <div key={kidHw.kidId} className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: kid.color }}
              >
                {kid.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{kid.name}</span>
                  <span className="text-[10px] font-medium opacity-70">{completed}/{total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-black/25"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {pct === 100 && <CheckCircle2 className="w-4 h-4 opacity-60 shrink-0" />}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
