/**
 * TodayScheduleCard — Matches the Dayhaven mockup exactly:
 * Solid SAGE GREEN background, "Today's Schedule" serif heading,
 * time + event stacked vertically. No borders, no shadows.
 */
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

export default function TodayScheduleCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const dates = week.importantDates;

  // Get today's and upcoming events (next 3-4)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // Build a simple schedule from important dates and action items
  const scheduleItems: { time: string; label: string }[] = [];

  // Add upcoming dates as schedule items
  for (const d of dates.slice(0, 4)) {
    const eventDate = new Date(d.date + "T00:00:00");
    const timeStr = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    scheduleItems.push({ time: timeStr, label: d.title });
  }

  // If no dates, show a default
  if (scheduleItems.length === 0) {
    scheduleItems.push({ time: "Today", label: "No events scheduled" });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-sage min-h-[200px] flex flex-col"
    >
      <h3 className="font-display text-lg font-semibold mb-4 leading-tight">
        Upcoming<br />Dates
      </h3>
      <div className="space-y-3 flex-1">
        {scheduleItems.slice(0, 4).map((item, i) => (
          <div key={i} className="flex flex-col">
            <span className="text-xs font-bold opacity-70 uppercase tracking-wide">{item.time}</span>
            <span className="text-sm font-medium leading-snug">{item.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
