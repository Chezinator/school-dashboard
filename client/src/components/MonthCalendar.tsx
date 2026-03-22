/**
 * MonthCalendar — Dayhaven aesthetic
 * Warm cream base, rounded-2xl cards, pill buttons, color-coded event dots,
 * homework integration, tap-to-view details, dark mode compatible.
 */

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  PartyPopper,
  Star,
  CalendarDays,
  ExternalLink,
  X,
  GraduationCap,
} from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

// ── Types ────────────────────────────────────────────────────────────────────

interface EventLink { url: string; label: string; }

interface CalendarEvent {
  date: string;
  endDate?: string;
  title: string;
  description?: string;
  type: string;
  kidId: string | null;
  subject?: string;
  link?: EventLink;
  links?: EventLink[];
}

// ── Color config ─────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
  dot: string; bg: string; text: string; border: string;
  badge: string; label: string; icon: React.ReactNode;
}> = {
  test: {
    dot: "bg-coral",
    bg: "bg-coral-light dark:bg-coral/12",
    text: "text-coral",
    border: "border-coral/20 dark:border-coral/30",
    badge: "bg-coral-light dark:bg-coral/15 text-coral",
    label: "Assessment",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  event: {
    dot: "bg-amber",
    bg: "bg-amber-light dark:bg-amber/12",
    text: "text-amber",
    border: "border-amber/20 dark:border-amber/30",
    badge: "bg-amber-light dark:bg-amber/15 text-amber",
    label: "Event",
    icon: <PartyPopper className="w-3.5 h-3.5" />,
  },
  school: {
    dot: "bg-teal",
    bg: "bg-teal-light dark:bg-teal/12",
    text: "text-teal",
    border: "border-teal/20 dark:border-teal/30",
    badge: "bg-teal-light dark:bg-teal/15 text-teal",
    label: "School",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  holiday: {
    dot: "bg-sage",
    bg: "bg-sage-light dark:bg-sage/12",
    text: "text-sage",
    border: "border-sage/20 dark:border-sage/30",
    badge: "bg-sage-light dark:bg-sage/15 text-sage",
    label: "Holiday",
    icon: <CalendarDays className="w-3.5 h-3.5" />,
  },
  homework: {
    dot: "bg-violet-500",
    bg: "bg-violet-50 dark:bg-violet-900/15",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-200/40 dark:border-violet-700/30",
    badge: "bg-violet-50 dark:bg-violet-900/15 text-violet-600 dark:text-violet-400",
    label: "Homework",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
};

function getConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG["school"];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateObj(dateStr: string) { return new Date(dateStr + "T00:00:00"); }

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatFull(dateStr: string) {
  return toDateObj(dateStr).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function formatShort(dateStr: string) {
  return toDateObj(dateStr).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });
}

function getSpannedDates(item: CalendarEvent): string[] {
  const start = toDateObj(item.date);
  const end = item.endDate ? toDateObj(item.endDate) : start;
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

// ── Event Detail Card ────────────────────────────────────────────────────────

function EventDetailCard({
  item, kids, onClose,
}: {
  item: CalendarEvent;
  kids: Array<{ id: string; name: string; color: string }>;
  onClose: () => void;
}) {
  const cfg = getConfig(item.type);
  const kidObj = item.kidId ? kids.find((k) => k.id === item.kidId) : null;

  const allLinks: EventLink[] = [];
  if (item.link) allLinks.push(item.link);
  if (item.links) allLinks.push(...item.links);

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      <div className={`h-1 w-full ${cfg.dot}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
              {cfg.icon}
              {cfg.label}
            </span>
            {item.subject && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-900/15 text-violet-600 dark:text-violet-400">
                {item.subject}
              </span>
            )}
            {kidObj && (
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: kidObj.color }}
              >
                {kidObj.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-full bg-foreground/8 flex items-center justify-center hover:bg-foreground/15 transition-colors"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5 text-foreground" />
          </button>
        </div>

        <h3 className={`font-semibold text-sm leading-snug mb-1 ${cfg.text}`}>{item.title}</h3>
        {item.description && (
          <p className="text-xs text-foreground/70 leading-relaxed mb-2">{item.description}</p>
        )}
        <p className="text-xs font-medium text-muted-foreground">
          {item.type === "homework" ? "Due: " : ""}
          {formatShort(item.date)}
          {item.endDate && item.endDate !== item.date && ` — ${formatShort(item.endDate)}`}
        </p>

        {allLinks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-foreground/8 flex flex-wrap gap-2">
            {allLinks.map((lnk, i) => (
              <a
                key={i}
                href={lnk.url}
                target="_blank"
                rel="noopener noreferrer"
                className="pill-cta text-xs py-1.5 px-4"
              >
                <ExternalLink className="w-3 h-3" />
                {lnk.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function MonthCalendar() {
  const { week, kids } = useWeek();

  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    for (const item of (week.importantDates ?? [])) {
      events.push({
        date: item.date, endDate: (item as any).endDate, title: item.title,
        description: (item as any).description, type: item.type,
        kidId: item.kidId, link: (item as any).link,
      });
    }
    for (const kidHw of (week.homework ?? [])) {
      for (const assignment of kidHw.assignments) {
        if (!assignment.dueDate) continue;
        events.push({
          date: assignment.dueDate, title: assignment.title,
          description: assignment.description, type: "homework",
          kidId: kidHw.kidId, subject: assignment.subject,
          link: (assignment as any).link, links: (assignment as any).links,
        });
      }
    }
    return events;
  }, [week]);

  const firstEventDate = allEvents[0]?.date ? toDateObj(allEvents[0].date) : new Date();
  const [viewYear, setViewYear] = useState(firstEventDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(firstEventDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const today = new Date();
  const todayISO = isoDate(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDate(null);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDate(null);
  }
  function goToToday() {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(null);
  }

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });

  const isViewingCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();
  const selectedEvents = selectedDate ? (eventMap[selectedDate] ?? []) : [];

  return (
    <section className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full bg-card border border-border/40 flex items-center justify-center hover:bg-muted transition-all duration-200 shrink-0"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg text-foreground font-semibold tracking-tight">{monthName}</h3>
          {!isViewingCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-coral-light dark:bg-coral/15 text-coral hover:opacity-80 transition-opacity"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full bg-card border border-border/40 flex items-center justify-center hover:bg-muted transition-all duration-200 shrink-0"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-border/30">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-2.5 text-center text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: totalCells }).map((_, cellIdx) => {
            const dayNum = cellIdx - firstDayOfWeek + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
            const iso = isCurrentMonth ? isoDate(viewYear, viewMonth, dayNum) : null;
            const events = iso ? (eventMap[iso] ?? []) : [];
            const isToday = iso === todayISO;
            const isSelected = iso === selectedDate;
            const hasEvents = events.length > 0;
            const uniqueTypes = Array.from(new Set(events.map(e => e.type))).slice(0, 3);

            return (
              <button
                key={cellIdx}
                disabled={!isCurrentMonth || !hasEvents}
                onClick={() => {
                  if (!iso) return;
                  setSelectedDate(prev => prev === iso ? null : iso);
                }}
                className={[
                  "relative flex flex-col items-center justify-start pt-1.5 pb-1.5 min-h-[52px] sm:min-h-[60px]",
                  "border-b border-r border-border/15 last:border-r-0",
                  "transition-all duration-200",
                  !isCurrentMonth ? "opacity-0 pointer-events-none" : "",
                  hasEvents && !isSelected ? "hover:bg-muted/40 cursor-pointer" : "",
                  isSelected ? "bg-amber/8 dark:bg-amber/12" : "",
                  !hasEvents && isCurrentMonth ? "cursor-default" : "",
                ].join(" ")}
                aria-label={iso
                  ? `${iso}${hasEvents ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}`
                  : undefined}
              >
                <span
                  className={[
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all",
                    isToday ? "bg-coral text-white font-bold" : "",
                    isSelected && !isToday ? "bg-amber text-white font-bold" : "",
                    !isToday && !isSelected && isCurrentMonth ? "text-foreground" : "",
                    !isCurrentMonth ? "text-muted-foreground/30" : "",
                  ].join(" ")}
                >
                  {isCurrentMonth ? dayNum : ""}
                </span>

                {hasEvents && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {uniqueTypes.map((type, i) => (
                      <span key={i} className={`w-1.5 h-1.5 rounded-full ${getConfig(type).dot}`} />
                    ))}
                    {events.length > 3 && (
                      <span className="text-[9px] text-muted-foreground font-medium leading-none">+</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-1">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cfg.dot}`} />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-coral flex items-center justify-center text-white text-[9px] font-bold shrink-0">T</span>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>

      {/* Selected date event details */}
      {selectedDate && selectedEvents.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-amber" />
            <p className="text-sm font-display font-semibold text-foreground">
              {formatFull(selectedDate)}
            </p>
          </div>
          {selectedEvents.map((ev, idx) => (
            <EventDetailCard
              key={idx}
              item={ev}
              kids={kids}
              onClose={() => setSelectedDate(null)}
            />
          ))}
        </div>
      )}

      {allEvents.length === 0 && (
        <div className="bg-card rounded-2xl p-8 border border-border/40 text-center">
          <CalendarDays className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No dates or homework this week</p>
        </div>
      )}
    </section>
  );
}
