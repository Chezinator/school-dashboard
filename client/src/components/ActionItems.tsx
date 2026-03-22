/**
 * ActionItems — Dayhaven mockup style:
 * Color-blocked cards for each action item. Urgent items get coral bg,
 * regular items alternate sage/amber/pink. No borders, no shadows — solid fills only.
 */
import { AlertTriangle, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

const CARD_STYLES = ["dh-card-sage", "dh-card-amber", "dh-card-pink", "dh-card-cream"];

export default function ActionItems() {
  const { week, kids } = useWeek();
  const items = week.actionItems;

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-foreground tracking-tight">Action Items</h2>
        <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full px-3 py-1">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const kid = kids.find((k) => k.id === item.kidId);
          const style = item.urgent ? "dh-card-coral" : CARD_STYLES[idx % CARD_STYLES.length];
          const dueDate = item.dueDate
            ? new Date(item.dueDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
            : null;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.06 }}
              whileHover={{ y: -2 }}
              className={`dh-card ${style}`}
            >
              <div className="flex items-start gap-3">
                {item.urgent && (
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-display text-sm font-semibold leading-snug">{item.title}</h3>
                    {item.urgent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Urgent</span>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed opacity-80 mb-2">{item.description}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {dueDate && (
                      <span className="flex items-center gap-1 text-xs font-medium opacity-70">
                        <Calendar className="w-3 h-3" />
                        {dueDate}
                      </span>
                    )}
                    {kid && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: kid.color }}
                      >
                        {kid.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
