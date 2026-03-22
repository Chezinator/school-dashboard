/**
 * SchoolDistrictComms — Dayhaven app aesthetic
 * Color-blocked rounded cards, pill filter tabs, staggered entrance animations.
 */
import { useState } from "react";
import {
  Building2, School, Megaphone, CalendarHeart, Heart,
  Newspaper, Bell, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "announcement": return <Megaphone className="w-4 h-4" />;
    case "event":        return <CalendarHeart className="w-4 h-4" />;
    case "fundraiser":   return <Heart className="w-4 h-4" />;
    case "newsletter":   return <Newspaper className="w-4 h-4" />;
    case "reminder":     return <Bell className="w-4 h-4" />;
    default:             return <Megaphone className="w-4 h-4" />;
  }
}

function getCategoryStyle(category: string) {
  switch (category) {
    case "announcement": return { bg: "bg-coral-light dark:bg-coral/15", text: "text-coral", label: "Announcement" };
    case "event":        return { bg: "bg-amber-light dark:bg-amber/15", text: "text-amber", label: "Event" };
    case "fundraiser":   return { bg: "bg-coral-light dark:bg-coral/15", text: "text-coral", label: "Fundraiser" };
    case "newsletter":   return { bg: "bg-teal-light dark:bg-teal/15", text: "text-teal", label: "Newsletter" };
    case "reminder":     return { bg: "bg-amber-light dark:bg-amber/15", text: "text-amber", label: "Reminder" };
    default:             return { bg: "bg-muted", text: "text-muted-foreground", label: "Update" };
  }
}

function getSourceStyle(sourceType: string) {
  if (sourceType === "district") {
    return { icon: <Building2 className="w-3.5 h-3.5" />, bg: "bg-teal-light dark:bg-teal/15", text: "text-teal" };
  }
  return { icon: <School className="w-3.5 h-3.5" />, bg: "bg-sage-light dark:bg-sage/15", text: "text-sage" };
}

function getPriorityBorder(priority: string) {
  switch (priority) {
    case "high":   return "card-coral";
    case "normal": return "card-teal";
    case "low":    return "card-amber";
    default:       return "";
  }
}

export default function SchoolDistrictComms() {
  const { week } = useWeek();
  const comms = week.schoolDistrictComms;
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "district" | "school">("all");

  if (!comms || !comms.length) return null;

  const filtered = comms.filter((c) => filter === "all" || c.sourceType === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 4);
  const hasMore = filtered.length > 4;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-teal" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">School & District</h2>
      </div>

      {/* Source filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {([
          { key: "all", label: "All" },
          { key: "district", label: "OCPS District" },
          { key: "school", label: "Lake Whitney" },
        ] as const).map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setShowAll(false); }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
              filter === tab.key
                ? "bg-charcoal text-white dark:bg-white dark:text-charcoal shadow-sm"
                : "bg-card text-foreground border border-border/40 hover:bg-muted"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-60">
              ({tab.key === "all" ? comms.length : comms.filter((c) => c.sourceType === tab.key).length})
            </span>
          </motion.button>
        ))}
      </div>

      {/* Communication cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="space-y-3"
        >
          {displayed.map((comm, idx) => {
            const catStyle = getCategoryStyle(comm.category);
            const srcStyle = getSourceStyle(comm.sourceType);
            return (
              <AnimatedCard key={comm.id} delay={idx}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`bg-card rounded-2xl p-4 border border-border/40 ${getPriorityBorder(comm.priority)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-2xl ${catStyle.bg} ${catStyle.text} flex items-center justify-center shrink-0 mt-0.5`}>
                      {getCategoryIcon(comm.category)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${srcStyle.bg} ${srcStyle.text}`}>
                          {srcStyle.icon}
                          {comm.source}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${catStyle.bg} ${catStyle.text}`}>
                          {catStyle.label}
                        </span>
                        {comm.priority === "high" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-coral-light dark:bg-coral/15 text-coral">
                            Important
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground text-sm leading-snug">{comm.subject}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">From: {comm.from}</p>
                      <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{comm.summary}</p>
                      <div className="flex items-center justify-between mt-3 gap-3">
                        <p className="text-xs text-amber font-medium">{formatDate(comm.date)}</p>
                        {(comm as any).link && (
                          <a
                            href={(comm as any).link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 pill-cta text-xs py-1.5 px-3.5"
                          >
                            {(comm as any).link.label}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedCard>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <motion.button
          onClick={() => setShowAll(!showAll)}
          whileTap={{ scale: 0.97 }}
          className="w-full mt-3 py-2.5 rounded-full bg-card border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {showAll ? (
            <>Show Less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show All {filtered.length} <ChevronDown className="w-4 h-4" /></>
          )}
        </motion.button>
      )}
    </section>
  );
}
