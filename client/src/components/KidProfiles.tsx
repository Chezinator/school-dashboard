/**
 * KidProfiles — Dayhaven app aesthetic
 * Color-blocked rounded cards with hover/tap micro-interactions.
 */
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

export default function KidProfiles() {
  const { kids } = useWeek();

  return (
    <div className="grid grid-cols-2 gap-3">
      {kids.map((kid, idx) => (
        <AnimatedCard key={kid.id} delay={idx}>
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-card rounded-2xl p-4 border border-border/40 flex items-center gap-3 cursor-default"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
              style={{ backgroundColor: kid.color }}
            >
              {kid.avatar}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold text-foreground truncate">{kid.name}</h3>
              <p className="text-muted-foreground text-xs mt-0.5">{kid.grade}</p>
              <p className="text-muted-foreground text-xs truncate">{kid.teacher}</p>
            </div>
          </motion.div>
        </AnimatedCard>
      ))}
    </div>
  );
}
