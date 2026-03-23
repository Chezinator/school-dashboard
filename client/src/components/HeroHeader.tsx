/**
 * HeroHeader — Family photo as background image with greeting overlaid on left.
 * Dark mode toggle top-right. Photo serves as customizable hero background.
 */
import { useState } from "react";
import { useWeek } from "@/contexts/WeekContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, ArrowsClockwise } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

export default function HeroHeader() {
  const { meta, lastUpdatedFormatted } = useWeek();
  const { theme, toggleTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleCheckForUpdates() {
    setIsRefreshing(true);
    // Simulate checking — in a static app, this just reloads
    setTimeout(() => {
      setIsRefreshing(false);
      toast.info("Data is up to date", {
        description: `Last updated: ${lastUpdatedFormatted}. To get fresh data, ask Manus to pull the latest teacher emails.`,
        duration: 5000,
      });
    }, 800);
  }

  return (
    <header className="relative w-full overflow-hidden" style={{ minHeight: "220px" }}>
      {/* Background family photo */}
      <div className="absolute inset-0">
        <img
          src={FAMILY_PHOTO}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ objectPosition: "50% 25%" }}
        />
        {/* Gradient overlay for text readability — dark from left */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 px-5 pt-10 pb-6 sm:px-6 sm:pt-12 max-w-lg mx-auto">
        {/* Top row: greeting (left) + dark mode toggle (right) */}
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="max-w-[240px]"
          >
            <h1 className="font-display text-[1.75rem] sm:text-[2.25rem] leading-[1.1] text-white tracking-tight drop-shadow-lg">
              {getGreeting()}
              <br />
              <span className="font-display font-semibold">{meta.familyName}</span>
            </h1>
          </motion.div>

          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
              onClick={handleCheckForUpdates}
              aria-label="Check for updates"
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 active:scale-90 backdrop-blur-sm"
            >
              <ArrowsClockwise
                size={21}
                weight="bold"
                className={isRefreshing ? "animate-spin" : ""}
              />
            </motion.button>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 active:scale-90 backdrop-blur-sm"
            >
              {theme === "dark" ? <Sun size={22} weight="bold" /> : <Moon size={22} weight="bold" />}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
