/**
 * TodayWeatherCard — Shows next 3 days of forecast.
 * Clickable to jump to full forecast in More tab.
 * Amber card. Phosphor icon.
 */
import { Sun as SunIcon, CloudSun, Cloud, CloudRain } from "@phosphor-icons/react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

interface Props {
  delay?: number;
  onNavigate?: () => void;
}

function getWeatherIcon(icon: string, size = 16) {
  const props = { size, weight: "duotone" as const, className: "opacity-70 shrink-0" };
  switch (icon) {
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
  const weather = week.weather;

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayIdx = today.getDay();

  // Get next 3 days of weather
  const upcomingWeather: typeof weather = [];
  for (let i = 0; i < 7 && upcomingWeather.length < 3; i++) {
    const checkIdx = (todayIdx + i) % 7;
    const dayName = dayNames[checkIdx];
    const found = weather.find((w) => w.day === dayName);
    if (found) upcomingWeather.push(found);
  }

  if (!upcomingWeather.length) return null;

  const todayW = upcomingWeather[0];

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
        {upcomingWeather.map((w, i) => {
          const isToday = w.day === dayNames[todayIdx];
          return (
            <div key={w.day} className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 w-8 shrink-0">
                {isToday ? "Now" : w.day.slice(0, 3)}
              </span>
              {getWeatherIcon(w.icon)}
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
