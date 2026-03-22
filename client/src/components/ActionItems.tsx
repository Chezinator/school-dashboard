/**
 * ActionItems — Color-coded by kid (Bronson=teal, Kaia=coral, general=amber).
 * Phosphor icons on titles. Solid color-blocked cards.
 * Links rendered as pill buttons. Date labeled "Due" for clarity.
 */
import { useWeek } from "@/contexts/WeekContext";
import { Warning, CalendarCheck, ArrowSquareOut } from "@phosphor-icons/react";
import { motion } from "framer-motion";

interface ActionLink { url: string; label: string; }

const KID_CARD_STYLE: Record<string, string> = {
  bronson: "dh-card-teal",
  kaia: "dh-card-coral",
};

const CATEGORY_ICONS: Record<string, string> = {
  "test-prep": "📝",
  "reminder": "🔔",
  "event": "🎉",
  "volunteer": "🤝",
  "deadline": "⏰",
  "info": "💡",
};

export default function ActionItems() {
  const { week, kids } = useWeek();
  const items = week.actionItems;

  if (!items.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Warning size={20} weight="duotone" className="text-dh-coral" />
        <h2 className="font-display text-lg font-semibold text-foreground tracking-tight">Action Items</h2>
        <span className="text-xs font-bold text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 ml-auto">
          {items.length}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const kid = item.kidId ? kids.find((k) => k.id === item.kidId) : null;
          const cardStyle = item.kidId ? (KID_CARD_STYLE[item.kidId] || "dh-card-cream") : "dh-card-amber";
          const emoji = CATEGORY_ICONS[item.category] || "📌";
          const dueDate = item.dueDate
            ? new Date(item.dueDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
            : null;

          // Support both single link and links array (use type assertion for JSON union)
          const anyItem = item as any;
          const links: ActionLink[] = anyItem.links
            ? anyItem.links
            : anyItem.link
              ? [anyItem.link]
              : [];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ type: "spring", stiffness: 260, damping: 24, delay: idx * 0.05 }}
              whileHover={{ y: -2 }}
              className={`dh-card ${cardStyle} ${item.urgent ? "urgent-pulse" : ""}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg mt-0.5 shrink-0" aria-hidden="true">{emoji}</span>
                <div className="flex-1 min-w-0">
                  {/* Kid badge + Urgent badge */}
                  {(kid || item.urgent) && (
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {kid && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: kid.color }}
                        >
                          {kid.name}
                        </span>
                      )}
                      {item.urgent && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/15">
                          <Warning size={10} weight="fill" aria-hidden="true" />
                          Urgent
                        </span>
                      )}
                    </div>
                  )}

                  <h3 className="text-sm font-semibold leading-snug mb-1">{item.title}</h3>
                  <p className="text-xs opacity-75 leading-relaxed">{item.description}</p>

                  {/* Due date — clearly labeled */}
                  {dueDate && (
                    <div className="flex items-center gap-1 mt-2">
                      <CalendarCheck size={12} weight="bold" className="opacity-50" aria-hidden="true" />
                      <p className="text-[10px] font-semibold opacity-60 uppercase tracking-wider">
                        Due {dueDate}
                      </p>
                    </div>
                  )}

                  {/* Action links */}
                  {links.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {links.map((lnk, li) => (
                        <a
                          key={li}
                          href={lnk.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-black/15 hover:bg-black/25 transition-colors"
                          aria-label={`${lnk.label} (opens in new tab)`}
                        >
                          <ArrowSquareOut size={11} weight="bold" aria-hidden="true" />
                          {lnk.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
