/**
 * SchoolDistrictComms — Dayhaven mockup style:
 * Color-blocked cards per communication. Filter pills.
 * No borders, no shadows — solid fills only.
 */
import { useState } from "react";
import { CaretDown, CaretUp, ArrowSquareOut, Buildings } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const CATEGORY_CARDS: Record<string, string> = {
  announcement: "dh-card-coral",
  event:        "dh-card-amber",
  fundraiser:   "dh-card-pink",
  newsletter:   "dh-card-teal",
  reminder:     "dh-card-sage",
};

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
      <div className="flex items-center gap-2 mb-4">
        <Buildings size={22} weight="duotone" className="text-dh-sage" />
        <h2 className="font-display text-xl text-foreground tracking-tight">School & District</h2>
      </div>

      {/* Source filter pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {([
          { key: "all", label: "All" },
          { key: "district", label: "OCPS" },
          { key: "school", label: "Lake Whitney" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setShowAll(false); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
              filter === tab.key
                ? "bg-dh-charcoal text-white dark:bg-white dark:text-dh-charcoal"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
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
            const cardStyle = CATEGORY_CARDS[comm.category] || "dh-card-cream";
            return (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.05 }}
                whileHover={{ y: -2 }}
                className={`dh-card ${cardStyle}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">
                    {comm.source}
                  </span>
                  <span className="text-[10px] opacity-40">·</span>
                   <span className="text-[10px] opacity-50">Sent {formatDate(comm.date)}</span>
                </div>
                <h3 className="font-display text-sm font-semibold leading-snug mb-1">{comm.subject}</h3>
                <p className="text-xs opacity-60 mb-2">From: {comm.from}</p>
                <p className="text-sm leading-relaxed opacity-80">{comm.summary}</p>
                {(comm as any).link && (
                  <a
                    href={(comm as any).link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                  >
                    <ArrowSquareOut size={14} weight="bold" />
                    {(comm as any).link.label}
                  </a>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2.5 rounded-full bg-muted text-sm font-semibold text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          {showAll ? (
            <>Show Less <CaretUp size={16} weight="bold" /></>
          ) : (
            <>Show All {filtered.length} <CaretDown size={16} weight="bold" /></>
          )}
        </button>
      )}
    </section>
  );
}
