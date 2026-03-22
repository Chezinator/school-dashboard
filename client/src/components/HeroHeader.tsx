/**
 * HeroHeader — Dayhaven app-style greeting header.
 * Compact, personalized "Good morning" with family photo circle and dark mode toggle.
 * The family photo is shown as a circular avatar, not a full-width banner.
 */
import { useWeek } from "@/contexts/WeekContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getEmoji(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export default function HeroHeader() {
  const { meta, week } = useWeek();
  const { theme, toggleTheme } = useTheme();
  const greeting = getGreeting();
  const emoji = getEmoji();

  return (
    <header className="px-5 pt-12 pb-2 sm:px-6 sm:pt-14">
      <div className="flex items-start justify-between gap-3">
        {/* Left — greeting + family name */}
        <div className="flex items-center gap-3.5">
          {/* Family photo avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="shrink-0"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-border">
              <img
                src={FAMILY_PHOTO}
                alt="Stanfield family"
                className="w-full h-full object-cover"
                style={{ objectPosition: "70% 30%" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-base">{emoji}</span>
              <p className="text-sm text-muted-foreground font-medium">{greeting}</p>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl text-foreground leading-tight tracking-tight -mt-0.5">
              {meta.familyName} Family
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {meta.schoolName} · Week of {week.weekLabel}
            </p>
          </motion.div>
        </div>

        {/* Right — dark mode toggle */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="mt-1 w-10 h-10 rounded-2xl bg-card border border-border/40 flex items-center justify-center text-foreground hover:bg-muted transition-all duration-200 active:scale-90 shrink-0"
        >
          {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </motion.button>
      </div>
    </header>
  );
}
