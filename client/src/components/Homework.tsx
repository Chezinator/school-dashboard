/**
 * Homework — Assignments per kid with subject, due date, status, and embedded links.
 * Sage/green accent for homework items.
 * Supports `link` (single) and `links` (array) on each assignment for embedded action buttons.
 */
import { useState } from "react";
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
      return { bg: "bg-coral-light", text: "text-coral", border: "border-coral/20" };
    case "math":
      return { bg: "bg-amber-light", text: "text-amber", border: "border-amber/20" };
    case "reading":
      return { bg: "bg-teal-light", text: "text-teal", border: "border-teal/20" };
    case "science":
      return { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" };
    case "phonics":
      return { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
  }
}

function LinkButton({ link }: { link: AssignmentLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      {link.label}
    </a>
  );
}

export default function Homework() {
  const { week, kids } = useWeek();
  const homework = week.homework;
  const [activeKid, setActiveKid] = useState(kids[0].id);

  const currentHomework = homework.find((h) => h.kidId === activeKid);

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-sage" />
        </div>
        <h2 className="font-display text-xl text-foreground">Homework</h2>
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
                : "bg-white text-foreground border border-border/50 hover:bg-gray-50"
            }`}
            style={activeKid === kid.id ? { backgroundColor: kid.color } : {}}
          >
            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
              activeKid === kid.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
            }`}>
              {kid.avatar}
            </span>
            {kid.name}
          </button>
        ))}
      </div>

      {/* Assignments */}
      <div className="space-y-3">
        {currentHomework?.assignments.map((assignment: Assignment, idx: number) => {
          const colors = getSubjectColor(assignment.subject);
          // Collect all links for this assignment
          const allLinks: AssignmentLink[] = [
            ...(assignment.link ? [assignment.link] : []),
            ...(assignment.links ?? []),
          ];

          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-border/50 card-homework"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {assignment.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${colors.bg} ${colors.text}`}>
                      {assignment.subject}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{assignment.title}</h3>
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-border/50 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">No homework assignments this week</p>
          </div>
        )}
      </div>
    </section>
  );
}
