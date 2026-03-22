/**
 * LunchMenu — Dayhaven mockup style:
 * Solid color-blocked card for the full menu. Day selector with pill dots.
 * No borders, no shadows — solid fills only.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

export default function LunchMenu() {
  const { week } = useWeek();
  const menu = week.lunchMenu;
  const [activeDay, setActiveDay] = useState(0);
  const [direction, setDirection] = useState(0);

  const goNext = () => { setDirection(1); setActiveDay((p) => Math.min(p + 1, menu.length - 1)); };
  const goPrev = () => { setDirection(-1); setActiveDay((p) => Math.max(p - 1, 0)); };

  const current = menu[activeDay];

  return (
    <section>
      <h2 className="font-display text-xl text-foreground tracking-tight mb-4">Lunch Menu</h2>

      <div className="dh-card dh-card-coral">
        {/* Day selector */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={activeDay === 0}
            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center disabled:opacity-20 hover:bg-black/15 transition-all active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="font-display font-semibold text-sm">{current.day}</p>
            <p className="text-xs opacity-60">
              {new Date(current.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={activeDay === menu.length - 1}
            className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center disabled:opacity-20 hover:bg-black/15 transition-all active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {menu.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > activeDay ? 1 : -1); setActiveDay(idx); }}
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
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Entrees</p>
              {current.entrees.map((entree, idx) => (
                <p key={idx} className="text-sm font-medium leading-relaxed">{entree}</p>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Sides</p>
              {current.sides.map((side, idx) => (
                <p key={idx} className="text-sm leading-relaxed">{side}</p>
              ))}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 mb-1.5">Fruit & Drinks</p>
              {current.fruits.map((fruit, idx) => (
                <p key={idx} className="text-sm leading-relaxed">{fruit}</p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
