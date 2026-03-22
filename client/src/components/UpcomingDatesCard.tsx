/**
 * UpcomingDatesCard — Shows next 3 upcoming dates.
 * Clickable to jump to Dates tab.
 * Sage green card. Phosphor icon.
 */
import { CalendarDots } from "@phosphor-icons/react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

interface Props {
  delay?: number;
  onNavigate?: () => void;
}

function formatShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

export default function UpcomingDatesCard({ delay = 0, onNavigate }: Props) {
  const { week } = useWeek();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [...week.importantDates]
    .filter((d) => new Date(d.date + "T00:00:00") >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  if (!upcoming.length) return null;

  return (
    <motion.button
      onClick={onNavigate}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-sage w-full text-left cursor-pointer flex flex-col"
      aria-label="View all dates"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDots size={18} weight="duotone" className="opacity-70" />
        <h3 className="font-display text-sm font-semibold">Upcoming Dates</h3>
      </div>

      <div className="space-y-2.5">
        {upcoming.map((item, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-wide shrink-0 w-12 pt-0.5">
              {formatShort(item.date)}
            </span>
            <span className="text-xs font-medium leading-snug opacity-90">{item.title}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-semibold opacity-40 mt-3 uppercase tracking-wider">View calendar →</p>
    </motion.button>
  );
}
