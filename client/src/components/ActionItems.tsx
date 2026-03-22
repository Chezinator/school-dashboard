/**
 * ActionItems — Dayhaven app aesthetic
 * Color-blocked rounded cards with coral accent for urgent, sage for info.
 * Staggered entrance animations via AnimatedCard.
 */
import { AlertTriangle, Info, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function ActionItems() {
  const { week, kids } = useWeek();
  const items = week.actionItems;

  function getKidName(kidId: string | null) {
    if (!kidId) return null;
    const kid = kids.find((k) => k.id === kidId);
    return kid ? kid.name : null;
  }

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-coral-light dark:bg-coral/15 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-coral" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Action Items</h2>
        <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coral-light dark:bg-coral/15 text-coral">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <AnimatedCard key={item.id} delay={idx}>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`bg-card rounded-2xl p-4 sm:p-5 border border-border/40 transition-shadow duration-300 hover:shadow-md ${
                item.urgent ? "card-coral" : "card-sage"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 ${item.urgent ? "urgent-pulse" : ""}`}>
                  {item.urgent ? (
                    <div className="w-9 h-9 rounded-2xl bg-coral-light dark:bg-coral/15 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-coral" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-2xl bg-sage-light dark:bg-sage/15 flex items-center justify-center">
                      <Info className="w-4 h-4 text-sage" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    {item.urgent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coral-light dark:bg-coral/15 text-coral">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    {item.dueDate && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.dueDate)}
                      </span>
                    )}
                    {getKidName(item.kidId) && (
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: kids.find((k) => k.id === item.kidId)?.color || "#888",
                        }}
                      >
                        {getKidName(item.kidId)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
