/**
 * Homework — Assignments per kid with subject, due date, status, and embedded links.
 * Supports functional completion toggle stored in localStorage.
 * Sage/green accent for homework items.
 */
import { useState, useEffect, useCallback } from "react";
import { BookOpen, Calendar, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

interface AssignmentLink {
  url: string;
  label: string;
}

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
    case "writing":
      return { bg: "bg-coral-light dark:bg-coral/10", text: "text-coral", border: "border-coral/20" };
    case "math":
      return { bg: "bg-amber-light dark:bg-amber/10", text: "text-amber", border: "border-amber/20" };
    case "reading":
      return { bg: "bg-teal-light dark:bg-teal/10", text: "text-teal", border: "border-teal/20" };
    case "science":
      return { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400", border: "border-green-200" };
    case "phonics":
      return { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200" };
    default:
      return { bg: "bg-gray-50 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", border: "border-gray-200" };
  }
}

function LinkButton({ link }: { link: AssignmentLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground hover:opacity-80 text-background text-xs font-medium transition-opacity"
    >
      <ExternalLink className="w-3 h-3" />
      {link.label}
    </a>
  );
}

// Build a stable localStorage key for a homework item
function buildKey(weekLabel: string, kidId: string, idx: number) {
  return `schoolbase:hw:${weekLabel}:${kidId}:${idx}`;
}

export default function Homework() {
  const { week, kids } = useWeek();
  const homework = week.homework;
  const [activeKid, setActiveKid] = useState(kids[0].id);

  // Track completed state per assignment in localStorage
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Load from localStorage on mount / week / kid change
  useEffect(() => {
    const currentHomework = homework.find((h) => h.kidId === activeKid);
    if (!currentHomework) return;
    const loaded: Record<string, boolean> = {};
    currentHomework.assignments.forEach((_: Assignment, idx: number) => {
      const key = buildKey(week.weekLabel, activeKid, idx);
      const stored = localStorage.getItem(key);
      loaded[key] = stored === "true";
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

  // Count completed for badge
  const totalAssignments = currentHomework?.assignments.length ?? 0;
  const completedCount = currentHomework?.assignments.filter((_: Assignment, idx: number) => {
    const key = buildKey(week.weekLabel, activeKid, idx);
    return completed[key];
  }).length ?? 0;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-sage" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Homework</h2>
          {totalAssignments > 0 && (
            <p className="text-xs text-muted-foreground">
              {completedCount}/{totalAssignments} completed
            </p>
          )}
        </div>
      </div>

      {/* Kid tabs */}
      <div className="flex gap-2 mb-4">
        {kids.map((kid) => (
          <button
            key={kid.id}
            onClick={() => setActiveKid(kid.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeKid === kid.id
                ? "text-white shadow-md"
                : "bg-card text-foreground border border-border/50 hover:bg-muted"
            }`}
            style={activeKid === kid.id ? { backgroundColor: kid.color } : {}}
          >
            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              activeKid === kid.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
            }`}>
              {kid.avatar}
            </span>
            {kid.name}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {totalAssignments > 0 && (
        <div className="mb-4 h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${(completedCount / totalAssignments) * 100}%` }}
          />
        </div>
      )}

      {/* Assignments */}
      <div className="space-y-3">
        {currentHomework?.assignments.map((assignment: Assignment, idx: number) => {
          const colors = getSubjectColor(assignment.subject);
          const key = buildKey(week.weekLabel, activeKid, idx);
          const isDone = completed[key] ?? (assignment.status === "completed");

          // Collect all links for this assignment
          const allLinks: AssignmentLink[] = [
            ...(assignment.link ? [assignment.link] : []),
            ...(assignment.links ?? []),
          ];

          return (
            <div
              key={idx}
              className={`bg-card rounded-xl p-4 shadow-sm border transition-all duration-200 ${
                isDone
                  ? "border-green-200 dark:border-green-800 opacity-70"
                  : "border-border/50"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Completion toggle button */}
                <button
                  onClick={() => toggleComplete(activeKid, idx)}
                  aria-label={isDone ? "Mark as incomplete" : "Mark as complete"}
                  className={`mt-0.5 shrink-0 transition-all duration-200 hover:scale-110 active:scale-95 ${
                    isDone ? "text-green-500" : "text-muted-foreground/40 hover:text-green-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                <div className={`min-w-0 flex-1 transition-all duration-200 ${isDone ? "line-through-title" : ""}`}>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${colors.bg} ${colors.text}`}>
                      {assignment.subject}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold text-sm transition-all duration-200 ${
                    isDone ? "text-muted-foreground line-through" : "text-foreground"
                  }`}>
                    {assignment.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">{assignment.description}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3 text-amber" />
                    <span className="text-xs text-amber font-medium">Due {formatDate(assignment.dueDate)}</span>
                  </div>

                  {/* Embedded action links */}
                  {allLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/30">
                      {allLinks.map((lk, li) => (
                        <LinkButton key={li} link={lk} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {(!currentHomework || currentHomework.assignments.length === 0) && (
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border/50 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No homework assignments this week</p>
          </div>
        )}
      </div>
    </section>
  );
}
