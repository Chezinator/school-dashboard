/**
 * Home — SchoolBase Dashboard (Dayhaven App Experience)
 * 
 * App-like UX with:
 * - Personalized greeting home screen with smart info cards
 * - Pull-to-refresh on mobile
 * - Framer Motion whileInView entrance animations
 * - Spring tab transitions
 * - Bottom nav with active indicator
 * 
 * 5 tabs: Home | Dates | School | Homework | Links
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
import UpcomingDatesCard from "@/components/UpcomingDatesCard";
import HomeworkSummaryCard from "@/components/HomeworkSummaryCard";
import QuickToolsRow from "@/components/QuickToolsRow";
import AnimatedCard, { AnimatedSection } from "@/components/AnimatedCard";
import { WeekProvider, useWeek } from "@/contexts/WeekContext";
import {
  Home as HomeIcon,
  CalendarDays,
  GraduationCap,
  BookOpen,
  Link2,
  RefreshCw,
  Heart,
  List,
  Calendar,
} from "lucide-react";

const TABS = [
  { id: "home",     label: "Home",    icon: HomeIcon },
  { id: "dates",    label: "Dates",   icon: CalendarDays },
  { id: "school",   label: "School",  icon: GraduationCap },
  { id: "homework", label: "Work",    icon: BookOpen },
  { id: "links",    label: "Links",   icon: Link2 },
] as const;

type TabId = typeof TABS[number]["id"];

const tabVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24, scale: 0.98 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24, scale: 0.98 }),
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
    // Scroll to top on tab switch
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
        <div className="max-w-2xl mx-auto w-full px-4 pt-4">
          <WeekSwitcher />
          {!isLatest && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 px-4 py-2.5 rounded-2xl bg-amber-light dark:bg-amber/15 border border-amber/20 dark:border-amber/30 text-center"
            >
              <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                Viewing archived week
              </p>
            </motion.div>
          )}
        </div>

        {/* Tab content */}
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-24 overflow-x-hidden">
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
              {/* ── HOME TAB — Smart Cards ── */}
              {activeTab === "home" && (
                <div className="space-y-4 pt-2">
                  {/* Quick Tools */}
                  <AnimatedSection delay={0}>
                    <div className="mb-1">
                      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Access</h2>
                      <QuickToolsRow delay={0} />
                    </div>
                  </AnimatedSection>

                  {/* Action Items — most important, always first */}
                  <AnimatedSection delay={1}>
                    <ActionItems />
                  </AnimatedSection>

                  {/* Smart info row — lunch + weather side by side */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TodayLunchCard delay={2} />
                    <TodayWeatherCard delay={3} />
                  </div>

                  {/* Upcoming dates + homework progress */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <UpcomingDatesCard delay={4} />
                    <HomeworkSummaryCard delay={5} />
                  </div>

                  {/* Teacher Communications */}
                  <AnimatedSection delay={6}>
                    <TeacherComms />
                  </AnimatedSection>

                  {/* Dolphin Digest */}
                  <AnimatedSection delay={7}>
                    <DolphinDigest />
                  </AnimatedSection>
                </div>
              )}

              {/* ── DATES TAB ── */}
              {activeTab === "dates" && (
                <div className="space-y-5 pt-2">
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
                      <AnimatedSection delay={0}><ImportantDates /></AnimatedSection>
                      <AnimatedSection delay={1}><SchoolDistrictComms /></AnimatedSection>
                    </>
                  ) : (
                    <AnimatedSection delay={0}><MonthCalendar /></AnimatedSection>
                  )}
                </div>
              )}

              {/* ── SCHOOL TAB ── */}
              {activeTab === "school" && (
                <div className="space-y-6 pt-2">
                  <AnimatedSection delay={0}><LunchMenu /></AnimatedSection>
                  <AnimatedSection delay={1}><WeatherForecast /></AnimatedSection>
                </div>
              )}

              {/* ── HOMEWORK TAB ── */}
              {activeTab === "homework" && (
                <div className="pt-2">
                  <AnimatedSection delay={0}><Homework /></AnimatedSection>
                </div>
              )}

              {/* ── LINKS TAB ── */}
              {activeTab === "links" && (
                <div className="pt-2">
                  <AnimatedSection delay={0}><ImportantLinks /></AnimatedSection>

                  {/* Footer */}
                  <div className="mt-10 text-center pb-4">
                    <div className="border-t border-border/30 pt-5">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="font-display text-sm text-foreground/50">SchoolBase</span>
                        <span className="text-muted-foreground/20 text-xs">·</span>
                        <span className="text-xs text-muted-foreground/60">{meta.familyName} Family</span>
                      </div>
                      <p className="text-xs text-muted-foreground/40">
                        {meta.schoolName} · {meta.schoolAddress}
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

      {/* ── BOTTOM NAV BAR ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 dark:bg-card/95 backdrop-blur-xl border-t border-border/30">
        <div className="max-w-2xl mx-auto flex items-stretch" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => goToTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 transition-all duration-200 active:scale-90"
              >
                <motion.div
                  className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-sage-light dark:bg-sage/20" : ""
                  }`}
                  animate={isActive ? { scale: 1 } : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon className={`transition-all duration-200 ${
                    isActive ? "w-5 h-5 text-foreground" : "w-[18px] h-[18px] text-muted-foreground"
                  }`} />
                </motion.div>
                <span className={`text-[10px] leading-none transition-all duration-200 ${
                  isActive ? "font-bold text-foreground" : "font-medium text-muted-foreground"
                }`}>
                  {tab.label}
                </span>
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
