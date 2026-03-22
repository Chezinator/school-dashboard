/**
 * HeroHeader — Matches the Dayhaven mockup exactly:
 * Large "Good morning, Stanfield" serif greeting, family photo circle, dark mode toggle.
 * Clean, spacious, editorial feel.
 */
import { useWeek } from "@/contexts/WeekContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const FAMILY_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/family-photo_c81abf91.jpg";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

export default function HeroHeader() {
  const { meta } = useWeek();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="px-5 pt-14 pb-4 sm:px-6 sm:pt-16">
      <div className="max-w-2xl mx-auto">
        {/* Top row: photo + dark mode toggle */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={FAMILY_PHOTO}
                alt="Stanfield family"
                className="w-full h-full object-cover"
                style={{ objectPosition: "70% 30%" }}
              />
            </div>
          </motion.div>

          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-90"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* Large serif greeting — matching the mockup "Good morning, Sarah" style */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
        >
          <h1 className="font-display text-[2rem] sm:text-[2.5rem] leading-[1.1] text-foreground tracking-tight">
            {getGreeting()}
            <br />
            <span className="font-display font-semibold">{meta.familyName}</span>
          </h1>
        </motion.div>
      </div>
    </header>
  );
}
