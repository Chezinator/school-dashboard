/**
 * QuickToolsRow — Dayhaven mockup style:
 * Solid color-blocked circles for quick tool access.
 * No borders, no shadows — just solid pastel fills.
 */
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

const TOOL_ICONS: Record<string, string> = {
  canvas:       "🎨",
  skyward:      "📊",
  parentsquare: "💬",
  mealviewer:   "🍽️",
};

const TOOL_BG: Record<string, string> = {
  canvas:       "dh-card-coral",
  skyward:      "dh-card-teal",
  parentsquare: "dh-card-sage",
  mealviewer:   "dh-card-amber",
};

export default function QuickToolsRow({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const allLinks = (week as any)?.importantLinks ?? [];
  const pinnedTools = allLinks.filter((l: any) => l.pinned && !l.earmarked);

  if (!pinnedTools.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide"
    >
      {pinnedTools.map((tool: any, i: number) => (
        <motion.a
          key={tool.id}
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="flex flex-col items-center gap-2 shrink-0"
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${TOOL_BG[tool.id] || "dh-card-cream"}`}>
            {TOOL_ICONS[tool.id] || "🔗"}
          </div>
          <span className="text-[11px] font-medium text-muted-foreground text-center leading-tight max-w-[72px]">
            {tool.title}
          </span>
        </motion.a>
      ))}
    </motion.div>
  );
}
