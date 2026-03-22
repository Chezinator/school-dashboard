/**
 * UpcomingDatesCard — Dayhaven mockup style:
 * Solid TEAL (dark) background with light text, upcoming dates listed.
 * No borders, no shadows.
 */
import { CalendarDays } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

function formatShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UpcomingDatesCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const dates = week.importantDates;
  const upcoming = dates.slice(0, 3);

  if (!upcoming.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-teal"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 opacity-80" />
        <h3 className="font-display text-sm font-semibold">Coming Up</h3>
      </div>

      <div className="space-y-2.5">
        {upcoming.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-wide shrink-0 w-12">
              {formatShort(item.date)}
            </span>
            <span className="text-xs font-medium leading-snug opacity-90 truncate">{item.title}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
