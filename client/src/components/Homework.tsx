/**
 * Homework — Dayhaven mockup style:
 * Kid tabs as color pills, assignments as color-blocked cards.
 * Checkboxes for completion, links as pill CTAs.
 * No borders, no shadows — solid fills only.
 */
import { useState, useEffect, useCallback } from "react";
import { BookOpenText, CalendarCheck, CheckCircle, Circle, ArrowSquareOut } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

interface AssignmentLink { url: string; label: string; }

interface Assignment {
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  link?: AssignmentLink;
  links?: AssignmentLink[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

const SUBJECT_CARDS: Record<string, string> = {
  writing: "dh-card-coral",
  math: "dh-card-amber",
  reading: "dh-card-teal",
  science: "dh-card-sage",
  phonics: "dh-card-pink",
  ela: "dh-card-coral",
  general: "dh-card-cream",
};

function buildKey(weekLabel: string, kidId: string, idx: number) {
  return `schoolbase:hw:${weekLabel}:${kidId}:${idx}`;
}

export default function Homework() {
  const { week, kids } = useWeek();
  const homework = week.homework;
  const [activeKid, setActiveKid] = useState(kids[0].id);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const currentHomework = homework.find((h) => h.kidId === activeKid);
    if (!currentHomework) return;
    const loaded: Record<string, boolean> = {};
    currentHomework.assignments.forEach((_: Assignment, idx: number) => {
      const key = buildKey(week.weekLabel, activeKid, idx);
      loaded[key] = localStorage.getItem(key) === "true";
    });
    setCompleted(prev => ({ ...prev, ...loaded }));
  }, [activeKid, week.weekLabel, homework]);

  const toggleComplete = useCallback((kidId: string, idx: number) => {
    const key = buildKey(week.weekLabel, kidId, idx);
    setCompleted(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(key, String(next[key]));
      return next;
    });
  }, [week.weekLabel]);

  const currentHomework = homework.find((h) => h.kidId === activeKid);
  const totalAssignments = currentHomework?.assignments.length ?? 0;
  const completedCount = currentHomework?.assignments.filter((_: Assignment, idx: number) => {
    return completed[buildKey(week.weekLabel, activeKid, idx)];
  }).length ?? 0;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpenText size={22} weight="duotone" className="text-dh-pink" />
          <h2 className="font-display text-xl text-foreground tracking-tight">Homework</h2>
        </div>
        {totalAssignments > 0 && (
          <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full px-3 py-1">
            {completedCount}/{totalAssignments}
          </span>
        )}
      </div>

      {/* Kid tabs — solid color pills */}
      <div className="flex gap-2 mb-4">
        {kids.map((kid) => (
          <motion.button
            key={kid.id}
            onClick={() => setActiveKid(kid.id)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeKid === kid.id
                ? "text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
            style={activeKid === kid.id ? { backgroundColor: kid.color } : {}}
          >
            {kid.name}
          </motion.button>
        ))}
      </div>

      {/* Progress bar */}
      {totalAssignments > 0 && (
        <div className="mb-4 h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: kids.find(k => k.id === activeKid)?.color || "#888" }}
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalAssignments) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      )}

      {/* Assignments */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeKid}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="space-y-3"
        >
          {currentHomework?.assignments.map((assignment: Assignment, idx: number) => {
            const key = buildKey(week.weekLabel, activeKid, idx);
            const isDone = completed[key] ?? (assignment.status === "completed");
            const cardStyle = SUBJECT_CARDS[assignment.subject.toLowerCase()] || "dh-card-cream";
            const allLinks: AssignmentLink[] = [
              ...(assignment.link ? [assignment.link] : []),
              ...(assignment.links ?? []),
            ];

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.06 }}
                whileHover={{ y: -2 }}
                className={`dh-card ${cardStyle} ${isDone ? "opacity-50" : ""} transition-opacity duration-300`}
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    onClick={() => toggleComplete(activeKid, idx)}
                    aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
                    whileTap={{ scale: 0.8 }}
                    className="mt-0.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {isDone ? <CheckCircle size={20} weight="fill" /> : <Circle size={20} />}
                  </motion.button>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-0.5">
                      {assignment.subject}
                    </p>
                    <h3 className={`font-display text-sm font-semibold leading-snug ${isDone ? "line-through opacity-60" : ""}`}>
                      {assignment.title}
                    </h3>
                    <p className="text-xs leading-relaxed opacity-75 mt-1">{assignment.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <CalendarCheck size={12} weight="bold" className="opacity-50" />
                      <span className="text-xs font-medium opacity-60">Due {formatDate(assignment.dueDate)}</span>
                    </div>
                    {allLinks.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {allLinks.map((lk, li) => (
                          <a
                            key={li}
                            href={lk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                          >
                            <ArrowSquareOut size={14} weight="bold" />
                            {lk.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {(!currentHomework || currentHomework.assignments.length === 0) && (
            <div className="dh-card dh-card-cream text-center py-8">
              <BookOpenText size={32} weight="duotone" className="opacity-20 mx-auto mb-2" />
              <p className="text-sm opacity-60">No homework assignments this week</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
