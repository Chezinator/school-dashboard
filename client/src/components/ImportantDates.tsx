/**
 * ImportantDates — Calendar section showing this week's dates and upcoming events.
 * Amber accent for date-related items.
 */
import { CalendarDays, Star, BookOpen, PartyPopper } from "lucide-react";
import data from "@/data/weeklyReport.json";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "test":
      return <BookOpen className="w-4 h-4 text-red-500" />;
    case "event":
      return <PartyPopper className="w-4 h-4 text-amber" />;
    case "school":
      return <Star className="w-4 h-4 text-teal" />;
    default:
      return <CalendarDays className="w-4 h-4 text-muted-foreground" />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "test":
      return "bg-red-50";
    case "event":
      return "bg-amber-light";
    case "school":
      return "bg-teal-light";
    default:
      return "bg-muted";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "test":
      return { text: "Assessment", className: "bg-red-100 text-red-700" };
    case "event":
      return { text: "Event", className: "bg-amber-100 text-amber-700" };
    case "school":
      return { text: "School", className: "bg-teal-100 text-teal-700" };
    default:
      return { text: "Date", className: "bg-gray-100 text-gray-700" };
  }
}

export default function ImportantDates() {
  const dates = data.importantDates;
  if (!dates.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-light flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-amber" />
        </div>
        <h2 className="font-display text-xl text-foreground">Important Dates</h2>
      </div>

      <div className="space-y-3">
        {dates.map((item, idx) => {
          const label = getTypeLabel(item.type);
          const kidName = item.kidId
            ? data.kids.find((k) => k.id === item.kidId)?.name
            : null;

          return (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 shadow-sm border border-border/50 card-date"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${getTypeBg(item.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${label.className}`}>
                      {label.text}
                    </span>
                    {kidName && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{
                          backgroundColor: data.kids.find((k) => k.id === item.kidId)?.color || "#888",
                        }}
                      >
                        {kidName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  {(item as any).description && (
                    <p className="text-muted-foreground text-xs mt-1">{(item as any).description}</p>
                  )}
                  <p className="text-xs text-amber font-medium mt-1.5">
                    {formatDate(item.date)}
                    {(item as any).endDate && ` — ${formatDate((item as any).endDate)}`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
