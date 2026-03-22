/**
 * TodayLunchCard — Compact smart card for the home screen.
 * Shows today's (or next school day's) lunch entrees at a glance.
 */
import { UtensilsCrossed } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

export default function TodayLunchCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const menu = week.lunchMenu;

  // Find today's day name
  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];

  // Find matching menu item, fallback to first
  const todayMenu = menu.find((m) => m.day === todayName) || menu[0];
  const displayDay = todayMenu?.day === todayName ? "Today" : todayMenu?.day || "Monday";

  if (!todayMenu) return null;

  return (
    <AnimatedCard delay={delay}>
      <div className="bg-card rounded-2xl p-4 border border-border/40 hover:shadow-md transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-light dark:bg-amber/15 flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-amber" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{displayDay}'s Lunch</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {todayMenu.entrees.slice(0, 3).map((entree, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-light dark:bg-amber/12 text-foreground text-xs font-medium"
                >
                  {entree}
                </span>
              ))}
              {todayMenu.entrees.length > 3 && (
                <span className="text-xs text-muted-foreground self-center">+{todayMenu.entrees.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
}
