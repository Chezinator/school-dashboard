/**
 * WeatherForecast — Daily weather cards with highs/lows, conditions, and dressing suggestions.
 * Uses the watercolor weather background as a decorative accent.
 */
import { Sun, CloudSun, Cloud, CloudRain, Thermometer, Shirt } from "lucide-react";
import data from "@/data/weeklyReport.json";

const WEATHER_BG = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/weather-bg-Wf8qWXHbDHfDCp3nX5GTqw.webp";

function getWeatherIcon(icon: string) {
  switch (icon) {
    case "sun":
      return <Sun className="w-7 h-7 text-amber-500" />;
    case "cloud-sun":
      return <CloudSun className="w-7 h-7 text-amber-400" />;
    case "cloud":
      return <Cloud className="w-7 h-7 text-gray-400" />;
    case "rain":
      return <CloudRain className="w-7 h-7 text-blue-400" />;
    default:
      return <Sun className="w-7 h-7 text-amber-500" />;
  }
}

function getTempColor(temp: number) {
  if (temp >= 85) return "text-red-500";
  if (temp >= 80) return "text-orange-500";
  if (temp >= 75) return "text-amber-500";
  return "text-teal-600";
}

export default function WeatherForecast() {
  const weather = data.weather;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Thermometer className="w-4 h-4 text-blue-500" />
        </div>
        <h2 className="font-display text-xl text-foreground">Weather Forecast</h2>
      </div>

      {/* Decorative weather banner */}
      <div className="relative rounded-2xl overflow-hidden mb-3 h-24 sm:h-28">
        <img
          src={WEATHER_BG}
          alt="Florida sky watercolor"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 to-transparent flex items-center px-5">
          <div>
            <p className="text-sm font-medium text-gray-700">Winter Garden, FL</p>
            <p className="text-xs text-gray-500">Week of {data.meta.weekLabel}</p>
          </div>
        </div>
      </div>

      {/* Daily forecast cards */}
      <div className="space-y-2">
        {weather.map((day, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-border/50 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              {/* Day & icon */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 text-center shrink-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
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

              {/* Temps */}
              <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${getTempColor(day.high)}`}>
                  {day.high}°
                </p>
                <p className="text-xs text-muted-foreground">{day.low}°</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
