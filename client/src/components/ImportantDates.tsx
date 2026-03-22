/**
 * ImportantDates — Dayhaven mockup style:
 * Color-blocked cards per event type. No borders, no shadows.
 * Tests = coral, Events = amber, School = sage, Holidays = teal.
 */
import { ExternalLink } from "lucide-react";
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
  const { week, kids } = useWeek();
  const dates = week.importantDates;
  if (!dates.length) return null;

  return (
    <section>
      <h2 className="font-display text-xl text-foreground tracking-tight mb-4">Important Dates</h2>

      <div className="space-y-3">
        {dates.map((item, idx) => {
          const kid = item.kidId ? kids.find((k) => k.id === item.kidId) : null;
          const eventLink = (item as any).link as EventLink | undefined;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className={`dh-card ${getTypeCard(item.type)}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
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
              </div>
              <h3 className="font-display text-sm font-semibold leading-snug mb-1">{item.title}</h3>
              {(item as any).description && (
                <p className="text-xs leading-relaxed opacity-75 mb-2">{(item as any).description}</p>
              )}
              <p className="text-xs font-medium opacity-60">
                {formatDate(item.date)}
                {(item as any).endDate && ` — ${formatDate((item as any).endDate)}`}
              </p>
              {eventLink && (
                <a
                  href={eventLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  {eventLink.label}
                </a>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
