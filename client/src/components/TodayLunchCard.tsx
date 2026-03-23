/**
 * TodayLunchCard — Shows next 3 days of lunch menu.
 * Clickable to jump to full menu in More tab.
 * Coral card. Phosphor icon in title.
 */
import { useWeek } from "@/contexts/WeekContext";
import { ForkKnife } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface Props {
  delay?: number;
  onNavigate?: () => void;
}

export default function TodayLunchCard({ delay = 0, onNavigate }: Props) {
  const { week } = useWeek();
  const menu = week.lunchMenu;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayDayName = dayNames[today.getDay()];

  // Sort menu by actual date, then show today + next 2 upcoming school days
  const sortedMenu = [...menu].sort(
    (a, b) => new Date(a.date + "T00:00:00").getTime() - new Date(b.date + "T00:00:00").getTime()
  );
  const upcomingDays = sortedMenu
    .filter((m) => new Date(m.date + "T00:00:00") >= today)
    .slice(0, 3);

  if (!upcomingDays.length) return null;

  return (
    <motion.button
      onClick={onNavigate}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-coral text-left w-full cursor-pointer flex flex-col"
      aria-label="View full lunch menu"
    >
      <div className="flex items-center gap-2 mb-3">
        <ForkKnife size={18} weight="duotone" className="opacity-70" />
        <h3 className="font-display text-sm font-semibold">Lunch Menu</h3>
      </div>

      <div className="space-y-2.5">
        {upcomingDays.map((day, i) => {
          const isToday = day.day === todayDayName;
          return (
            <div key={day.day}>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-0.5">
                {isToday ? "Today" : day.day.slice(0, 3)}
              </p>
              <p className="text-xs font-medium leading-snug truncate">{day.entrees[0]}</p>
              {day.entrees[1] && (
                <p className="text-xs opacity-65 leading-snug truncate">{day.entrees[1]}</p>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-semibold opacity-40 mt-3 uppercase tracking-wider">View full menu →</p>
    </motion.button>
  );
}
