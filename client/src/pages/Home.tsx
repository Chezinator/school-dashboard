/**
 * Home — SchoolBase Dashboard
 * Dayhaven aesthetic: warm cream, Fraunces serif, color-blocked cards,
 * dark charcoal pill CTAs, generous whitespace, spring animations.
 * 5 tabs: Home | Dates | School | Homework | Links
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
import MonthCalendar from "@/components/MonthCalendar";
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
  List,
  Calendar,
} from "lucide-react";

const TABS = [
  { id: "home",     label: "Home",    icon: HomeIcon },
  { id: "dates",    label: "Dates",   icon: CalendarDays },
  { id: "school",   label: "School",  icon: UtensilsCrossed },
  { id: "homework", label: "Homework",icon: BookOpen },
  { id: "links",    label: "Links",   icon: Link2 },
] as const;

type TabId = typeof TABS[number]["id"];

const tabVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 30 : -30 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -30 : 30 }),
};

function DashboardContent() {
  const { meta, lastUpdatedFormatted, isLatest } = useWeek();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [prevTab, setPrevTab] = useState<TabId>("home");
  const [datesView, setDatesView] = useState<"list" | "calendar">("list");

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
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all duration-200 border border-white/20"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Week Switcher */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-5">
        <WeekSwitcher />
        {!isLatest && (
          <div className="mb-3 px-4 py-2.5 rounded-2xl bg-amber-light dark:bg-amber/15 border border-amber/20 dark:border-amber/30 text-center">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
              Viewing archived week — data is from the selected week.
            </p>
          </div>
        )}
      </div>

      {/* Tab content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-28 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          >
            {/* ── HOME TAB ── */}
            {activeTab === "home" && (
              <div className="space-y-6 pt-3">
                <KidProfiles />
                <ActionItems />
                <TeacherComms />
                <DolphinDigest />
              </div>
            )}

            {/* ── DATES TAB ── */}
            {activeTab === "dates" && (
              <div className="space-y-6 pt-3">
                {/* List / Calendar toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-light dark:bg-amber/15 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4 text-amber" />
                    </div>
                    <h2 className="font-display text-xl text-foreground tracking-tight">Dates</h2>
                  </div>
                  <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
                    <button
                      onClick={() => setDatesView("list")}
                      aria-label="List view"
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        datesView === "list"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      List
                    </button>
                    <button
                      onClick={() => setDatesView("calendar")}
                      aria-label="Calendar view"
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                        datesView === "calendar"
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Calendar
                    </button>
                  </div>
                </div>

                {datesView === "list" ? (
                  <>
                    <ImportantDates />
                    <SchoolDistrictComms />
                  </>
                ) : (
                  <MonthCalendar />
                )}
              </div>
            )}

            {/* ── SCHOOL TAB ── */}
            {activeTab === "school" && (
              <div className="space-y-6 pt-3">
                <LunchMenu />
                <WeatherForecast />
              </div>
            )}

            {/* ── HOMEWORK TAB ── */}
            {activeTab === "homework" && (
              <div className="pt-3">
                <Homework />
              </div>
            )}

            {/* ── LINKS TAB ── */}
            {activeTab === "links" && (
              <div className="pt-3">
                <ImportantLinks />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── BOTTOM NAV BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 dark:bg-card/90 backdrop-blur-xl border-t border-border/50 safe-area-pb">
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
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className={`relative flex items-center justify-center w-9 h-7 rounded-full transition-all duration-300 ${
                  isActive ? "bg-sage-light dark:bg-sage/20" : ""
                }`}>
                  <Icon className={`transition-all duration-200 ${isActive ? "w-5 h-5" : "w-4.5 h-4.5"}`} />
                </div>
                <span className={`text-[10px] leading-none transition-all duration-200 ${
                  isActive ? "font-bold" : "font-medium"
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer — visible only on Links tab */}
      {activeTab === "links" && (
        <div className="max-w-2xl mx-auto w-full px-4 pb-32 text-center">
          <div className="border-t border-border/40 pt-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="font-display text-sm text-foreground/60">SchoolBase</span>
              <span className="text-muted-foreground/30 text-xs">·</span>
              <span className="text-xs text-muted-foreground">{meta.familyName} Family</span>
            </div>
            <p className="text-xs text-muted-foreground/50">
              {meta.schoolName} · {meta.schoolAddress}
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <RefreshCw className="w-3 h-3 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground/40">Last updated: {lastUpdatedFormatted}</p>
            </div>
            <p className="text-xs text-muted-foreground/25 mt-2 flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-coral/40 fill-coral/40" /> for the family
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
