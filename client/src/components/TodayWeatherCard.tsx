/**
 * TodayWeatherCard — Compact smart card for the home screen.
 * Shows today's weather at a glance with temp + condition + dress suggestion.
 */
import { Sun, CloudSun, Cloud, CloudRain, Shirt } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

function getWeatherIcon(icon: string) {
  switch (icon) {
    case "sun":       return <Sun className="w-5 h-5 text-amber" />;
    case "cloud-sun": return <CloudSun className="w-5 h-5 text-amber" />;
    case "cloud":     return <Cloud className="w-5 h-5 text-warm-gray" />;
    case "rain":
    case "cloud-rain": return <CloudRain className="w-5 h-5 text-teal" />;
    default:          return <Sun className="w-5 h-5 text-amber" />;
  }
}

export default function TodayWeatherCard({ delay = 0 }: { delay?: number }) {
  const { week } = useWeek();
  const weather = week.weather;

  const today = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = dayNames[today.getDay()];

  const todayWeather = weather.find((w) => w.day === todayName) || weather[0];
  if (!todayWeather) return null;

  const displayDay = todayWeather.day === todayName ? "Today" : todayWeather.day;

  return (
    <AnimatedCard delay={delay}>
      <div className="bg-card rounded-2xl p-4 border border-border/40 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center shrink-0">
            {getWeatherIcon(todayWeather.icon)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{displayDay}'s Weather</h3>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-foreground">{todayWeather.high}°</span>
              <span className="text-xs text-muted-foreground">/ {todayWeather.low}°</span>
              <span className="text-xs text-muted-foreground">· {todayWeather.condition}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2.5 pl-[52px]">
          <Shirt className="w-3 h-3 text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground truncate">{todayWeather.dressSuggestion}</p>
        </div>
      </div>
    </AnimatedCard>
  );
}
