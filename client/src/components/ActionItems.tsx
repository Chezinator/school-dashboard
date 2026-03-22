/**
 * ActionItems — Dayhaven aesthetic
 * Color-blocked rounded cards with coral accent for urgent, sage for info.
 * Pill badges, Fraunces headings, generous whitespace.
 */
import { AlertTriangle, Info, Calendar } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

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
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-coral-light dark:bg-coral/15 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-coral" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Action Items</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-card rounded-2xl p-4 sm:p-5 border border-border/40 transition-all duration-300 hover:shadow-md ${
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
          </div>
        ))}
      </div>
    </section>
  );
}
