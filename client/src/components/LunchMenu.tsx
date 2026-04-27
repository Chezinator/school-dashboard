/**
 * LunchMenu — Dayhaven mockup style:
 * Solid color-blocked card for the full menu. Day selector with pill dots.
 * Auto-selects today's day on mount. Swipeable on touch devices.
 * No borders, no shadows — solid fills only.
 *
 * Handles partial data: sides and fruits may be absent (e.g. when menu is unavailable).
 */
import { useState, useRef, useCallback } from "react";
import { CaretLeft, CaretRight, ForkKnife } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

/** Returns the index of today's day in the menu array, or 0 if not found. */
function getTodayIndex(menu: Array<{ date: string }>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);
  const idx = menu.findIndex((m) => m.date === todayStr);
  if (idx !== -1) return idx;
  // If today is not in the menu (weekend / different week), find the closest upcoming day
  const future = menu.findIndex(
    (m) => new Date(m.date + "T00:00:00") >= today
  );
  return future !== -1 ? future : 0;
}

export default function LunchMenu() {
  const { week } = useWeek();
  const menu = week.lunchMenu;

  const [activeDay, setActiveDay] = useState(() => getTodayIndex(menu));
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > activeDay ? 1 : -1);
    setActiveDay(idx);
  }, [activeDay]);

  const goNext = () => { if (activeDay < menu.length - 1) goTo(activeDay + 1); };
  const goPrev = () => { if (activeDay > 0) goTo(activeDay - 1); };

  // Touch/swipe state
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant and exceeds threshold
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const current = menu[activeDay];

  // Normalise optional fields — may be absent when menu data is unavailable
  const entrees: string[] = current.entrees ?? [];
  const sides: string[] = (current as any).sides ?? [];
  const fruits: string[] = (current as any).fruits ?? [];

  // Determine if this day is today for the label
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = new Date(current.date + "T00:00:00").getTime() === today.getTime();

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <ForkKnife size={22} weight="duotone" className="text-dh-coral" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Lunch Menu</h2>
      </div>

      <div
        className="dh-card dh-card-coral"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Day selector */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={activeDay === 0}
            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center disabled:opacity-20 hover:bg-black/15 transition-all active:scale-90"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <div className="text-center">
            <p className="font-display font-semibold text-sm">
              {isToday ? "Today" : current.day}
            </p>
            <p className="text-xs opacity-60">
              {new Date(current.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={activeDay === menu.length - 1}
            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center disabled:opacity-20 hover:bg-black/15 transition-all active:scale-90"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>

        {/* Day dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {menu.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeDay ? "bg-black/30 w-5" : "bg-black/10 w-2 hover:bg-black/20"
              }`}
            />
          ))}
        </div>

        {/* Animated content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeDay}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.6 }}
            className="space-y-3"
          >
            {entrees.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Entrees</p>
                {entrees.map((entree, idx) => (
                  <p key={idx} className="text-sm font-medium leading-relaxed">{entree}</p>
                ))}
              </div>
            )}

            {sides.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Sides</p>
                {sides.map((side, idx) => (
                  <p key={idx} className="text-sm leading-relaxed">{side}</p>
                ))}
              </div>
            )}

            {fruits.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Fruit & Drinks</p>
                {fruits.map((fruit, idx) => (
                  <p key={idx} className="text-sm leading-relaxed">{fruit}</p>
                ))}
              </div>
            )}

            {entrees.length === 0 && sides.length === 0 && fruits.length === 0 && (
              <p className="text-sm opacity-60 italic">Menu not available for this day.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
