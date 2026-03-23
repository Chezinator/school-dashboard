/**
 * WeeklyCalendar — Day-by-day view of the current week.
 * Shows Monday through Friday as rows, with all events for each day listed.
 * Color-coded event cards match the calendar dot colors and card styles.
 */
import { useMemo, useState } from "react";
import { ArrowSquareOut, CalendarDots, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

interface EventLink { url: string; label: string; }

interface CalendarEvent {
  date: string; endDate?: string; title: string; description?: string;
  type: string; kidId: string | null; subject?: string;
  link?: EventLink; links?: EventLink[];
}

/* ── Color mapping — MUST match MonthCalendar TYPE_CONFIG ── */
const TYPE_CONFIG: Record<string, { dot: string; card: string; label: string }> = {
  test:     { dot: "bg-dh-coral",  card: "dh-card-coral",  label: "Assessment" },
  event:    { dot: "bg-dh-amber",  card: "dh-card-amber",  label: "Event" },
  school:   { dot: "bg-dh-sage",   card: "dh-card-sage",   label: "School" },
  holiday:  { dot: "bg-dh-teal",   card: "dh-card-teal",   label: "Holiday" },
  homework: { dot: "bg-dh-pink",   card: "dh-card-pink",   label: "Homework" },
};

function getConfig(type: string) { return TYPE_CONFIG[type] ?? TYPE_CONFIG["school"]; }

function toDateObj(dateStr: string) { return new Date(dateStr + "T00:00:00"); }

function isoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDayHeader(dateStr: string) {
  const d = toDateObj(dateStr);
  return {
    dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
    dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function getSpannedDates(item: CalendarEvent): string[] {
  const start = toDateObj(item.date);
  const end = item.endDate ? toDateObj(item.endDate) : start;
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(isoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export default function WeeklyCalendar() {
  const { week, allWeeks, kids } = useWeek();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  // Get the Monday–Friday dates for the current week
  const weekDays = useMemo(() => {
    const weekOf = toDateObj(week.weekOf);
    // weekOf is a Monday typically, but let's find the Monday of that week
    const dayOfWeek = weekOf.getDay();
    const monday = new Date(weekOf);
    // If weekOf is Sunday (0), go back 6 days; otherwise go back to Monday
    if (dayOfWeek === 0) monday.setDate(monday.getDate() + 1);
    else if (dayOfWeek !== 1) monday.setDate(monday.getDate() - (dayOfWeek - 1));

    const days: string[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(isoDate(d));
    }
    return days;
  }, [week.weekOf]);

  // Consolidate all events from all weeks
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    const seen = new Set<string>();

    for (const wk of allWeeks) {
      for (const item of (wk.importantDates ?? [])) {
        const key = `${item.date}|${item.title}`;
        if (seen.has(key)) continue;
        seen.add(key);
        events.push({
          date: item.date, endDate: (item as any).endDate, title: item.title,
          description: (item as any).description, type: item.type,
          kidId: item.kidId, link: (item as any).link,
        });
      }
      for (const kidHw of (wk.homework ?? [])) {
        for (const assignment of kidHw.assignments) {
          if (!assignment.dueDate) continue;
          const key = `${assignment.dueDate}|${assignment.title}|${kidHw.kidId}`;
          if (seen.has(key)) continue;
          seen.add(key);
          events.push({
            date: assignment.dueDate, title: assignment.title,
            description: assignment.description, type: "homework",
            kidId: kidHw.kidId, subject: assignment.subject,
            link: (assignment as any).link, links: (assignment as any).links,
          });
        }
      }
    }
    return events;
  }, [allWeeks]);

  // Build event map: date → events[]
  const eventMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const item of allEvents) {
      for (const d of getSpannedDates(item)) {
        if (!map[d]) map[d] = [];
        map[d].push(item);
      }
    }
    return map;
  }, [allEvents]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = isoDate(today);

  return (
    <section className="space-y-3">
      {weekDays.map((dateStr, dayIdx) => {
        const { dayName, dateLabel } = formatDayHeader(dateStr);
        const events = eventMap[dateStr] ?? [];
        const isToday = dateStr === todayISO;

        return (
          <motion.div
            key={dateStr}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24, delay: dayIdx * 0.04 }}
          >
            {/* Day header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                  isToday
                    ? "bg-dh-coral text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <span className="text-[9px] font-bold uppercase leading-none tracking-wider">
                  {dayName.slice(0, 3)}
                </span>
                <span className={`text-sm font-bold leading-tight ${isToday ? "" : ""}`}>
                  {toDateObj(dateStr).getDate()}
                </span>
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${isToday ? "text-dh-coral" : "text-foreground"}`}>
                  {dayName}
                </h3>
                <p className="text-[11px] text-muted-foreground">{dateLabel}</p>
              </div>
              {isToday && (
                <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-bold bg-dh-coral/15 text-dh-coral uppercase tracking-wider">
                  Today
                </span>
              )}
            </div>

            {/* Events for this day */}
            {events.length > 0 ? (
              <div className="ml-[52px] space-y-2 mb-4">
                {events.map((ev, evIdx) => {
                  const cfg = getConfig(ev.type);
                  const kidObj = ev.kidId ? kids.find((k) => k.id === ev.kidId) : null;
                  const eventKey = `${dateStr}-${evIdx}`;
                  const isExpanded = expandedEvent === eventKey;
                  const allLinks: EventLink[] = [
                    ...(ev.link ? [ev.link] : []),
                    ...(ev.links ?? []),
                  ];

                  return (
                    <motion.button
                      key={evIdx}
                      onClick={() => setExpandedEvent(isExpanded ? null : eventKey)}
                      className={`dh-card ${cfg.card} !p-3 w-full text-left transition-all`}
                      whileHover={{ y: -1 }}
                      layout
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                          {cfg.label}
                        </span>
                        {ev.subject && (
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                            · {ev.subject}
                          </span>
                        )}
                        {kidObj && (
                          <span
                            className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
                            style={{ backgroundColor: kidObj.color }}
                          >
                            {kidObj.name}
                          </span>
                        )}
                      </div>
                      <h4 className="font-display text-xs font-semibold leading-snug mt-1">
                        {ev.title}
                      </h4>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            className="overflow-hidden"
                          >
                            {ev.description && (
                              <p className="text-[11px] opacity-75 leading-relaxed mt-2">
                                {ev.description}
                              </p>
                            )}
                            {allLinks.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {allLinks.map((lnk, i) => (
                                  <a
                                    key={i}
                                    href={lnk.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                                  >
                                    <ArrowSquareOut size={12} weight="bold" />
                                    {lnk.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="ml-[52px] mb-4">
                <p className="text-xs text-muted-foreground/50 italic py-2">No events</p>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-1 pt-2">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
