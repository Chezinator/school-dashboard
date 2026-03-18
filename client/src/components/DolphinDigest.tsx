/**
 * DolphinDigest — SchoolBase Dashboard Component
 * Design: Sunrise Command Center — warm coral, amber, teal palette
 *
 * Displays a summary card of the Lake Whitney Elementary Dolphin Digest
 * (Principal Dr. Crabb's weekly newsletter), with a "Read Full Digest" 
 * link that opens the Gmail thread directly.
 *
 * Data source: dolphinDigest field in weeklyReport.json
 * Automation: Each Sunday, the pipeline finds the latest Dolphin Digest 
 * email (subject contains "Dolphin Digest") and extracts highlights.
 */

import { useWeek } from "@/contexts/WeekContext";
import { ExternalLink, Mail, Newspaper, ChevronDown, ChevronUp } from "lucide-react";
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
  gmailThreadId: string;
  gmailUrl: string;
  highlights: DigestHighlight[];
}

export default function DolphinDigest() {
  const { week } = useWeek();
  const digest: DolphinDigestData | undefined = (week as any)?.dolphinDigest;
  const [expanded, setExpanded] = useState(false);

  if (!digest) return null;

  const visibleHighlights = expanded ? digest.highlights : digest.highlights.slice(0, 3);

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-light dark:bg-teal/20 flex items-center justify-center">
          <Newspaper className="w-4 h-4 text-teal" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Dolphin Digest</h2>
          <p className="text-xs text-muted-foreground">Principal's Weekly Newsletter</p>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Teal top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal to-teal/40" />

        {/* Card header */}
        <div className="px-4 pt-4 pb-3 border-b border-border/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🐬</span>
                <h3 className="font-semibold text-foreground text-sm">Lake Whitney Dolphin Digest</h3>
              </div>
              <p className="text-xs text-muted-foreground">{digest.weekLabel}</p>
              <p className="text-xs text-muted-foreground">Posted {digest.postedDate} · {digest.postedBy}</p>
            </div>
            {/* Read Full Digest button */}
            <a
              href={digest.gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-light dark:bg-teal/20 text-teal text-xs font-medium hover:opacity-80 transition-opacity border border-teal/20"
            >
              <Mail className="w-3 h-3" />
              Full Digest
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Highlights */}
        <div className="divide-y divide-border/30">
          {visibleHighlights.map((highlight, i) => (
            <div key={i} className="px-4 py-3 flex gap-3 items-start">
              <span className="text-base mt-0.5 shrink-0">{highlight.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug mb-0.5">{highlight.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{highlight.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/collapse if more than 3 highlights */}
        {digest.highlights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border/40"
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

        {/* Footer CTA */}
        <div className="px-4 py-3 bg-muted/30 border-t border-border/40">
          <a
            href={digest.gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-foreground hover:opacity-80 text-background text-xs font-medium rounded-lg transition-opacity"
          >
            <Mail className="w-3.5 h-3.5" />
            Read Full Digest in Gmail
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
