/**
 * ImportantDates — Dayhaven aesthetic
 * Color-blocked rounded cards, pill badges, charcoal pill CTAs, Fraunces headings.
 */
import { CalendarDays, Star, BookOpen, PartyPopper, ExternalLink } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

interface EventLink {
  url: string;
  label: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getTypeIcon(type: string) {
  switch (type) {
    case "test":
      return <BookOpen className="w-4 h-4 text-coral" />;
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
      return "bg-coral-light dark:bg-coral/15";
    case "event":
      return "bg-amber-light dark:bg-amber/15";
    case "school":
      return "bg-teal-light dark:bg-teal/15";
    default:
      return "bg-muted";
  }
}

function getTypeLabel(type: string) {
  switch (type) {
    case "test":
      return { text: "Assessment", className: "bg-coral-light dark:bg-coral/15 text-coral" };
    case "event":
      return { text: "Event", className: "bg-amber-light dark:bg-amber/15 text-amber" };
    case "school":
      return { text: "School", className: "bg-teal-light dark:bg-teal/15 text-teal" };
    default:
      return { text: "Date", className: "bg-muted text-muted-foreground" };
  }
}

export default function ImportantDates() {
  const { week, kids } = useWeek();
  const dates = week.importantDates;
  if (!dates.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-2xl bg-amber-light dark:bg-amber/15 flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-amber" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Important Dates</h2>
      </div>

      <div className="space-y-3">
        {dates.map((item, idx) => {
          const label = getTypeLabel(item.type);
          const kidName = item.kidId
            ? kids.find((k) => k.id === item.kidId)?.name
            : null;
          const eventLink = (item as any).link as EventLink | undefined;

          return (
            <div
              key={idx}
              className="bg-card rounded-2xl p-4 sm:p-5 border border-border/40 card-amber transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-2xl ${getTypeBg(item.type)} flex items-center justify-center shrink-0 mt-0.5`}>
                  {getTypeIcon(item.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${label.className}`}>
                      {label.text}
                    </span>
                    {kidName && (
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{
                          backgroundColor: kids.find((k) => k.id === item.kidId)?.color || "#888",
                        }}
                      >
                        {kidName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                  {(item as any).description && (
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">{(item as any).description}</p>
                  )}
                  <p className="text-xs text-amber font-medium mt-2">
                    {formatDate(item.date)}
                    {(item as any).endDate && ` — ${formatDate((item as any).endDate)}`}
                  </p>

                  {eventLink && (
                    <div className="mt-3 pt-3 border-t border-border/25">
                      <a
                        href={eventLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pill-cta text-xs py-2 px-4"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {eventLink.label}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
