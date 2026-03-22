/**
 * UpcomingDatesCard — Compact smart card for the home screen.
 * Shows the next 2-3 upcoming dates at a glance.
 */
import { CalendarDays, BookOpen, PartyPopper, Star } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

function getTypeIcon(type: string) {
  switch (type) {
    case "test":   return <BookOpen className="w-3.5 h-3.5 text-coral" />;
    case "event":  return <PartyPopper className="w-3.5 h-3.5 text-amber" />;
    case "school": return <Star className="w-3.5 h-3.5 text-teal" />;
    default:       return <CalendarDays className="w-3.5 h-3.5 text-sage" />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "test":   return "bg-coral-light dark:bg-coral/12";
    case "event":  return "bg-amber-light dark:bg-amber/12";
    case "school": return "bg-teal-light dark:bg-teal/12";
    default:       return "bg-sage-light dark:bg-sage/12";
  }
}

function formatShort(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UpcomingDatesCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const dates = week.importantDates;

  // Show up to 3 upcoming dates
  const upcoming = dates.slice(0, 3);
  if (!upcoming.length) return null;

  return (
    <AnimatedCard delay={delay}>
      <div className="bg-card rounded-2xl p-4 border border-border/40 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-light dark:bg-sage/15 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-sage" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Coming Up</h3>
            <p className="text-xs text-muted-foreground">{dates.length} dates this week</p>
          </div>
        </div>

        <div className="space-y-2">
          {upcoming.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-xl ${getTypeBg(item.type)} flex items-center justify-center shrink-0`}>
                {getTypeIcon(item.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
              </div>
              <span className="text-xs text-amber font-medium shrink-0">{formatShort(item.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
}
