/**
 * DolphinDigest — Dayhaven aesthetic
 * Teal accent, Fraunces headings, pill CTA buttons, generous whitespace.
 */
import { useWeek } from "@/contexts/WeekContext";
import { ExternalLink, Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DigestHighlight {
  icon: string;
  title: string;
  body: string;
}

interface DolphinDigestData {
  weekLabel: string;
  postedDate: string;
  postedBy: string;
  gmailUrl: string;
  linkLabel?: string;
  highlights: DigestHighlight[];
}

export default function DolphinDigest() {
  const { week } = useWeek();
  const digest: DolphinDigestData | undefined = (week as any)?.dolphinDigest;
  const [expanded, setExpanded] = useState(false);

  if (!digest) return null;

  const visibleHighlights = expanded ? digest.highlights : digest.highlights.slice(0, 3);
  const linkLabel = digest.linkLabel || "Read on ParentSquare";
  const linkUrl = digest.gmailUrl;

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-teal" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground tracking-tight">Dolphin Digest</h2>
          <p className="text-xs text-muted-foreground">Principal's Weekly Newsletter</p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-md">
        {/* Teal top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-teal to-teal/30" />

        {/* Card header */}
        <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-border/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🐬</span>
                <h3 className="font-display font-semibold text-foreground text-sm">Lake Whitney Dolphin Digest</h3>
              </div>
              <p className="text-xs text-muted-foreground">{digest.weekLabel}</p>
              <p className="text-xs text-muted-foreground">Posted {digest.postedDate} · {digest.postedBy}</p>
            </div>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-light dark:bg-teal/15 text-teal text-xs font-semibold hover:opacity-80 transition-opacity border border-teal/15"
            >
              <ExternalLink className="w-3 h-3" />
              Full Digest
            </a>
          </div>
        </div>

        {/* Highlights */}
        <div className="divide-y divide-border/25">
          {visibleHighlights.map((highlight, i) => (
            <div key={i} className="px-4 sm:px-5 py-3.5 flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">{highlight.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug mb-0.5">{highlight.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{highlight.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/collapse */}
        {digest.highlights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border-t border-border/30"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                {digest.highlights.length - 3} More Highlights
              </>
            )}
          </button>
        )}

        {/* Footer CTA — dark charcoal pill */}
        <div className="px-4 sm:px-5 py-3.5 bg-muted/20 border-t border-border/30">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-cta w-full"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {linkLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
