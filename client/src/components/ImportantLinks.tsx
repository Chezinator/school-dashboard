/**
 * ImportantLinks — SchoolBase Dashboard Component
 * Design: Sunrise Command Center — warm coral, amber, teal palette
 *
 * Two sections:
 * 1. Pinned Tools (top) — Canvas, Skyward, ParentSquare, MealViewer — always visible
 * 2. Standalone Links — links from school emails that don't belong to a specific card
 *
 * No QR codes. No Email buttons (Gmail deep links were unreliable).
 */

import { useWeek } from "@/contexts/WeekContext";
import {
  ExternalLink, School, Newspaper,
  GraduationCap, Pin, Globe, AlertCircle, Link2
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
  earmarked?: boolean;
  gmailUrl?: string | null;
}

// Icon + color config per category
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; border: string; accent: string }> = {
  Tool:       { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-stone-700 dark:text-stone-300",  bg: "bg-stone-50 dark:bg-stone-800",   border: "border-stone-200 dark:border-stone-700",  accent: "bg-stone-600" },
  School:     { icon: <School className="w-3.5 h-3.5" />,        color: "text-teal-700 dark:text-teal-300",   bg: "bg-teal-50 dark:bg-teal-900/20",    border: "border-teal-200 dark:border-teal-700",   accent: "bg-teal-500" },
  District:   { icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-900/20",    border: "border-blue-200 dark:border-blue-700",   accent: "bg-blue-500" },
  Newsletter: { icon: <Newspaper className="w-3.5 h-3.5" />,     color: "text-purple-700 dark:text-purple-300", bg: "bg-purple-50 dark:bg-purple-900/20",  border: "border-purple-200 dark:border-purple-700", accent: "bg-purple-500" },
  Event:      { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-50 dark:bg-amber-900/20",   border: "border-amber-200 dark:border-amber-700",  accent: "bg-amber-500" },
};

// Tool emoji map for pinned tools
const TOOL_ICONS: Record<string, string> = {
  canvas:       "🎨",
  skyward:      "🌤️",
  parentsquare: "💬",
  mealviewer:   "🍽️",
};

function PinnedToolCard({ link }: { link: LinkItem }) {
  const emoji = TOOL_ICONS[link.id] ?? "🔗";

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="h-1 w-full bg-border/40" />
      <div className="p-3">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
            {emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Pin className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Pinned</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">{link.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{link.description}</p>
          </div>
        </div>

        {link.earmarked ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Direct link coming soon
          </div>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-foreground hover:opacity-80 text-background text-xs font-medium rounded-lg transition-opacity"
          >
            <ExternalLink className="w-3 h-3" />
            Open
          </a>
        )}
      </div>
    </div>
  );
}

function StandaloneLinkCard({ link }: { link: LinkItem }) {
  const cfg = CATEGORY_CONFIG[link.category] ?? CATEGORY_CONFIG["School"];

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`h-1 w-full ${cfg.accent}`} />
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {cfg.icon}
            {link.category}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {link.source}
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{link.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{link.description}</p>

        {/* Single Open Link button — Email button removed (unreliable deep links) */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-foreground hover:opacity-80 text-background text-xs font-medium rounded-lg transition-opacity"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Link
        </a>
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
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-light dark:bg-teal/20 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-teal" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Quick Links</h2>
          <p className="text-xs text-muted-foreground">School tools & resources</p>
        </div>
      </div>

      {/* Pinned Tools */}
      {pinnedTools.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Pin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pinned School Tools</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pinnedTools.map(link => (
              <PinnedToolCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {/* Standalone Links from emails */}
      {standaloneLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">From School Emails</span>
          </div>
          <div className="space-y-3">
            {standaloneLinks.map(link => (
              <StandaloneLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {allLinks.length === 0 && (
        <div className="bg-card rounded-xl p-8 border border-border/60 text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No links available this week</p>
        </div>
      )}
    </section>
  );
}
