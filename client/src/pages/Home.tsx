/**
 * Home — Stanfield Family School Dashboard
 * Sunrise Command Center design: warm editorial layout with priority-ordered sections.
 * Mobile-first single column, expanding to 2-column on desktop.
 * School & District Communications is full-width at the very bottom.
 * WeekProvider wraps everything for multi-week archive support.
 */
import { motion } from "framer-motion";
import HeroHeader from "@/components/HeroHeader";
import KidProfiles from "@/components/KidProfiles";
import ActionItems from "@/components/ActionItems";
import ImportantDates from "@/components/ImportantDates";
import LunchMenu from "@/components/LunchMenu";
import WeatherForecast from "@/components/WeatherForecast";
import TeacherComms from "@/components/TeacherComms";
import Homework from "@/components/Homework";
import SchoolDistrictComms from "@/components/SchoolDistrictComms";
import WeekSwitcher from "@/components/WeekSwitcher";
import { WeekProvider, useWeek } from "@/contexts/WeekContext";
import { Heart, RefreshCw } from "lucide-react";

const SCHOOL_PATTERN = "https://d2xsxph8kpxj0f.cloudfront.net/119477265/dub7JCh9JrSoBwJsuGgFMH/school-pattern-dFvoYAsAoeZXSaxJKdi4wu.webp";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

function DashboardContent() {
  const { meta, lastUpdatedFormatted, isLatest } = useWeek();

  return (
    <div
      className="min-h-screen bg-background"
      style={{
        backgroundImage: `url(${SCHOOL_PATTERN})`,
        backgroundSize: "400px",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Semi-transparent overlay so pattern is subtle */}
      <div className="min-h-screen bg-background/90">
        {/* Hero Header */}
        <HeroHeader />

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Week Switcher — only shows when there are multiple weeks */}
          <WeekSwitcher />

          {/* Archive banner when viewing past weeks */}
          {!isLatest && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-center"
            >
              <p className="text-sm text-amber-800 font-medium">
                You are viewing an archived week. Data shown is from the selected week.
              </p>
            </motion.div>
          )}

          {/* Kid Profiles */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mb-6"
          >
            <KidProfiles />
          </motion.div>

          {/* Two-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column — Priority content */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp}>
                <ActionItems />
              </motion.div>

              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp}>
                <TeacherComms />
              </motion.div>

              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
                <Homework />
              </motion.div>
            </div>

            {/* Right column — Reference content */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div custom={1.5} initial="hidden" animate="visible" variants={fadeInUp}>
                <ImportantDates />
              </motion.div>

              <motion.div custom={2.5} initial="hidden" animate="visible" variants={fadeInUp}>
                <WeatherForecast />
              </motion.div>

              <motion.div custom={3.5} initial="hidden" animate="visible" variants={fadeInUp}>
                <LunchMenu />
              </motion.div>
            </div>
          </div>

          {/* School & District Communications — full-width at the very bottom */}
          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-6"
          >
            <SchoolDistrictComms />
          </motion.div>
        </main>

        {/* Footer with Last Updated timestamp */}
        <footer className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <div className="border-t border-border/50 pt-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-display text-base text-foreground/70">SchoolBase</span>
              <span className="text-muted-foreground/40 text-sm">·</span>
              <span className="text-sm text-muted-foreground">{meta.familyName} Family</span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              {meta.schoolName} · {meta.schoolAddress}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <RefreshCw className="w-3 h-3 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground/50">
                Last updated: {lastUpdatedFormatted}
              </p>
            </div>
            <p className="text-xs text-muted-foreground/30 mt-2 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-coral/50 fill-coral/50" /> for the family
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <WeekProvider>
      <DashboardContent />
    </WeekProvider>
  );
}
