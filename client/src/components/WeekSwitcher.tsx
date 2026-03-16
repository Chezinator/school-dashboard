/**
 * WeekSwitcher — Arrow-based navigation to switch between archived weeks.
 * Shows the current week label with left/right arrows and a "Latest" badge.
 * Sunrise Command Center design: warm tones, rounded pill shape.
 */
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

export default function WeekSwitcher() {
  const { week, hasNewer, hasOlder, goNewer, goOlder, isLatest, totalWeeks } = useWeek();

  // Don't render if there's only one week
  if (totalWeeks <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <button
        onClick={goOlder}
        disabled={!hasOlder}
        className="w-9 h-9 rounded-xl bg-white border border-border/50 flex items-center justify-center disabled:opacity-25 hover:bg-gray-50 hover:shadow-sm transition-all"
        aria-label="Previous week"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border/50 shadow-sm">
        <Clock className="w-3.5 h-3.5 text-amber shrink-0" />
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {week.weekLabel}
        </span>
        {isLatest && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-light text-teal uppercase tracking-wide">
            Current
          </span>
        )}
        {!isLatest && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-light text-amber uppercase tracking-wide">
            Archive
          </span>
        )}
      </div>

      <button
        onClick={goNewer}
        disabled={!hasNewer}
        className="w-9 h-9 rounded-xl bg-white border border-border/50 flex items-center justify-center disabled:opacity-25 hover:bg-gray-50 hover:shadow-sm transition-all"
        aria-label="Next week"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
}
