/**
 * Home — Dayhaven App Dashboard
 *
 * - Family photo hero background with greeting overlay
 * - Color-coded cards: Bronson=teal, Kaia=coral, dates=sage, lunch=coral, weather=amber, homework=pink
 * - Cards are clickable to navigate to relevant tabs AND scroll to the exact section
 * - Scroll-to-section uses a pendingScrollRef + useEffect to wait for DOM availability
 *   (AnimatePresence exit animation means the new tab DOM isn't ready immediately)
 * - Bottom nav uses Phosphor icons — reversed (outline when inactive, filled when active)
 * - Pull-to-refresh on mobile
 */
import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  House,
  CalendarDots,
  EnvelopeSimple,
  DotsThreeCircle,
  List,
  CalendarBlank,
  Rows,
} from "@phosphor-icons/react";
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
import WeeklyCalendar from "@/components/WeeklyCalendar";
import PullToRefresh from "@/components/PullToRefresh";
import TodayLunchCard from "@/components/TodayLunchCard";
import TodayWeatherCard from "@/components/TodayWeatherCard";
import UpcomingDatesCard from "@/components/UpcomingDatesCard";
import HomeworkSummaryCard from "@/components/HomeworkSummaryCard";
import { WeekProvider, useWeek } from "@/contexts/WeekContext";
import { ArrowsClockwise, Heart } from "@phosphor-icons/react";

/* 4 tabs: Home, Dates, Comms, More */
const TABS = [
  { id: "home",  label: "Home",  Icon: House },
  { id: "dates", label: "Dates", Icon: CalendarDots },
  { id: "comms", label: "Comms", Icon: EnvelopeSimple },
  { id: "more",  label: "More",  Icon: DotsThreeCircle },
] as const;

type TabId = typeof TABS[number]["id"];

const tabVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 20 : -20 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -20 : 20 }),
};

/**
 * Poll for a DOM element by ID using requestAnimationFrame, then scroll to it.
 * This is necessary because AnimatePresence delays rendering of the new tab content.
 */
function pollAndScroll(sectionId: string, maxAttempts = 40) {
  let attempts = 0;
  function attempt() {
    attempts++;
    const el = document.getElementById(sectionId);
    if (el) {
      // Small extra delay to let the spring animation settle
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } else if (attempts < maxAttempts) {
      requestAnimationFrame(attempt);
    }
  }
  requestAnimationFrame(attempt);
}

function DashboardContent() {
  const { meta, lastUpdatedFormatted } = useWeek();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [prevTab, setPrevTab] = useState<TabId>("home");
  const [datesView, setDatesView] = useState<"list" | "week" | "month">("week");

  // Store the pending scroll target — set before tab switch, consumed after render
  const pendingScrollRef = useRef<string | null>(null);

  const tabOrder = TABS.map(t => t.id);
  const direction = tabOrder.indexOf(activeTab) - tabOrder.indexOf(prevTab);

  // After activeTab changes and the component re-renders with new tab content,
  // execute the pending scroll if one is queued
  useEffect(() => {
    const sectionId = pendingScrollRef.current;
    if (sectionId) {
      pendingScrollRef.current = null;
      pollAndScroll(sectionId);
    }
  }, [activeTab]);

  /** Switch to a tab and scroll to top */
  function goToTab(id: TabId) {
    setPrevTab(activeTab);
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Switch to a tab AND scroll to a specific section within it */
  function goToTabAndScroll(tabId: TabId, sectionId: string) {
    // Queue the scroll target BEFORE changing tab so useEffect picks it up
    pendingScrollRef.current = sectionId;
    setPrevTab(activeTab);
    setActiveTab(tabId);
    // Instantly reset scroll position so the new tab starts at top
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }

  const handleRefresh = useCallback(async () => {
    await new Promise(r => setTimeout(r, 600));
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PullToRefresh onRefresh={handleRefresh}>
        {/* Hero Header — family photo background */}
        <HeroHeader />

        {/* Week Switcher */}
        <div className="max-w-lg mx-auto w-full px-5 pt-4">
          <WeekSwitcher />
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

              {/* ── HOME TAB ── */}
              {activeTab === "home" && (
                <div className="space-y-4 pt-3">
                  {/* 2-column grid: Upcoming Dates + Lunch */}
                  <div className="grid grid-cols-2 gap-3">
                    <UpcomingDatesCard
                      delay={0}
                      onNavigate={() => goToTabAndScroll("dates", "section-dates")}
                    />
                    <TodayLunchCard
                      delay={1}
                      onNavigate={() => goToTabAndScroll("more", "section-lunch")}
                    />
                  </div>

                  {/* Weather + Homework row */}
                  <div className="grid grid-cols-2 gap-3">
                    <TodayWeatherCard
                      delay={2}
                      onNavigate={() => goToTabAndScroll("more", "section-weather")}
                    />
                    <HomeworkSummaryCard
                      delay={3}
                      onNavigate={() => goToTabAndScroll("more", "section-homework")}
                    />
                  </div>

                  {/* Action Items */}
                  <ActionItems />
                </div>
              )}

              {/* ── DATES TAB ── */}
              {activeTab === "dates" && (
                <div className="space-y-5 pt-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-xl text-foreground tracking-tight">Dates</h2>
                    <div className="flex items-center bg-muted rounded-full p-1 gap-0.5">
                      <button
                        onClick={() => setDatesView("week")}
                        aria-label="Week view"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          datesView === "week"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Rows size={14} />
                        Week
                      </button>
                      <button
                        onClick={() => setDatesView("month")}
                        aria-label="Month view"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          datesView === "month"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <CalendarBlank size={14} />
                        Month
                      </button>
                      <button
                        onClick={() => setDatesView("list")}
                        aria-label="List view"
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                          datesView === "list"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <List size={14} />
                        List
                      </button>
                    </div>
                  </div>

                  <div id="section-dates" style={{ scrollMarginTop: "12px" }}>
                    {datesView === "week" && <WeeklyCalendar />}
                    {datesView === "month" && <MonthCalendar />}
                    {datesView === "list" && (
                      <>
                        <ImportantDates />
                        <div className="mt-5">
                          <SchoolDistrictComms />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* ── COMMS TAB ── */}
              {activeTab === "comms" && (
                <div className="space-y-6 pt-3">
                  <div id="section-teacher-comms" style={{ scrollMarginTop: "12px" }}>
                    <TeacherComms />
                  </div>
                  <div id="section-dolphin-digest" style={{ scrollMarginTop: "12px" }}>
                    <DolphinDigest />
                  </div>
                </div>
              )}

              {/* ── MORE TAB ── */}
              {activeTab === "more" && (
                <div className="space-y-6 pt-3">
                  {/* section-lunch anchor — scroll target from home Lunch card */}
                  <div id="section-lunch" style={{ scrollMarginTop: "12px" }}>
                    <LunchMenu />
                  </div>

                  {/* section-weather anchor — scroll target from home Weather card */}
                  <div id="section-weather" style={{ scrollMarginTop: "12px" }}>
                    <WeatherForecast />
                  </div>

                  {/* section-homework anchor — scroll target from home Homework card */}
                  <div id="section-homework" style={{ scrollMarginTop: "12px" }}>
                    <Homework />
                  </div>

                  <div id="section-links" style={{ scrollMarginTop: "12px" }}>
                    <ImportantLinks />
                  </div>

                  {/* Footer */}
                  <div className="mt-8 text-center pb-4">
                    <div className="pt-5">
                      <p className="font-display text-sm text-muted-foreground/50">Dayhaven</p>
                      <p className="text-xs text-muted-foreground/40 mt-1">
                        {meta.familyName} Family · {meta.schoolName}
                      </p>
                      <div className="flex items-center justify-center gap-1.5 mt-2">
                        <ArrowsClockwise size={12} className="text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground/30">{lastUpdatedFormatted}</p>
                      </div>
                      <p className="text-xs text-muted-foreground/20 mt-2 flex items-center justify-center gap-1">
                        Made with <Heart size={12} weight="fill" className="text-dh-coral/30" /> for the family
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </main>
      </PullToRefresh>

      {/* ── BOTTOM NAV — Phosphor icons, reversed fill treatment ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/30"
        role="tablist"
        aria-label="Main navigation"
      >
        <div
          className="max-w-lg mx-auto flex items-center justify-around py-2"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)" }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-label={tab.label}
                onClick={() => goToTab(tab.id)}
                className="flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all duration-200 active:scale-90"
              >
                <motion.div
                  animate={isActive ? { scale: 1 } : { scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <tab.Icon
                    size={24}
                    weight={isActive ? "fill" : "regular"}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  />
                </motion.div>
                <span className={`text-[10px] font-medium transition-colors duration-200 ${
                  isActive ? "text-foreground" : "text-muted-foreground"
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
