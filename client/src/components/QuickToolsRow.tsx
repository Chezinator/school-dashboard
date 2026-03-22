/**
 * QuickToolsRow — Horizontal scrolling row of pinned tool shortcuts.
 * Quick access to Canvas, Skyward, ParentSquare, MealViewer.
 */
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

const TOOL_ICONS: Record<string, string> = {
  canvas:       "🎨",
  skyward:      "🌤️",
  parentsquare: "💬",
  mealviewer:   "🍽️",
};

const TOOL_COLORS: Record<string, string> = {
  canvas:       "bg-coral-light dark:bg-coral/12",
  skyward:      "bg-teal-light dark:bg-teal/12",
  parentsquare: "bg-sage-light dark:bg-sage/12",
  mealviewer:   "bg-amber-light dark:bg-amber/12",
};

export default function QuickToolsRow({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const allLinks = (week as any)?.importantLinks ?? [];
  const pinnedTools = allLinks.filter((l: any) => l.pinned && !l.earmarked);

  if (!pinnedTools.length) return null;

  return (
    <AnimatedCard delay={delay}>
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {pinnedTools.map((tool: any) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            <div className={`w-14 h-14 rounded-2xl ${TOOL_COLORS[tool.id] || "bg-muted"} flex items-center justify-center text-xl transition-all duration-200 group-hover:shadow-md group-hover:-translate-y-0.5 group-active:scale-95`}>
              {TOOL_ICONS[tool.id] || "🔗"}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
              {tool.title}
            </span>
          </a>
        ))}
      </div>
    </AnimatedCard>
  );
}
