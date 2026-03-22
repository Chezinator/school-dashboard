/**
 * WeekContext — Provides the active week's data to all dashboard components.
 * Supports multi-week archive with a week switcher.
 */
import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import reportData from "@/data/weeklyReport.json";

// Types for the weekly data
export type Kid = (typeof reportData.kids)[number];
export type WeekData = (typeof reportData.weeks)[number];

interface WeekContextValue {
  /** Static family/school metadata */
  meta: typeof reportData.meta;
  /** Static kids array */
  kids: typeof reportData.kids;
  /** All weeks (for consolidated calendar view) */
  allWeeks: WeekData[];
  /** The currently selected week's data */
  week: WeekData;
  /** Index of the current week in the weeks array (0 = most recent) */
  weekIndex: number;
  /** Total number of weeks available */
  totalWeeks: number;
  /** Whether there's a newer week available */
  hasNewer: boolean;
  /** Whether there's an older week available */
  hasOlder: boolean;
  /** Go to the next (newer) week */
  goNewer: () => void;
  /** Go to the previous (older) week */
  goOlder: () => void;
  /** Go to a specific week by index */
  goToWeek: (index: number) => void;
  /** Whether the current week is the latest */
  isLatest: boolean;
  /** Formatted "Last Updated" string */
  lastUpdatedFormatted: string;
}

const WeekContext = createContext<WeekContextValue | null>(null);

export function WeekProvider({ children }: { children: ReactNode }) {
  // Weeks are ordered newest-first in the JSON
  const [weekIndex, setWeekIndex] = useState(0);

  const value = useMemo<WeekContextValue>(() => {
    const weeks = reportData.weeks;
    const week = weeks[weekIndex];
    const lastUpdated = new Date(week.lastUpdated);

    const lastUpdatedFormatted = lastUpdated.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) + " at " + lastUpdated.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return {
      meta: reportData.meta,
      kids: reportData.kids,
      allWeeks: weeks,
      week,
      weekIndex,
      totalWeeks: weeks.length,
      hasNewer: weekIndex > 0,
      hasOlder: weekIndex < weeks.length - 1,
      goNewer: () => setWeekIndex((i) => Math.max(0, i - 1)),
      goOlder: () => setWeekIndex((i) => Math.min(weeks.length - 1, i + 1)),
      goToWeek: (index: number) => setWeekIndex(Math.max(0, Math.min(weeks.length - 1, index))),
      isLatest: weekIndex === 0,
      lastUpdatedFormatted,
    };
  }, [weekIndex]);

  return <WeekContext.Provider value={value}>{children}</WeekContext.Provider>;
}

export function useWeek() {
  const ctx = useContext(WeekContext);
  if (!ctx) throw new Error("useWeek must be used within a WeekProvider");
  return ctx;
}
