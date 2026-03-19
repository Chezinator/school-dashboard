/**
 * MonthCalendar — SchoolBase Dashboard Component
 * Design: Sunrise Command Center — warm coral, amber, teal palette
 *
 * Monthly calendar view for the Dates tab.
 * - Color-coded event dots per type (red=test, amber=event, teal=school)
 * - Tap a date to see event details in an expandable panel below
 * - Month navigation arrows
 * - Mobile-first, dark mode compatible
 * - Multi-day events (endDate) are highlighted across the range
 */

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, BookOpen, PartyPopper, Star, CalendarDays, ExternalLink, X } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

interface EventLink {
  url: string;
  label: string;
}

interface DateItem {
  date: string;
  endDate?: string;
  title: string;
  description?: string;
  type: string;
  kidId: string | null;
  link?: EventLink;
}

// ── Color config per event type ──────────────────────────────────────────────

const TYPE_CONFIG: Record<string, {
  dot: string;
  bg: string;
  text: string;
  border: string;
  badge: string;
  label: string;
  icon: React.ReactNode;
}> = {
  test: {
    dot: "bg-red-500",
    bg: "bg-red-50 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    label: "Assessment",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
  event: {
    dot: "bg-amber-500",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
    badge: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
    label: "Event",
    icon: <PartyPopper className="w-3.5 h-3.5" />,
  },
  school: {
    dot: "bg-teal-500",
    bg: "bg-teal-50 dark:bg-teal-900/20",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-200 dark:border-teal-800",
    badge: "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300",
    label: "School",
    icon: <Star className="w-3.5 h-3.5" />,
  },
  holiday: {
    dot: "bg-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    label: "Holiday",
    icon: <CalendarDays className="w-3.5 h-3.5" />,
  },
};

function getConfig(type: string) {
  return TYPE_CONFIG[type] ?? TYPE_CONFIG["school"];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toDateObj(dateStr: string) {
  return new Date(dateStr + "T00:00:00");
}

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatFull(dateStr: string) {
  return toDateObj(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatShort(dateStr: string) {
  return toDateObj(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

// Returns all ISO date strings that a date item spans (inclusive)
function getSpannedDates(item: DateItem): string[] {
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

// ── Sub-components ────────────────────────────────────────────────────────────

function EventDetailCard({
  item,
  kids,
  onClose,
}: {
  item: DateItem;
  kids: Array<{ id: string; name: string; color: string }>;
  onClose: () => void;
}) {
  const cfg = getConfig(item.type);
  const kidObj = item.kidId ? kids.find((k) => k.id === item.kidId) : null;

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* Colored top bar */}
      <div className={`h-1 w-full ${cfg.dot}`} />
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badge}`}>
              {cfg.icon}
              {cfg.label}
            </span>
            {kidObj && (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: kidObj.color }}
              >
                {kidObj.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center hover:bg-black/20 dark:hover:bg-white/20 transition-colors"
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
          {formatShort(item.date)}
          {item.endDate && item.endDate !== item.date && ` — ${formatShort(item.endDate)}`}
        </p>

        {item.link && (
          <div className="mt-2.5 pt-2.5 border-t border-black/10 dark:border-white/10">
            <a
              href={item.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {item.link.label}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function MonthCalendar() {
  const { week, kids } = useWeek();
  const dates: DateItem[] = week.importantDates ?? [];

  // Determine the initial month from the week's first event date, or current month
  const firstEventDate = dates[0]?.date
    ? toDateObj(dates[0].date)
    : new Date();
  const [viewYear, setViewYear] = useState(firstEventDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(firstEventDate.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map: ISO date string → list of events
  const eventMap = useMemo(() => {
    const map: Record<string, DateItem[]> = {};
    for (const item of dates) {
      const spanned = getSpannedDates(item);
      for (const d of spanned) {
        if (!map[d]) map[d] = [];
        map[d].push(item);
      }
    }
    return map;
  }, [dates]);

  // Calendar grid computation
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Sun
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

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const selectedEvents = selectedDate ? (eventMap[selectedDate] ?? []) : [];

  return (
    <section className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-foreground" />
        </button>
        <h3 className="font-display text-lg text-foreground font-semibold">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-border/40">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-2 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
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

            // Limit visible dots to 3
            const visibleDots = events.slice(0, 3);

            return (
              <button
                key={cellIdx}
                disabled={!isCurrentMonth || !hasEvents}
                onClick={() => {
                  if (!iso) return;
                  setSelectedDate(prev => prev === iso ? null : iso);
                }}
                className={`
                  relative flex flex-col items-center justify-start pt-1.5 pb-1.5 min-h-[52px] sm:min-h-[60px]
                  border-b border-r border-border/20 last:border-r-0
                  transition-all duration-150
                  ${!isCurrentMonth ? "opacity-0 pointer-events-none" : ""}
                  ${hasEvents && !isSelected ? "hover:bg-muted/50 cursor-pointer" : ""}
                  ${isSelected ? "bg-amber/10 dark:bg-amber/15" : ""}
                  ${!hasEvents && isCurrentMonth ? "cursor-default" : ""}
                `}
                aria-label={iso ? `${iso}${hasEvents ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}` : undefined}
              >
                {/* Date number */}
                <span
                  className={`
                    w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all
                    ${isToday ? "bg-coral text-white font-bold" : ""}
                    ${isSelected && !isToday ? "bg-amber text-white font-bold" : ""}
                    ${!isToday && !isSelected && isCurrentMonth ? "text-foreground" : ""}
                    ${!isCurrentMonth ? "text-muted-foreground/30" : ""}
                  `}
                >
                  {isCurrentMonth ? dayNum : ""}
                </span>

                {/* Event dots */}
                {hasEvents && (
                  <div className="flex items-center gap-0.5 mt-1">
                    {visibleDots.map((ev, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${getConfig(ev.type).dot}`}
                      />
                    ))}
                    {events.length > 3 && (
                      <span className="text-[9px] text-muted-foreground font-medium">+</span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-full bg-coral flex items-center justify-center text-white text-[10px] font-bold">T</span>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>

      {/* Selected date event details */}
      {selectedDate && selectedEvents.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-amber" />
            <p className="text-sm font-semibold text-foreground">
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

      {/* Empty state for selected date with no events (shouldn't happen, but guard) */}
      {selectedDate && selectedEvents.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No events on this date.
        </div>
      )}

      {/* No events in this month hint */}
      {dates.length === 0 && (
        <div className="bg-card rounded-xl p-8 border border-border/60 text-center">
          <CalendarDays className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No important dates this week</p>
        </div>
      )}
    </section>
  );
}
