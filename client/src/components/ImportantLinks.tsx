/**
 * ImportantLinks — SchoolBase Dashboard Component
 * Design: Sunrise Command Center — warm coral, amber, teal palette
 * Shows curated links from school emails with QR codes and Gmail deep links
 */

import { useState } from "react";
import { useWeek } from "@/contexts/WeekContext";
import { ExternalLink, Mail, QrCode, BookOpen, Calendar, School, Newspaper, GraduationCap, ChevronDown, ChevronUp } from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  source: string;
  kid: string | null;
  gmailUrl: string;
  qrCode?: string;
}

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string }> = {
  School:     { icon: <School className="w-3.5 h-3.5" />,       color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200" },
  Event:      { icon: <Calendar className="w-3.5 h-3.5" />,     color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  Homework:   { icon: <BookOpen className="w-3.5 h-3.5" />,     color: "text-coral-700",  bg: "bg-coral-50",  border: "border-coral-200" },
  District:   { icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-blue-700",  bg: "bg-blue-50",   border: "border-blue-200" },
  Newsletter: { icon: <Newspaper className="w-3.5 h-3.5" />,    color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
};

const SOURCE_COLORS: Record<string, string> = {
  "School":       "bg-teal-100 text-teal-800",
  "Lake Whitney": "bg-teal-100 text-teal-800",
  "OCPS District":"bg-blue-100 text-blue-800",
  "Ms. Smith":    "bg-coral-100 text-coral-800",
  "Ms. Cuccinello":"bg-amber-100 text-amber-800",
};

const KID_COLORS: Record<string, string> = {
  bronson: "bg-teal-100 text-teal-800 border border-teal-200",
  kaia:    "bg-coral-100 text-coral-800 border border-coral-200",
};

function LinkCard({ link }: { link: LinkItem }) {
  const [showQr, setShowQr] = useState(false);
  const catConfig = CATEGORY_CONFIG[link.category] ?? CATEGORY_CONFIG["School"];
  const sourceColor = SOURCE_COLORS[link.source] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top accent bar by category */}
      <div className={`h-1 w-full ${
        link.category === "Homework" ? "bg-coral-400" :
        link.category === "Event"    ? "bg-amber-400" :
        link.category === "District" ? "bg-blue-400"  :
        link.category === "Newsletter" ? "bg-purple-400" :
        "bg-teal-400"
      }`} />

      <div className="p-4">
        {/* Header row: category badge + source badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${catConfig.bg} ${catConfig.color} ${catConfig.border}`}>
              {catConfig.icon}
              {link.category}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${sourceColor}`}>
              {link.source}
            </span>
            {link.kid && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${KID_COLORS[link.kid] ?? "bg-gray-100 text-gray-700"}`}>
                {link.kid === "bronson" ? "Bronson" : "Kaia"}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-1">{link.title}</h3>

        {/* Description */}
        <p className="text-xs text-stone-500 leading-relaxed mb-3">{link.description}</p>

        {/* QR Code (expandable) */}
        {link.qrCode && (
          <div className="mb-3">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-teal-600 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              {showQr ? "Hide QR Code" : "Show QR Code"}
              {showQr ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showQr && (
              <div className="mt-2 flex justify-center">
                <div className="bg-white p-2 rounded-lg border border-stone-200 inline-block">
                  <img
                    src={link.qrCode}
                    alt={`QR code for ${link.title}`}
                    className="w-28 h-28"
                  />
                  <p className="text-center text-xs text-stone-400 mt-1">Scan to open</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Link
          </a>
          <a
            href={link.gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
            title="View original email in Gmail"
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ImportantLinks() {
  const { week } = useWeek();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const links: LinkItem[] = (week as any)?.importantLinks ?? [];

  const categories = ["All", ...Array.from(new Set(links.map(l => l.category)))];

  const filtered = activeFilter === "All"
    ? links
    : links.filter(l => l.category === activeFilter);

  const catConfig = (cat: string) => CATEGORY_CONFIG[cat] ?? CATEGORY_CONFIG["School"];

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-stone-800">Important Links</h2>
            <p className="text-xs text-stone-400">From school emails · Scan QR codes to open on any device</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      {categories.length > 1 && (
        <div className="px-5 pt-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map(cat => {
            const cfg = cat === "All" ? null : catConfig(cat);
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-stone-800 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cfg && <span className={isActive ? "text-white" : cfg.color}>{cfg.icon}</span>}
                {cat}
                {cat !== "All" && (
                  <span className={`ml-0.5 text-xs ${isActive ? "text-stone-300" : "text-stone-400"}`}>
                    ({links.filter(l => l.category === cat).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Links grid */}
      <div className="p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <QrCode className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No links for this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(link => (
              <LinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="px-5 pb-4">
        <p className="text-xs text-stone-400 text-center">
          Links extracted from school emails · Click "Email" to view the original message in Gmail
        </p>
      </div>
    </section>
  );
}
