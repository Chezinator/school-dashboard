/**
 * WeekSwitcher — Dayhaven mockup style:
 * Pill-shaped week navigation, solid fills, no borders.
 * No week is treated differently — all weeks shown equally.
 */
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useWeek } from "@/contexts/WeekContext";

export default function WeekSwitcher() {
  const { week, hasNewer, hasOlder, goNewer, goOlder, totalWeeks } = useWeek();

  if (totalWeeks <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-5">
      <button
        onClick={goOlder}
        disabled={!hasOlder}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
        aria-label="Previous week"
      >
        <CaretLeft size={16} weight="bold" />
      </button>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
        <span className="text-sm font-medium text-foreground whitespace-nowrap">
          {week.weekLabel}
        </span>
      </div>

      <button
        onClick={goNewer}
        disabled={!hasNewer}
        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-20 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
        aria-label="Next week"
      >
        <CaretRight size={16} weight="bold" />
      </button>
    </div>
  );
}
