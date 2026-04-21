/**
 * DolphinDigest — Dayhaven mockup style:
 * Solid teal card for the digest, highlights listed inside.
 * All emoji replaced with Phosphor icons.
 * No borders, no shadows — solid fills only.
 */
import { useWeek } from "@/contexts/WeekContext";
import {
  ArrowSquareOut,
  CaretDown,
  CaretUp,
  Newspaper,
  Fish,
  Confetti,
  Trophy,
  Books,
  PersonSimpleRun,
  Star,
  Megaphone,
  CalendarCheck,
  Heart,
  Lightbulb,
  PushPin,
} from "@phosphor-icons/react";
import { useState } from "react";
import { motion } from "framer-motion";

// Highlights can be either a rich object or a plain string in older data schemas
type DigestHighlight = { icon: string; title: string; body: string } | string;

interface DolphinDigestData {
  // Old schema fields
  weekLabel?: string;
  postedDate?: string;
  postedBy?: string;
  gmailUrl?: string;
  linkLabel?: string;
  highlights: DigestHighlight[];
  // New schema fields
  publishedDate?: string;
  volume?: string;
  link?: string;
}

// Map emoji/keyword strings to Phosphor icons
function HighlightIcon({ icon }: { icon: string }) {
  const props = { size: 18, weight: "duotone" as const, className: "shrink-0 mt-0.5 opacity-80" };
  const lower = (icon || "").toLowerCase();
  if (lower.includes("🎉") || lower.includes("party") || lower.includes("dance") || lower.includes("recap")) return <Confetti {...props} />;
  if (lower.includes("🏆") || lower.includes("trophy") || lower.includes("spotlight") || lower.includes("award")) return <Trophy {...props} />;
  if (lower.includes("📚") || lower.includes("book") || lower.includes("fair") || lower.includes("read")) return <Books {...props} />;
  if (lower.includes("🏃") || lower.includes("field day") || lower.includes("run") || lower.includes("sport")) return <PersonSimpleRun {...props} />;
  if (lower.includes("⭐") || lower.includes("🌟") || lower.includes("star") || lower.includes("excel")) return <Star {...props} />;
  if (lower.includes("📢") || lower.includes("announce") || lower.includes("news")) return <Megaphone {...props} />;
  if (lower.includes("📅") || lower.includes("date") || lower.includes("calendar") || lower.includes("event")) return <CalendarCheck {...props} />;
  if (lower.includes("❤") || lower.includes("heart") || lower.includes("appreciat") || lower.includes("thank")) return <Heart {...props} />;
  if (lower.includes("💡") || lower.includes("tip") || lower.includes("info")) return <Lightbulb {...props} />;
  return <PushPin {...props} />;
}

export default function DolphinDigest() {
  const { week } = useWeek();
  const digest: DolphinDigestData | undefined = (week as any)?.dolphinDigest;
  const [expanded, setExpanded] = useState(false);

  if (!digest) return null;

  const highlights = digest.highlights || [];
  const visibleHighlights = expanded ? highlights : highlights.slice(0, 3);

  // Support both old schema (gmailUrl + linkLabel) and new schema (link)
  const linkLabel = digest.linkLabel || "Read on ParentSquare";
  const linkUrl = digest.gmailUrl || digest.link || "https://www.parentsquare.com";

  // Support both old schema (weekLabel + postedBy) and new schema (volume + publishedDate)
  const headerLine = [
    digest.weekLabel || digest.volume,
    digest.postedBy || digest.publishedDate,
  ].filter(Boolean).join(" · ");

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={22} weight="duotone" className="text-dh-teal" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Dolphin Digest</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        whileHover={{ y: -2 }}
        className="dh-card dh-card-teal"
      >
        <div className="flex items-center gap-2 mb-1">
          <Fish size={20} weight="duotone" className="opacity-80" aria-hidden="true" />
          <h3 className="font-display text-base font-bold">Lake Whitney Dolphin Digest</h3>
        </div>
        {headerLine && (
          <p className="text-xs opacity-60 mb-4">{headerLine}</p>
        )}

        <div className="space-y-3 mb-4">
          {visibleHighlights.map((highlight, i) => {
            // Handle both string highlights (new schema) and object highlights (old schema)
            if (typeof highlight === "string") {
              return (
                <div key={i} className="flex gap-2.5 items-start">
                  <HighlightIcon icon={highlight} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug mb-0.5">{highlight}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="flex gap-2.5 items-start">
                <HighlightIcon icon={highlight.icon || ""} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-snug mb-0.5">{highlight.title}</p>
                  {highlight.body && (
                    <p className="text-xs opacity-75 leading-relaxed">{highlight.body}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {highlights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity mb-4"
            aria-expanded={expanded}
            aria-label={expanded ? "Show fewer highlights" : `Show ${highlights.length - 3} more highlights`}
          >
            {expanded ? (
              <><CaretUp size={14} weight="bold" aria-hidden="true" /> Show Less</>
            ) : (
              <><CaretDown size={14} weight="bold" aria-hidden="true" /> {highlights.length - 3} More</>
            )}
          </button>
        )}

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors"
          aria-label={`${linkLabel} (opens in new tab)`}
        >
          <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
          {linkLabel}
        </a>
      </motion.div>
    </section>
  );
}
