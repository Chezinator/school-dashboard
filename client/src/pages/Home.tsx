/**
 * Home — Dayhaven App Dashboard
 * 
 * Matches the landing page mockups exactly:
 * - Large serif greeting "Good morning, Stanfield"
 * - 2-column color-blocked cards (schedule + lunch)
 * - Weather card below
 * - Action items as color-blocked cards
 * - 4-icon bottom nav (home, calendar, mail, profile)
 * - Pull-to-refresh on mobile
 * - Spring entrance animations
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroHeader from "@/components/HeroHeader";
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
import PullToRefresh from "@/components/PullToRefresh";
import TodayLunchCard from "@/components/TodayLunchCard";
import TodayWeatherCard from "@/components/TodayWeatherCard";
import TodayScheduleCard from "@/components/TodayScheduleCard";
import UpcomingDatesCard from "@/components/UpcomingDatesCard";
import HomeworkSummaryCard from "@/components/HomeworkSummaryCard";
import QuickToolsRow from "@/components/QuickToolsRow";
import { WeekProvider, useWeek } from "@/contexts/WeekContext";
import {
  Home as HomeIcon,
  CalendarDays,
  Mail,
  User,
  BookOpen,
  Link2,
  RefreshCw,
  Heart,
  List,
  Calendar,
} from "lucide-react";

/* 4 tabs matching the mockup bottom nav: Home, Dates, Comms, More */
const TABS = [
  { id: "home",   icon: HomeIcon },
  { id: "dates",  icon: CalendarDays },
  { id: "comms",  icon: Mail },
  { id: "more",   icon: User },
] as const;

type TabId = typeof TABS[number]["id"];

const tabVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 20 : -20 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -20 : 20 }),
};

function DashboardContent() {
  const { meta, lastUpdatedFormatted, isLatest } = useWeek();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [prevTab, setPrevTab] = useState<TabId>("home");
  const [datesView, setDatesView] = useState<"list" | "calendar">("list");

  const tabOrder = TABS.map(t => t.id);
  const direction = tabOrder.indexOf(activeTab) - tabOrder.indexOf(prevTab);

  function goToTab(id: TabId) {
    setPrevTab(activeTab);
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 600));
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Greeting Header */}
        <HeroHeader />

        {/* Week Switcher */}
        <div className="max-w-lg mx-auto w-full px-5 pt-2">
          <WeekSwitcher />
          {!isLatest && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 px-4 py-2.5 rounded-2xl dh-card-amber text-center"
            >
              <p className="text-sm font-medium">Viewing archived week</p>
            </motion.div>
          )}
        </div>

        {/* Tab content */}
        <main className="flex-1 max-w-lg mx-auto w-full px-5 pb-24 overflow-x-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={tabVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.7 }}
            >

              {/* ── HOME TAB — Matches the mockup dashboard screen ── */}
              {activeTab === "home" && (
                <div className="space-y-4 pt-3">
                  {/* Quick Tools Row */}
                  <QuickToolsRow delay={0} />

                  {/* 2-column grid: Schedule + Lunch — matching the mockup exactly */}
                  <div className="grid grid-cols-2 gap-3">
                    <TodayScheduleCard delay={1} />
                    <TodayLunchCard delay={2} />
                  </div>

                  {/* Weather + Homework row */}
                  <div className="grid grid-cols-2 gap-3">
                    <TodayWeatherCard delay={3} />
                    <HomeworkSummaryCard delay={4} />
                  </div>

                  {/* Action Items */}
                  <ActionItems />

                  {/* Upcoming Dates */}
                  <UpcomingDatesCard delay={6} />
                </div>
              )}

              {/* ── DATES TAB ── */}
              {activeTab === "dates" && (
                <div className="space-y-5 pt-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl text-foreground tracking-tight">Dates</h2>
                    <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
                      <button
                        onClick={() => setDatesView("list")}
                        aria-label="List view"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
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
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
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

              {/* ── COMMS TAB — Teacher comms + Dolphin Digest ── */}
              {activeTab === "comms" && (
                <div className="space-y-6 pt-3">
                  <TeacherComms />
                  <DolphinDigest />
                </div>
              )}

              {/* ── MORE TAB — School info, Homework, Links ── */}
              {activeTab === "more" && (
                <div className="space-y-6 pt-3">
                  <LunchMenu />
                  <WeatherForecast />
                  <Homework />
                  <ImportantLinks />

                  {/* Footer */}
                  <div className="mt-8 text-center pb-4">
                    <div className="pt-5">
                      <p className="font-display text-sm text-muted-foreground/50">Dayhaven</p>
                      <p className="text-xs text-muted-foreground/40 mt-1">
                        {meta.familyName} Family · {meta.schoolName}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        <RefreshCw className="w-3 h-3 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground/30">{lastUpdatedFormatted}</p>
                      </div>
                      <p className="text-xs text-muted-foreground/20 mt-2 flex items-center justify-center gap-1">
                        Made with <Heart className="w-3 h-3 text-coral/30 fill-coral/30" /> for the family
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </PullToRefresh>

      {/* ── BOTTOM NAV — 4 icons, no labels, matching the mockup ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl">
        <div
          className="max-w-lg mx-auto flex items-center justify-around py-3"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className="flex items-center justify-center w-12 h-12 transition-all duration-200 active:scale-90"
                aria-label={tab.id}
              >
                <motion.div
                  animate={isActive ? { scale: 1 } : { scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      isActive
                        ? "w-6 h-6 text-foreground"
                        : "w-5 h-5 text-muted-foreground"
                    }`}
                    fill={isActive ? "currentColor" : "none"}
                    strokeWidth={isActive ? 1.5 : 2}
                  />
                </motion.div>
              </button>
            );
          })}
        </div>
      </nav>
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
