/**
 * DolphinDigest — Dayhaven mockup style:
 * Solid teal card for the digest, highlights listed inside.
 * No borders, no shadows — solid fills only.
 */
import { useWeek } from "@/contexts/WeekContext";
import { ArrowSquareOut, CaretDown, CaretUp, Newspaper } from "@phosphor-icons/react";
import { useState } from "react";
import { motion } from "framer-motion";

interface DigestHighlight { icon: string; title: string; body: string; }

interface DolphinDigestData {
  weekLabel: string; postedDate: string; postedBy: string;
  gmailUrl: string; linkLabel?: string; highlights: DigestHighlight[];
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
          <span className="text-lg">🐬</span>
          <h3 className="font-display text-base font-bold">Lake Whitney Dolphin Digest</h3>
        </div>
        <p className="text-xs opacity-60 mb-4">{digest.weekLabel} · {digest.postedBy}</p>

        <div className="space-y-3 mb-4">
          {visibleHighlights.map((highlight, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <span className="text-base mt-0.5 shrink-0">{highlight.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-snug mb-0.5">{highlight.title}</p>
                <p className="text-xs opacity-75 leading-relaxed">{highlight.body}</p>
              </div>
            </div>
          ))}
        </div>

        {digest.highlights.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold opacity-60 hover:opacity-100 transition-opacity mb-4"
          >
            {expanded ? (
              <><CaretUp size={14} weight="bold" /> Show Less</>
            ) : (
              <><CaretDown size={14} weight="bold" /> {digest.highlights.length - 3} More</>
            )}
          </button>
        )}

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowSquareOut size={14} weight="bold" />
          {linkLabel}
        </a>
      </motion.div>
    </section>
  );
}
