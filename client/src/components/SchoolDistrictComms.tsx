/**
 * SchoolDistrictComms — School & District Communications section.
 * Displays important communications from OCPS and Lake Whitney Elementary.
 * Sunrise Command Center design: warm editorial cards with source badges and priority indicators.
 */
import { useState } from "react";
import {
  Building2,
  School,
  Megaphone,
  CalendarHeart,
  Heart,
  Newspaper,
  Bell,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import data from "@/data/weeklyReport.json";

type CommItem = (typeof data.schoolDistrictComms)[number];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getCategoryIcon(category: string) {
  switch (category) {
    case "announcement":
      return <Megaphone className="w-4 h-4" />;
    case "event":
      return <CalendarHeart className="w-4 h-4" />;
    case "fundraiser":
      return <Heart className="w-4 h-4" />;
    case "newsletter":
      return <Newspaper className="w-4 h-4" />;
    case "reminder":
      return <Bell className="w-4 h-4" />;
    default:
      return <Megaphone className="w-4 h-4" />;
  }
}

function getCategoryStyle(category: string) {
  switch (category) {
    case "announcement":
      return { bg: "bg-coral-light", text: "text-coral", label: "Announcement" };
    case "event":
      return { bg: "bg-amber-light", text: "text-amber", label: "Event" };
    case "fundraiser":
      return { bg: "bg-pink-50", text: "text-pink-600", label: "Fundraiser" };
    case "newsletter":
      return { bg: "bg-teal-light", text: "text-teal", label: "Newsletter" };
    case "reminder":
      return { bg: "bg-amber-light", text: "text-amber", label: "Reminder" };
    default:
      return { bg: "bg-gray-50", text: "text-gray-600", label: "Update" };
  }
}

function getSourceStyle(sourceType: string) {
  if (sourceType === "district") {
    return {
      icon: <Building2 className="w-3.5 h-3.5" />,
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  }
  return {
    icon: <School className="w-3.5 h-3.5" />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  };
}

function getPriorityBorder(priority: string) {
  switch (priority) {
    case "high":
      return "card-urgent";
    case "normal":
      return "card-info";
    case "low":
      return "card-date";
    default:
      return "";
  }
}

export default function SchoolDistrictComms() {
  const comms = data.schoolDistrictComms;
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "district" | "school">("all");

  if (!comms || !comms.length) return null;

  const filtered = comms.filter((c) => {
    if (filter === "all") return true;
    return c.sourceType === filter;
  });

  // Show first 4 by default, all when expanded
  const displayed = showAll ? filtered : filtered.slice(0, 4);
  const hasMore = filtered.length > 4;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="font-display text-xl text-foreground">
          School & District Communications
        </h2>
      </div>

      {/* Source filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {(
          [
            { key: "all", label: "All" },
            { key: "district", label: "OCPS District" },
            { key: "school", label: "Lake Whitney" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              setShowAll(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filter === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-foreground border border-border/50 hover:bg-gray-50"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">
              (
              {tab.key === "all"
                ? comms.length
                : comms.filter((c) => c.sourceType === tab.key).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Communication cards */}
      <div className="space-y-3">
        {displayed.map((comm) => {
          const catStyle = getCategoryStyle(comm.category);
          const srcStyle = getSourceStyle(comm.sourceType);

          return (
            <div
              key={comm.id}
              className={`bg-white rounded-xl p-4 shadow-sm border border-border/50 ${getPriorityBorder(
                comm.priority
              )} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                {/* Category icon */}
                <div
                  className={`w-8 h-8 rounded-lg ${catStyle.bg} ${catStyle.text} flex items-center justify-center shrink-0 mt-0.5`}
                >
                  {getCategoryIcon(comm.category)}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Badges row */}
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${srcStyle.bg} ${srcStyle.text}`}
                    >
                      {srcStyle.icon}
                      {comm.source}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${catStyle.bg} ${catStyle.text}`}
                    >
                      {catStyle.label}
                    </span>
                    {comm.priority === "high" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Important
                      </span>
                    )}
                  </div>

                  {/* Subject */}
                  <h3 className="font-semibold text-foreground text-sm leading-snug">
                    {comm.subject}
                  </h3>

                  {/* From */}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    From: {comm.from}
                  </p>

                  {/* Summary */}
                  <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                    {comm.summary}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-amber font-medium mt-2">
                    {formatDate(comm.date)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / less toggle */}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2.5 rounded-xl bg-white border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show All {filtered.length} Communications{" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </section>
  );
}
