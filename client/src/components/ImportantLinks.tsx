/**
 * ImportantLinks — SchoolBase Dashboard Component
 * Design: Sunrise Command Center — warm coral, amber, teal palette
 *
 * Two sections:
 * 1. Pinned Tools (top) — Canvas, Skyward, ParentSquare, MealViewer — always visible
 * 2. Standalone Links — links from school emails that don't belong to a specific card
 */

import { useState } from "react";
import { useWeek } from "@/contexts/WeekContext";
import {
  ExternalLink, Mail, QrCode, School, Newspaper,
  GraduationCap, ChevronDown, ChevronUp, Pin, Globe
} from "lucide-react";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  source: string;
  kid: string | null;
  pinned?: boolean;
  gmailUrl: string | null;
  qrCode?: string;
}

// Icon + color config per category
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; accent: string }> = {
  Tool:       { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-stone-700",  bg: "bg-stone-50",   border: "border-stone-200",  accent: "bg-stone-700" },
  School:     { icon: <School className="w-3.5 h-3.5" />,        color: "text-teal-700",   bg: "bg-teal-50",    border: "border-teal-200",   accent: "bg-teal-500" },
  District:   { icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-blue-700",   bg: "bg-blue-50",    border: "border-blue-200",   accent: "bg-blue-500" },
  Newsletter: { icon: <Newspaper className="w-3.5 h-3.5" />,     color: "text-purple-700", bg: "bg-purple-50",  border: "border-purple-200", accent: "bg-purple-500" },
  Event:      { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-amber-700",  bg: "bg-amber-50",   border: "border-amber-200",  accent: "bg-amber-500" },
};

// Tool icon map for pinned tools
const TOOL_ICONS: Record<string, string> = {
  canvas:      "🎨",
  skyward:     "🌤️",
  parentsquare: "💬",
  mealviewer:  "🍽️",
};

function PinnedToolCard({ link }: { link: LinkItem }) {
  const [showQr, setShowQr] = useState(false);
  const emoji = TOOL_ICONS[link.id] ?? "🔗";

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="h-1 w-full bg-stone-200" />
      <div className="p-3">
        <div className="flex items-start gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-lg shrink-0">
            {emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Pin className="w-2.5 h-2.5 text-stone-400" />
              <span className="text-xs text-stone-400 font-medium">Pinned</span>
            </div>
            <h3 className="font-semibold text-stone-800 text-sm leading-tight">{link.title}</h3>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{link.description}</p>
          </div>
        </div>

        {/* QR toggle */}
        {link.qrCode && (
          <div className="mb-2">
            <button
              onClick={() => setShowQr(!showQr)}
              className="flex items-center gap-1 text-xs text-stone-400 hover:text-teal-600 transition-colors"
            >
              <QrCode className="w-3 h-3" />
              {showQr ? "Hide QR" : "Show QR"}
              {showQr ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
            {showQr && (
              <div className="mt-2 flex justify-center">
                <div className="bg-white p-1.5 rounded-lg border border-stone-200 inline-block">
                  <img src={link.qrCode} alt={`QR for ${link.title}`} className="w-24 h-24" />
                  <p className="text-center text-xs text-stone-400 mt-0.5">Scan to open</p>
                </div>
              </div>
            )}
          </div>
        )}

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium rounded-lg transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </a>
      </div>
    </div>
  );
}

function StandaloneLinkCard({ link }: { link: LinkItem }) {
  const [showQr, setShowQr] = useState(false);
  const cfg = CATEGORY_CONFIG[link.category] ?? CATEGORY_CONFIG["School"];

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`h-1 w-full ${cfg.accent}`} />
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {cfg.icon}
            {link.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600">
            {link.source}
          </span>
        </div>

        <h3 className="font-semibold text-stone-800 text-sm leading-snug mb-1">{link.title}</h3>
        <p className="text-xs text-stone-500 leading-relaxed mb-3">{link.description}</p>

        {/* QR toggle */}
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
                  <img src={link.qrCode} alt={`QR for ${link.title}`} className="w-28 h-28" />
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
          {link.gmailUrl && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImportantLinks() {
  const { week } = useWeek();
  const allLinks: LinkItem[] = (week as any)?.importantLinks ?? [];

  const pinnedTools = allLinks.filter(l => l.pinned);
  const standaloneLinks = allLinks.filter(l => !l.pinned);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-stone-800">Quick Links</h2>
            <p className="text-xs text-stone-400">School tools, resources & email links · Scan QR codes on any device</p>
          </div>
        </div>
      </div>

      {/* Pinned Tools */}
      {pinnedTools.length > 0 && (
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-1.5 mb-3">
            <Pin className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Pinned School Tools</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {pinnedTools.map(link => (
              <PinnedToolCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {/* Standalone Links from emails */}
      {standaloneLinks.length > 0 && (
        <div className="px-5 pt-2 pb-4">
          {pinnedTools.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3 pt-3 border-t border-stone-100">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">From School Emails</span>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {standaloneLinks.map(link => (
              <StandaloneLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {allLinks.length === 0 && (
        <div className="px-5 py-8 text-center text-stone-400">
          <QrCode className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No links available this week</p>
        </div>
      )}

      <div className="px-5 pb-4">
        <p className="text-xs text-stone-400 text-center">
          Standalone links extracted from school emails · Click "Email" to view the original message in Gmail
        </p>
      </div>
    </section>
  );
}
