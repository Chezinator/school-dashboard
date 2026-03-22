/**
 * LunchMenu — Dayhaven app aesthetic
 * Color-blocked food category chips, rounded-2xl cards, animated day transitions.
 */
import { useState } from "react";
import { UtensilsCrossed, ChevronLeft, ChevronRight, Apple, Salad, ChefHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

const LUNCH_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/lunch-illustration-cjPG4cxWrbbobaTeQPY39X.webp";

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
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-amber-light dark:bg-amber/15 flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4 text-amber" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Lunch Menu</h2>
      </div>

      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden">
        {/* Day selector */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-amber/5 dark:bg-amber/8 border-b border-border/20">
          <button
            onClick={goPrev}
            disabled={activeDay === 0}
            className="w-8 h-8 rounded-full bg-card border border-border/40 flex items-center justify-center disabled:opacity-20 hover:bg-muted transition-all duration-200 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground text-sm">{current.day}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(current.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={activeDay === menu.length - 1}
            className="w-8 h-8 rounded-full bg-card border border-border/40 flex items-center justify-center disabled:opacity-20 hover:bg-muted transition-all duration-200 active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day dots */}
        <div className="flex justify-center gap-1.5 py-2.5 bg-amber/5 dark:bg-amber/8">
          {menu.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setDirection(idx > activeDay ? 1 : -1); setActiveDay(idx); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeDay ? "bg-amber w-5" : "bg-amber/20 w-2 hover:bg-amber/40"
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
            className="p-4 space-y-4"
          >
            {/* Entrees */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <ChefHat className="w-3.5 h-3.5 text-coral" />
                <span className="text-xs font-bold text-coral uppercase tracking-wider">Entrees</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {current.entrees.map((entree, idx) => (
                  <span key={idx} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-coral-light dark:bg-coral/12 text-foreground text-sm font-medium">
                    {entree}
                  </span>
                ))}
              </div>
            </div>

            {/* Sides */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Salad className="w-3.5 h-3.5 text-teal" />
                <span className="text-xs font-bold text-teal uppercase tracking-wider">Sides</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {current.sides.map((side, idx) => (
                  <span key={idx} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-teal-light dark:bg-teal/12 text-foreground text-sm">
                    {side}
                  </span>
                ))}
              </div>
            </div>

            {/* Fruits */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Apple className="w-3.5 h-3.5 text-sage" />
                <span className="text-xs font-bold text-sage uppercase tracking-wider">Fruit & Drinks</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {current.fruits.map((fruit, idx) => (
                  <span key={idx} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-sage-light dark:bg-sage/12 text-foreground text-sm">
                    {fruit}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative lunch image */}
        <div className="px-4 pb-4">
          <div className="rounded-2xl overflow-hidden h-28 sm:h-36">
            <img src={LUNCH_IMAGE} alt="School lunch tray illustration" className="w-full h-full object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
