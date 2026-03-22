/**
 * WeatherForecast — Dayhaven app aesthetic
 * Rounded-2xl cards, warm tones, staggered entrance animations.
 */
import { Sun, CloudSun, Cloud, CloudRain, Thermometer, Shirt } from "lucide-react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

const WEATHER_BG = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/weather-bg-Wf8qWXHbDHfDCp3nX5GTqw.webp";

function getWeatherIcon(icon: string) {
  switch (icon) {
    case "sun":       return <Sun className="w-7 h-7 text-amber" />;
    case "cloud-sun": return <CloudSun className="w-7 h-7 text-amber" />;
    case "cloud":     return <Cloud className="w-7 h-7 text-warm-gray" />;
    case "rain":
    case "cloud-rain": return <CloudRain className="w-7 h-7 text-teal" />;
    default:          return <Sun className="w-7 h-7 text-amber" />;
  }
}

function getTempColor(temp: number) {
  if (temp >= 85) return "text-coral";
  if (temp >= 80) return "text-amber";
  if (temp >= 75) return "text-amber";
  return "text-teal";
}

export default function WeatherForecast() {
  const { week } = useWeek();
  const weather = week.weather;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center">
          <Thermometer className="w-4 h-4 text-teal" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Weather Forecast</h2>
      </div>

      {/* Decorative weather banner */}
      <AnimatedCard delay={0}>
        <div className="relative rounded-2xl overflow-hidden mb-4 h-24 sm:h-28">
          <img src={WEATHER_BG} alt="Florida sky watercolor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/75 dark:from-background/85 to-transparent flex items-center px-5">
            <div>
              <p className="text-sm font-display font-semibold text-foreground">Winter Garden, FL</p>
              <p className="text-xs text-muted-foreground">Week of {week.weekLabel}</p>
            </div>
          </div>
        </div>
      </AnimatedCard>

      {/* Daily forecast cards */}
      <div className="space-y-2.5">
        {weather.map((day, idx) => (
          <AnimatedCard key={idx} delay={idx + 1}>
            <motion.div
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-card rounded-2xl p-3.5 border border-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 text-center shrink-0">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {day.day.slice(0, 3)}
                    </p>
                  </div>
                  <div className="shrink-0">{getWeatherIcon(day.icon)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{day.condition}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shirt className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground truncate">{day.dressSuggestion}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold ${getTempColor(day.high)}`}>{day.high}°</p>
                  <p className="text-xs text-muted-foreground">{day.low}°</p>
                </div>
              </div>
            </motion.div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
