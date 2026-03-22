/**
 * KidProfiles — Dayhaven aesthetic
 * Color-blocked rounded cards with generous padding, Fraunces headings.
 */
import { useWeek } from "@/contexts/WeekContext";

export default function KidProfiles() {
  const { kids } = useWeek();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {kids.map((kid) => (
        <div
          key={kid.id}
          className="bg-card rounded-2xl p-4 sm:p-5 border border-border/40 flex items-center gap-3 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
            style={{ backgroundColor: kid.color }}
          >
            {kid.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-foreground truncate">{kid.name}</h3>
            <p className="text-muted-foreground text-xs mt-0.5">{kid.grade}</p>
            <p className="text-muted-foreground text-xs truncate">{kid.teacher}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
