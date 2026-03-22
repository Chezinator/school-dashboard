/**
 * WeekSwitcher — Dayhaven aesthetic
 * Pill-shaped week navigation with rounded-full buttons, warm tones.
 */
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

export default function WeekSwitcher() {
  const { week, hasNewer, hasOlder, goNewer, goOlder, isLatest, totalWeeks } = useWeek();

  if (totalWeeks <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      <button
        onClick={goOlder}
        disabled={!hasOlder}
        className="w-9 h-9 rounded-full bg-card border border-border/40 flex items-center justify-center disabled:opacity-20 hover:bg-muted transition-all duration-200"
        aria-label="Previous week"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/40">
        <Clock className="w-3.5 h-3.5 text-amber shrink-0" />
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {week.weekLabel}
        </span>
        {isLatest && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sage-light dark:bg-sage/15 text-sage uppercase tracking-wider">
            Current
          </span>
        )}
        {!isLatest && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-light dark:bg-amber/15 text-amber uppercase tracking-wider">
            Archive
          </span>
        )}
      </div>

      <button
        onClick={goNewer}
        disabled={!hasNewer}
        className="w-9 h-9 rounded-full bg-card border border-border/40 flex items-center justify-center disabled:opacity-20 hover:bg-muted transition-all duration-200"
        aria-label="Next week"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
}
