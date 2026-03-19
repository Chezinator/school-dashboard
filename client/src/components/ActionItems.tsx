/**
 * ActionItems — Urgent items highlighted with coral pulse, info items with teal border.
 * Priority section at the top of the dashboard.
 * Dark mode: uses bg-card (semantic) instead of hardcoded bg-white.
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
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-coral-light dark:bg-coral/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-coral" />
        </div>
        <h2 className="font-display text-xl text-foreground">Action Items</h2>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`bg-card rounded-xl p-4 shadow-sm border border-border/50 ${
              item.urgent ? "card-urgent" : "card-info"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 shrink-0 ${item.urgent ? "urgent-pulse" : ""}`}>
                {item.urgent ? (
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-teal-light dark:bg-teal/20 flex items-center justify-center">
                    <Info className="w-4 h-4 text-teal" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  {item.urgent && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {item.dueDate && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber font-medium">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.dueDate)}
                    </span>
                  )}
                  {getKidName(item.kidId) && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
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
