/**
 * HomeworkSummaryCard — Shows homework progress per kid + next due assignment.
 * Clickable to jump to Homework in More tab.
 * Pink card. Phosphor icon.
 * Color-coded: Bronson=teal, Kaia=pink (uses kid.color).
 */
import { BookOpenText, CheckCircle } from "@phosphor-icons/react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

interface Props {
  delay?: number;
  onNavigate?: () => void;
}

function buildKey(weekLabel: string, kidId: string, idx: number) {
  return `schoolbase:hw:${weekLabel}:${kidId}:${idx}`;
}

export default function HomeworkSummaryCard({ delay = 0, onNavigate }: Props) {
  const { week, kids } = useWeek();
  const homework = week.homework;

  if (!homework?.length) return null;

  // Find next incomplete assignment across all kids
  let nextAssignment: { kidName: string; subject: string; title: string } | null = null;
  for (const kidHw of homework) {
    const kid = kids.find((k) => k.id === kidHw.kidId);
    for (let i = 0; i < kidHw.assignments.length; i++) {
      const key = buildKey(week.weekLabel, kidHw.kidId, i);
      if (localStorage.getItem(key) !== "true") {
        nextAssignment = {
          kidName: kid?.name ?? "",
          subject: kidHw.assignments[i].subject,
          title: kidHw.assignments[i].title,
        };
        break;
      }
    }
    if (nextAssignment) break;
  }

  return (
    <motion.button
      onClick={onNavigate}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-pink text-left w-full cursor-pointer flex flex-col"
      aria-label="View all homework"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpenText size={18} weight="duotone" className="opacity-70" />
        <h3 className="font-display text-sm font-semibold">Homework</h3>
      </div>

      {/* Progress per kid */}
      <div className="space-y-2.5 mb-3">
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
            <div key={kidHw.kidId} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                style={{ backgroundColor: kid.color }}
              >
                {kid.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-black/25"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-medium opacity-60 shrink-0">{completed}/{total}</span>
              {pct === 100 && <CheckCircle size={14} weight="fill" className="opacity-50 shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Next assignment preview */}
      {nextAssignment && (
        <div className="pt-2 border-t border-black/8">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-0.5">Next up</p>
          <p className="text-xs font-medium leading-snug opacity-80 truncate">
            {nextAssignment.kidName}: {nextAssignment.subject}
          </p>
        </div>
      )}

      <p className="text-[10px] font-semibold opacity-40 mt-2 uppercase tracking-wider">Tap for details →</p>
    </motion.button>
  );
}
