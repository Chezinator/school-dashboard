/**
 * Home — SchoolBase Dashboard
 * Sunrise Command Center design with bottom nav bar (mobile-app style).
 * 5 tabs: Home | Dates | School | Homework | Links
 * Dark mode toggle in header.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeader from "@/components/HeroHeader";
import KidProfiles from "@/components/KidProfiles";
import ActionItems from "@/components/ActionItems";
import ImportantDates from "@/components/ImportantDates";
import LunchMenu from "@/components/LunchMenu";
import WeatherForecast from "@/components/WeatherForecast";
import TeacherComms from "@/components/TeacherComms";
import Homework from "@/components/Homework";
import SchoolDistrictComms from "@/components/SchoolDistrictComms";
import DolphinDigest from "@/components/DolphinDigest";
import ImportantLinks from "@/components/ImportantLinks";
import WeekSwitcher from "@/components/WeekSwitcher";
import { WeekProvider, useWeek } from "@/contexts/WeekContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Home as HomeIcon,
  CalendarDays,
  UtensilsCrossed,
  BookOpen,
  Link2,
  Moon,
  Sun,
  RefreshCw,
  Heart,
} from "lucide-react";

// Tab definitions
const TABS = [
  { id: "home",     label: "Home",    icon: HomeIcon },
  { id: "dates",    label: "Dates",   icon: CalendarDays },
  { id: "school",   label: "School",  icon: UtensilsCrossed },
  { id: "homework", label: "Homework",icon: BookOpen },
  { id: "links",    label: "Links",   icon: Link2 },
] as const;

type TabId = typeof TABS[number]["id"];

const tabVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

function DashboardContent() {
  const { meta, lastUpdatedFormatted, isLatest } = useWeek();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [prevTab, setPrevTab] = useState<TabId>("home");

  const tabOrder = TABS.map(t => t.id);
  const direction = tabOrder.indexOf(activeTab) - tabOrder.indexOf(prevTab);

  function goToTab(id: TabId) {
    setPrevTab(activeTab);
    setActiveTab(id);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Header with dark mode toggle */}
      <div className="relative">
        <HeroHeader />
        {/* Dark mode toggle — top-right corner over hero */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Week Switcher */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4">
        <WeekSwitcher />
        {!isLatest && (
          <div className="mb-3 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              Viewing archived week — data is from the selected week.
            </p>
          </div>
        )}
      </div>

      {/* Tab content — scrollable, with bottom padding for nav bar */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-28 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {/* ── HOME TAB ── */}
            {activeTab === "home" && (
              <div className="space-y-5 pt-2">
                <KidProfiles />
                <ActionItems />
                <TeacherComms />
                <DolphinDigest />
              </div>
            )}

            {/* ── DATES TAB ── */}
            {activeTab === "dates" && (
              <div className="space-y-5 pt-2">
                <ImportantDates />
                <SchoolDistrictComms />
              </div>
            )}

            {/* ── SCHOOL TAB ── */}
            {activeTab === "school" && (
              <div className="space-y-5 pt-2">
                <LunchMenu />
                <WeatherForecast />
              </div>
            )}

            {/* ── HOMEWORK TAB ── */}
            {activeTab === "homework" && (
              <div className="pt-2">
                <Homework />
              </div>
            )}

            {/* ── LINKS TAB ── */}
            {activeTab === "links" && (
              <div className="pt-2">
                <ImportantLinks />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── BOTTOM NAV BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 dark:bg-card/95 backdrop-blur-md border-t border-border/60 safe-area-pb">
        <div className="max-w-2xl mx-auto flex items-stretch">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 px-1 transition-all duration-200 ${
                  isActive
                    ? "text-coral"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`relative flex items-center justify-center w-8 h-6 rounded-full transition-all duration-200 ${
                  isActive ? "bg-coral/10" : ""
                }`}>
                  <Icon className={`transition-all duration-200 ${isActive ? "w-5 h-5" : "w-4.5 h-4.5"}`} />
                  {/* Active dot indicator */}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coral" />
                  )}
                </div>
                <span className={`text-[10px] font-medium leading-none transition-all duration-200 ${
                  isActive ? "text-coral font-semibold" : "text-muted-foreground"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer — visible only on Links tab to avoid clutter */}
      {activeTab === "links" && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-32 text-center">
          <div className="border-t border-border/50 pt-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-display text-sm text-foreground/70">SchoolBase</span>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{meta.familyName} Family</span>
            </div>
            <p className="text-xs text-muted-foreground/60">
              {meta.schoolName} · {meta.schoolAddress}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <RefreshCw className="w-3 h-3 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground/50">Last updated: {lastUpdatedFormatted}</p>
            </div>
            <p className="text-xs text-muted-foreground/30 mt-1.5 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-coral/50 fill-coral/50" /> for the family
            </p>
          </div>
        </div>
      )}
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
