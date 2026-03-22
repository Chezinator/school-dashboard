/**
 * ImportantLinks — Dayhaven mockup style:
 * Pinned tools as color-blocked squares in a 2-col grid.
 * Standalone links as color-blocked cards.
 * No borders, no shadows — solid fills only.
 */
import { useWeek } from "@/contexts/WeekContext";
import { motion } from "framer-motion";
import { ArrowSquareOut, WarningCircle, GlobeSimple, LinkSimple } from "@phosphor-icons/react";

interface LinkItem {
  id: string; title: string; url: string; description: string;
  category: string; source: string; kid: string | null;
  pinned?: boolean; earmarked?: boolean; gmailUrl?: string | null;
}

const TOOL_ICONS: Record<string, string> = {
  canvas: "🎨", skyward: "🌤️", parentsquare: "💬", mealviewer: "🍽️",
};

const TOOL_CARDS: Record<string, string> = {
  canvas: "dh-card-coral",
  skyward: "dh-card-teal",
  parentsquare: "dh-card-sage",
  mealviewer: "dh-card-amber",
};

const CATEGORY_CARDS: Record<string, string> = {
  Tool: "dh-card-cream",
  School: "dh-card-sage",
  District: "dh-card-teal",
  Newsletter: "dh-card-coral",
  Event: "dh-card-amber",
};

export default function ImportantLinks() {
  const { week } = useWeek();
  const allLinks: LinkItem[] = (week as any)?.importantLinks ?? [];
  const pinnedTools = allLinks.filter(l => l.pinned);
  const standaloneLinks = allLinks.filter(l => !l.pinned);

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <LinkSimple size={22} weight="duotone" className="text-dh-teal" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Quick Links</h2>
      </div>

      {/* Pinned tools — 2-col color-blocked grid */}
      {pinnedTools.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Pinned Tools</p>
          <div className="grid grid-cols-2 gap-3">
            {pinnedTools.map((link, idx) => {
              const emoji = TOOL_ICONS[link.id] ?? "🔗";
              const cardStyle = TOOL_CARDS[link.id] || "dh-card-cream";
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.06 }}
                  whileHover={{ y: -3 }}
                  className={`dh-card ${cardStyle} flex flex-col`}
                >
                  <div className="text-2xl mb-3">{emoji}</div>
                  <h3 className="font-display text-sm font-semibold leading-tight mb-1">{link.title}</h3>
                  <p className="text-xs opacity-70 leading-relaxed mb-3 flex-1">{link.description}</p>
                  {link.earmarked ? (
                    <div className="flex items-center gap-1.5 text-xs font-medium opacity-60">
                      <WarningCircle size={14} weight="bold" className="shrink-0" />
                      Direct link coming soon
                    </div>
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors self-start"
                    >
                      <ArrowSquareOut size={14} weight="bold" />
                      Open
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Standalone links */}
      {standaloneLinks.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Resources</p>
          <div className="space-y-3">
            {standaloneLinks.map((link, idx) => {
              const cardStyle = CATEGORY_CARDS[link.category] || "dh-card-cream";
              return (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`dh-card ${cardStyle}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-50">{link.category}</span>
                    <span className="text-[10px] opacity-30">·</span>
                    <span className="text-[10px] opacity-50">{link.source}</span>
                  </div>
                  <h3 className="font-display text-sm font-semibold leading-snug mb-1">{link.title}</h3>
                  <p className="text-xs leading-relaxed opacity-75 mb-3">{link.description}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                  >
                    <ArrowSquareOut size={14} weight="bold" />
                    Open Link
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {allLinks.length === 0 && (
        <div className="dh-card dh-card-cream text-center py-8">
          <GlobeSimple size={32} weight="duotone" className="opacity-20 mx-auto mb-2" />
          <p className="text-sm opacity-60">No links available this week</p>
        </div>
      )}
    </section>
  );
}
