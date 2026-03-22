/**
 * TodayWeatherCard — Matches the Dayhaven mockup exactly:
 * Solid color background, sun icon, big temperature, condition text.
 * No borders, no shadows.
 */
import { Sun, CloudSun, Cloud, CloudRain } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";

function getWeatherIcon(icon: string) {
  const cls = "w-8 h-8 opacity-80";
  switch (icon) {
    case "sun":        return <Sun className={cls} />;
    case "cloud-sun":  return <CloudSun className={cls} />;
    case "cloud":      return <Cloud className={cls} />;
    case "rain":
    case "cloud-rain": return <CloudRain className={cls} />;
    default:           return <Sun className={cls} />;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay: delay * 0.06 }}
      whileHover={{ y: -2 }}
      className="dh-card dh-card-amber flex flex-col items-start"
    >
      <div className="mb-3">
        {getWeatherIcon(todayWeather.icon)}
      </div>
      <p className="font-display text-3xl font-bold leading-none">{todayWeather.high}°F</p>
      <p className="text-sm font-medium mt-1 opacity-80">{todayWeather.condition}</p>
    </motion.div>
  );
}
