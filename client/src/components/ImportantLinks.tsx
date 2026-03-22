/**
 * ImportantLinks — Dayhaven aesthetic
 * Color-blocked rounded cards, pill badges, charcoal pill CTAs, Fraunces headings.
 * Pinned Tools (top) + Standalone Links (bottom).
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

const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string; accent: string }> = {
  Tool:       { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-warm-gray",  bg: "bg-muted",                                accent: "bg-warm-gray" },
  School:     { icon: <School className="w-3.5 h-3.5" />,        color: "text-teal",       bg: "bg-teal-light dark:bg-teal/15",           accent: "bg-teal" },
  District:   { icon: <GraduationCap className="w-3.5 h-3.5" />, color: "text-sage",       bg: "bg-sage-light dark:bg-sage/15",           accent: "bg-sage" },
  Newsletter: { icon: <Newspaper className="w-3.5 h-3.5" />,     color: "text-coral",      bg: "bg-coral-light dark:bg-coral/15",         accent: "bg-coral" },
  Event:      { icon: <Globe className="w-3.5 h-3.5" />,         color: "text-amber",      bg: "bg-amber-light dark:bg-amber/15",         accent: "bg-amber" },
};

const TOOL_ICONS: Record<string, string> = {
  canvas:       "🎨",
  skyward:      "🌤️",
  parentsquare: "💬",
  mealviewer:   "🍽️",
};

function PinnedToolCard({ link }: { link: LinkItem }) {
  const emoji = TOOL_ICONS[link.id] ?? "🔗";

  return (
    <div className="bg-card rounded-2xl border border-border/40 transition-all duration-300 hover:shadow-md overflow-hidden">
      <div className="h-1 w-full bg-border/30" />
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-lg shrink-0">
            {emoji}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <Pin className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Pinned</span>
            </div>
            <h3 className="font-display font-semibold text-foreground text-sm leading-tight">{link.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{link.description}</p>
          </div>
        </div>

        {link.earmarked ? (
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-light dark:bg-amber/15 border border-amber/15 text-amber text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Direct link coming soon
          </div>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-cta w-full text-xs py-2"
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
    <div className="bg-card rounded-2xl border border-border/40 transition-all duration-300 hover:shadow-md overflow-hidden">
      <div className={`h-1 w-full ${cfg.accent}`} />
      <div className="p-4 sm:p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
            {cfg.icon}
            {link.category}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {link.source}
          </span>
        </div>

        <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{link.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{link.description}</p>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-cta w-full text-xs"
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
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center">
          <Link2 className="w-4 h-4 text-teal" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground tracking-tight">Quick Links</h2>
          <p className="text-xs text-muted-foreground">School tools & resources</p>
        </div>
      </div>

      {/* Pinned Tools */}
      {pinnedTools.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Pin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pinned School Tools</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pinnedTools.map(link => (
              <PinnedToolCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {/* Standalone Links */}
      {standaloneLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">From School Emails</span>
          </div>
          <div className="space-y-3">
            {standaloneLinks.map(link => (
              <StandaloneLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
      )}

      {allLinks.length === 0 && (
        <div className="bg-card rounded-2xl p-8 border border-border/40 text-center">
          <Globe className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No links available this week</p>
        </div>
      )}
    </section>
  );
}
