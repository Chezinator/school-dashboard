/**
 * ImportantDates — List view of all dates from ALL weeks.
 * Color-blocked cards per event type. Past events dimmed.
 * Tests = coral, Events = amber, School = sage, Holidays = teal.
 */
import { useMemo } from "react";
import { ArrowSquareOut, CalendarCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

interface EventLink { url: string; label: string; }

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getTypeCard(type: string) {
  switch (type) {
    case "test":    return "dh-card-coral";
    case "event":   return "dh-card-amber";
    case "school":  return "dh-card-sage";
    case "holiday": return "dh-card-teal";
    default:        return "dh-card-cream";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "test":    return "Assessment";
    case "event":   return "Event";
    case "school":  return "School";
    case "holiday": return "Holiday";
    default:        return "Date";
  }
}

export default function ImportantDates() {
  const { allWeeks, kids } = useWeek();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Consolidate all importantDates from all weeks, deduplicate, sort by date
  const allDates = useMemo(() => {
    const seen = new Set<string>();
    const items: Array<{
      date: string; endDate?: string; title: string; description?: string;
      type: string; kidId: string | null; link?: EventLink;
    }> = [];

    for (const wk of allWeeks) {
      for (const item of wk.importantDates ?? []) {
        const key = `${item.date}|${item.title}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({
          date: item.date,
          endDate: (item as any).endDate,
          title: item.title,
          description: (item as any).description,
          type: item.type,
          kidId: item.kidId,
          link: (item as any).link,
        });
      }
    }

    return items.sort((a, b) => a.date.localeCompare(b.date));
  }, [allWeeks]);

  if (!allDates.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <CalendarCheck size={22} weight="duotone" className="text-dh-sage" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Important Dates</h2>
      </div>

      <div className="space-y-3">
        {allDates.map((item, idx) => {
          const kid = item.kidId ? kids.find((k) => k.id === item.kidId) : null;
          const isPast = new Date(item.date + "T00:00:00") < today;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className={`dh-card ${getTypeCard(item.type)} ${isPast ? "opacity-55" : ""}`}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  {getTypeLabel(item.type)}
                </span>
                {kid && (
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: kid.color }}
                  >
                    {kid.name}
                  </span>
                )}
                {isPast && (
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 italic">Past</span>
                )}
              </div>
              <h3 className="font-display text-sm font-semibold leading-snug mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs leading-relaxed opacity-75 mb-2">{item.description}</p>
              )}
              <p className="text-xs font-medium opacity-60">
                {formatDate(item.date)}
                {item.endDate && ` — ${formatDate(item.endDate)}`}
              </p>
              {item.link && (
                <a
                  href={item.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                >
                  <ArrowSquareOut size={14} weight="bold" />
                  {item.link.label}
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
