/**
 * WeatherForecast — Amber card for the forecast.
 * Phosphor icons throughout. No borders, no shadows.
 */
import { Sun, CloudSun, Cloud, CloudRain, TShirt, Thermometer } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

function getWeatherIcon(icon: string) {
  const props = { size: 22, weight: "duotone" as const, className: "opacity-70 shrink-0" };
  switch (icon) {
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
  const weather = week.weather;

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

        <div className="space-y-3">
          {weather.map((day, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs font-bold opacity-60 uppercase w-8 shrink-0">
                {day.day.slice(0, 3)}
              </span>
              {getWeatherIcon(day.icon)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{day.condition}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <TShirt size={12} weight="bold" className="opacity-50 shrink-0" />
                  <p className="text-xs opacity-60 truncate">{day.dressSuggestion}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-bold">{day.high}°</span>
                <span className="text-xs opacity-50 ml-1">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
