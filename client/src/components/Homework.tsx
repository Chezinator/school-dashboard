/**
 * Homework — Dayhaven app aesthetic
 * Color-blocked rounded cards, pill subject badges, charcoal pill CTAs,
 * completion toggle with localStorage, staggered entrance animations.
 */
import { useState, useEffect, useCallback } from "react";
import { BookOpen, Calendar, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

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

function getSubjectColor(subject: string) {
  switch (subject.toLowerCase()) {
    case "writing":  return { bg: "bg-coral-light dark:bg-coral/12", text: "text-coral" };
    case "math":     return { bg: "bg-amber-light dark:bg-amber/12", text: "text-amber" };
    case "reading":  return { bg: "bg-teal-light dark:bg-teal/12", text: "text-teal" };
    case "science":  return { bg: "bg-sage-light dark:bg-sage/12", text: "text-sage" };
    case "phonics":  return { bg: "bg-violet-50 dark:bg-violet-900/15", text: "text-violet-600 dark:text-violet-400" };
    default:         return { bg: "bg-muted", text: "text-muted-foreground" };
  }
}

function LinkButton({ link }: { link: AssignmentLink }) {
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="pill-cta text-xs py-1.5 px-4">
      <ExternalLink className="w-3 h-3" />
      {link.label}
    </a>
  );
}

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
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-sage-light dark:bg-sage/15 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-sage" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground tracking-tight">Homework</h2>
          {totalAssignments > 0 && (
            <p className="text-xs text-muted-foreground">{completedCount}/{totalAssignments} completed</p>
          )}
        </div>
      </div>

      {/* Kid tabs */}
      <div className="flex gap-2 mb-4">
        {kids.map((kid) => (
          <motion.button
            key={kid.id}
            onClick={() => setActiveKid(kid.id)}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeKid === kid.id
                ? "text-white shadow-md"
                : "bg-card text-foreground border border-border/40 hover:bg-muted"
            }`}
            style={activeKid === kid.id ? { backgroundColor: kid.color } : {}}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeKid === kid.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            }`}>
              {kid.avatar}
            </span>
            {kid.name}
          </motion.button>
        ))}
      </div>

      {/* Progress bar */}
      {totalAssignments > 0 && (
        <div className="mb-4 h-1.5 rounded-full bg-border/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-sage"
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
            const colors = getSubjectColor(assignment.subject);
            const key = buildKey(week.weekLabel, activeKid, idx);
            const isDone = completed[key] ?? (assignment.status === "completed");
            const allLinks: AssignmentLink[] = [
              ...(assignment.link ? [assignment.link] : []),
              ...(assignment.links ?? []),
            ];

            return (
              <AnimatedCard key={idx} delay={idx}>
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`bg-card rounded-2xl p-4 border transition-all duration-300 ${
                    isDone ? "border-sage/30 dark:border-sage/20 opacity-60" : "border-border/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      onClick={() => toggleComplete(activeKid, idx)}
                      aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
                      whileTap={{ scale: 0.8 }}
                      className={`mt-0.5 shrink-0 transition-colors duration-200 ${
                        isDone ? "text-sage" : "text-muted-foreground/30 hover:text-sage/60"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                    </motion.button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                          {assignment.subject}
                        </span>
                        {isDone && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-light dark:bg-sage/15 text-sage">
                            Done
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-sm ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {assignment.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{assignment.description}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3 text-amber" />
                        <span className="text-xs text-amber font-medium">Due {formatDate(assignment.dueDate)}</span>
                      </div>
                      {allLinks.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/20">
                          {allLinks.map((lk, li) => <LinkButton key={li} link={lk} />)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            );
          })}

          {(!currentHomework || currentHomework.assignments.length === 0) && (
            <div className="bg-card rounded-2xl p-8 border border-border/40 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No homework assignments this week</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
