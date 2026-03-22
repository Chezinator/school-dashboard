/**
 * TodayLunchCard — Matches the Dayhaven mockup exactly:
 * Solid CORAL/SALMON background, "Lunch Menu" serif heading,
 * menu items listed vertically. No borders, no shadows.
 */
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

export default function TodayLunchCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const menu = week.lunchMenu;

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];
  const todayMenu = menu.find((m) => m.day === todayName) || menu[0];
  const displayDay = todayMenu?.day === todayName ? "Today's" : todayMenu?.day + "'s";

  if (!todayMenu) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-coral min-h-[200px] flex flex-col"
    >
      <h3 className="font-display text-lg font-semibold mb-4 leading-tight">
        Lunch<br />Menu
      </h3>
      <div className="space-y-1.5 flex-1">
        {todayMenu.entrees.map((entree, i) => (
          <p key={i} className="text-sm font-medium leading-snug">{entree}</p>
        ))}
      </div>
    </motion.div>
  );
}
