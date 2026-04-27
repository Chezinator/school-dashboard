/**
 * TodayWeatherCard — Shows next 3 days of forecast.
 * Clickable to jump to full forecast in More tab.
 * Amber card. Phosphor icon.
 *
 * Handles two data schemas:
 *   Old: { day, date, high, low, icon, condition, dressSuggestion }
 *   New: { day, date, high, low, description }
 * Also handles the key being either `weather` or `weatherForecast`.
 */
import { Sun as SunIcon, CloudSun, Cloud, CloudRain } from "@phosphor-icons/react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

interface Props {
  delay?: number;
  onNavigate?: () => void;
}

/** Infer a weather icon key from either an explicit icon field or a description string. */
function inferIcon(icon?: string, description?: string): string {
  const src = (icon || description || "").toLowerCase();
  if (src.includes("rain") || src.includes("storm") || src.includes("shower")) return "rain";
  if (src.includes("cloud") && (src.includes("sun") || src.includes("partly"))) return "cloud-sun";
  if (src.includes("cloud") || src.includes("overcast")) return "cloud";
  return "sun";
}

function getWeatherIcon(iconKey: string, size = 16) {
  const props = { size, weight: "duotone" as const, className: "opacity-70 shrink-0" };
  switch (iconKey) {
    case "sun":        return <SunIcon {...props} />;
    case "cloud-sun":  return <CloudSun {...props} />;
    case "cloud":      return <Cloud {...props} />;
    case "rain":
    case "cloud-rain": return <CloudRain {...props} />;
    default:           return <SunIcon {...props} />;
  }
}

export default function TodayWeatherCard({ delay = 0, onNavigate }: Props) {
  const { week } = useWeek();
  // Support both `weather` (old) and `weatherForecast` (new) key names
  const weather: any[] = (week as any).weather ?? (week as any).weatherForecast ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayDayName = dayNames[today.getDay()];

  // Sort by date, show today + next 2 days
  const upcomingWeather = [...weather]
    .sort((a, b) => new Date(a.date + "T00:00:00").getTime() - new Date(b.date + "T00:00:00").getTime())
    .filter((w) => new Date(w.date + "T00:00:00") >= today)
    .slice(0, 3);

  if (!upcomingWeather.length) return null;

  return (
    <motion.button
      onClick={onNavigate}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-amber text-left w-full cursor-pointer flex flex-col"
      aria-label="View full forecast"
    >
      <div className="flex items-center gap-2 mb-3">
        <SunIcon size={18} weight="duotone" className="opacity-70" />
        <h3 className="font-display text-sm font-semibold">Weather</h3>
      </div>

      <div className="space-y-2">
        {upcomingWeather.map((w: any, i: number) => {
          const isToday = w.day === todayDayName;
          const iconKey = inferIcon(w.icon, w.description);
          return (
            <div key={w.day} className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 w-8 shrink-0">
                {isToday ? "Now" : (w.day || "").slice(0, 3)}
              </span>
              {getWeatherIcon(iconKey)}
              <span className={`text-sm font-semibold ${i === 0 ? "font-display text-base" : ""}`}>
                {w.high}°
              </span>
              <span className="text-xs opacity-50">{w.low}°</span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] font-semibold opacity-40 mt-3 uppercase tracking-wider">View details →</p>
    </motion.button>
  );
}
