/**
 * LunchMenu — Daily lunch menu cards with entrees, sides, and fruits.
 * Uses the lunch illustration as a decorative accent.
 */
import { useState } from "react";
import { UtensilsCrossed, ChevronLeft, ChevronRight, Apple, Salad, ChefHat } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

const LUNCH_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/lunch-illustration-cjPG4cxWrbbobaTeQPY39X.webp";

export default function LunchMenu() {
  const { week } = useWeek();
  const menu = week.lunchMenu;
  const [activeDay, setActiveDay] = useState(0);

  const goNext = () => setActiveDay((prev) => Math.min(prev + 1, menu.length - 1));
  const goPrev = () => setActiveDay((prev) => Math.max(prev - 1, 0));

  const current = menu[activeDay];

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-light flex items-center justify-center">
          <UtensilsCrossed className="w-4 h-4 text-amber" />
        </div>
        <h2 className="font-display text-xl text-foreground">Lunch Menu</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        {/* Day selector */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-border/30">
          <button
            onClick={goPrev}
            disabled={activeDay === 0}
            className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <p className="font-semibold text-foreground text-sm">{current.day}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(current.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={goNext}
            disabled={activeDay === menu.length - 1}
            className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center disabled:opacity-30 hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day dots */}
        <div className="flex justify-center gap-1.5 py-2 bg-gradient-to-r from-amber-50/50 to-orange-50/50">
          {menu.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === activeDay ? "bg-amber w-4" : "bg-amber/25"
              }`}
            />
          ))}
        </div>

        <div className="p-4 space-y-4">
          {/* Entrees */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <ChefHat className="w-3.5 h-3.5 text-coral" />
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">Entrees</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.entrees.map((entree, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-coral-light text-foreground text-sm font-medium"
                >
                  {entree}
                </span>
              ))}
            </div>
          </div>

          {/* Sides */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Salad className="w-3.5 h-3.5 text-teal" />
              <span className="text-xs font-semibold text-teal uppercase tracking-wide">Sides</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.sides.map((side, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-teal-light text-foreground text-sm"
                >
                  {side}
                </span>
              ))}
            </div>
          </div>

          {/* Fruits */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Apple className="w-3.5 h-3.5 text-sage" />
              <span className="text-xs font-semibold text-sage uppercase tracking-wide">Fruit & Drinks</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.fruits.map((fruit, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-foreground text-sm"
                >
                  {fruit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative lunch image */}
        <div className="px-4 pb-4">
          <div className="rounded-xl overflow-hidden h-28 sm:h-36">
            <img
              src={LUNCH_IMAGE}
              alt="School lunch tray illustration"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
