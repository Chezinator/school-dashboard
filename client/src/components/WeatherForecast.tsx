/**
 * WeatherForecast — Amber card for the forecast.
 * Phosphor icons throughout. No borders, no shadows.
 * Today's row is highlighted with a tinted pill background.
 *
 * Handles two data schemas:
 *   Old: { day, date, high, low, icon, condition, dressSuggestion }
 *   New: { day, date, high, low, description }
 * Also handles the key being either `weather` or `weatherForecast`.
 */
import { Sun, CloudSun, Cloud, CloudRain, TShirt, Thermometer } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

/** Infer a weather icon key from either an explicit icon field or a description string. */
function inferIcon(icon?: string, description?: string): string {
  const src = (icon || description || "").toLowerCase();
  if (src.includes("rain") || src.includes("storm") || src.includes("shower")) return "rain";
  if (src.includes("cloud") && (src.includes("sun") || src.includes("partly"))) return "cloud-sun";
  if (src.includes("cloud") || src.includes("overcast")) return "cloud";
  return "sun";
}

function getWeatherIcon(iconKey: string) {
  const props = { size: 22, weight: "duotone" as const, className: "opacity-70 shrink-0" };
  switch (iconKey) {
    case "sun":        return <Sun {...props} />;
    case "cloud-sun":  return <CloudSun {...props} />;
    case "cloud":      return <Cloud {...props} />;
    case "rain":
    case "cloud-rain": return <CloudRain {...props} />;
    default:           return <Sun {...props} />;
  }
}

export default function WeatherForecast() {
  const { week } = useWeek();
  // Support both `weather` (old) and `weatherForecast` (new) key names
  const weather: any[] = (week as any).weather ?? (week as any).weatherForecast ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().slice(0, 10);

  if (!weather.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Thermometer size={22} weight="duotone" className="text-dh-amber" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Weather</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="dh-card dh-card-amber"
      >
        <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-3">
          Week of {week.weekLabel}
        </p>

        <div className="space-y-1">
          {weather.map((day: any, idx: number) => {
            const isToday = day.date === todayStr;
            // Normalise across schemas
            const condition: string = day.condition || day.description || "";
            const dressSuggestion: string = day.dressSuggestion || "";
            const iconKey = inferIcon(day.icon, day.description);

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 rounded-xl px-2 py-2 transition-colors ${
                  isToday ? "bg-black/10 dark:bg-black/20" : ""
                }`}
              >
                <span className={`text-xs font-bold uppercase w-8 shrink-0 ${isToday ? "opacity-90" : "opacity-60"}`}>
                  {isToday ? "Today" : (day.day || "").slice(0, 3)}
                </span>
                {getWeatherIcon(iconKey)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{condition}</p>
                  {dressSuggestion && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <TShirt size={12} weight="bold" className="opacity-50 shrink-0" />
                      <p className="text-xs opacity-60 truncate">{dressSuggestion}</p>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold">{day.high}°</span>
                  <span className="text-xs opacity-50 ml-1">{day.low}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
