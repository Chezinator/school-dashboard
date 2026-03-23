/**
 * MonthCalendar — Full monthly calendar view.
 * Consolidates importantDates + homework from ALL weeks into one view.
 * All events are shown equally — no dimming, no archive concept.
 */
import { useState, useMemo } from "react";
import { CaretLeft, CaretRight, ArrowSquareOut, X, CalendarDots } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

interface EventLink { url: string; label: string; }

interface CalendarEvent {
  date: string; endDate?: string; title: string; description?: string;
  type: string; kidId: string | null; subject?: string;
  link?: EventLink; links?: EventLink[];
}

const TYPE_CONFIG: Record<string, { dot: string; card: string; label: string }> = {
  test:     { dot: "bg-dh-coral",  card: "dh-card-coral",  label: "Assessment" },
  event:    { dot: "bg-dh-amber",  card: "dh-card-amber",  label: "Event" },
  school:   { dot: "bg-dh-teal",   card: "dh-card-teal",   label: "School" },
  holiday:  { dot: "bg-dh-blue",   card: "dh-card-blue",   label: "Holiday" },
  homework: { dot: "bg-dh-pink",   card: "dh-card-pink",   label: "Homework" },
};

function getConfig(type: string) { return TYPE_CONFIG[type] ?? TYPE_CONFIG["school"]; }

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
    <div className={`dh-card ${cfg.card} relative`}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
        aria-label="Close"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{cfg.label}</span>
        {item.subject && (
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">· {item.subject}</span>
        )}
        {kidObj && (
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: kidObj.color }}
          >
            {kidObj.name}
          </span>
        )}
      </div>

      <h3 className="font-display text-sm font-semibold leading-snug mb-1">{item.title}</h3>
      {item.description && (
        <p className="text-xs opacity-75 leading-relaxed mb-2">{item.description}</p>
      )}
      <p className="text-xs font-medium opacity-60">
        {item.type === "homework" ? "Due: " : ""}
        {formatShort(item.date)}
        {item.endDate && item.endDate !== item.date && ` — ${formatShort(item.endDate)}`}
      </p>

      {allLinks.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {allLinks.map((lnk, i) => (
            <a
              key={i}
              href={lnk.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
            >
              <ArrowSquareOut size={14} weight="bold" />
              {lnk.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MonthCalendar() {
  const { allWeeks, kids } = useWeek();

  // Consolidate ALL events from ALL weeks into one flat array
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const events: CalendarEvent[] = [];
    const seen = new Set<string>(); // deduplicate by title+date

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

  // Default to current month
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
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
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-all shrink-0"
          aria-label="Previous month"
        >
          <CaretLeft size={16} weight="bold" />
        </button>

        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-semibold tracking-tight">{monthName}</h3>
          {!isViewingCurrentMonth && (
            <button
              onClick={goToToday}
              className="text-xs font-semibold px-3 py-1 rounded-full bg-dh-coral/15 text-dh-coral hover:opacity-80 transition-opacity"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-all shrink-0"
          aria-label="Next month"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>

      {/* Calendar grid — solid cream card */}
      <div className="dh-card dh-card-cream !p-0 overflow-hidden">
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-2.5 text-center text-[10px] font-bold opacity-40 uppercase tracking-wider">
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
                  "transition-all duration-200",
                  !isCurrentMonth ? "opacity-0 pointer-events-none" : "",
                  hasEvents && !isSelected ? "hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer" : "",
                  isSelected ? "bg-black/8 dark:bg-white/8" : "",
                  !hasEvents && isCurrentMonth ? "cursor-default" : "",
                ].join(" ")}
                aria-label={iso
                  ? `${iso}${hasEvents ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}`
                  : undefined}
              >
                <span
                  className={[
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all",
                    isToday ? "bg-dh-coral text-white font-bold" : "",
                    isSelected && !isToday ? "bg-dh-charcoal text-white font-bold" : "",
                    !isCurrentMonth ? "opacity-20" : "",
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
                      <span className="text-[9px] opacity-40 font-medium leading-none">+</span>
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
          <span className="w-5 h-5 rounded-full bg-dh-coral flex items-center justify-center text-white text-[9px] font-bold shrink-0">T</span>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>
      </div>

      {/* Selected date event details */}
      <AnimatePresence>
        {selectedDate && selectedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-dh-amber" />
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
          </motion.div>
        )}
      </AnimatePresence>

      {allEvents.length === 0 && (
        <div className="dh-card dh-card-cream text-center py-8">
          <CalendarDots size={32} weight="duotone" className="opacity-20 mx-auto mb-2" />
          <p className="text-sm opacity-60">No dates or homework yet</p>
        </div>
      )}
    </section>
  );
}
