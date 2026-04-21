/**
 * TeacherComms — Expandable full-email cards.
 * Shows subject, sender, date, and preview. Tap to expand for full email body + attachments.
 * Color-coded per kid (Bronson=teal, Kaia=coral).
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import { Chalkboard, CaretDown, Paperclip, FilePdf, FileDoc, FileImage, File } from "@phosphor-icons/react";

const KID_CARD_STYLE: Record<string, string> = {
  bronson: "dh-card-teal",
  kaia: "dh-card-coral",
};

function AttachmentIcon({ type }: { type: string }) {
  const t = type || "";
  if (t.includes("pdf")) return <FilePdf size={16} weight="duotone" className="shrink-0" />;
  if (t.includes("image")) return <FileImage size={16} weight="duotone" className="shrink-0" />;
  if (t.includes("presentation") || t.includes("pptx")) return <FileDoc size={16} weight="duotone" className="shrink-0" />;
  if (t.includes("doc")) return <FileDoc size={16} weight="duotone" className="shrink-0" />;
  return <File size={16} weight="duotone" className="shrink-0" />;
}

function EmailCard({
  msg,
  teacher,
  teacherEmail,
  kid,
  cardStyle,
  delay,
}: {
  msg: any;
  teacher: string;
  teacherEmail?: string;
  kid: any;
  cardStyle: string;
  delay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const attachments = msg.attachments || [];
  const hasAttachments = attachments.length > 0;
  const hasFullBody = msg.fullBody && msg.fullBody.length > 0;
  
  const formattedDate = msg.date 
    ? new Date(msg.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      className={`dh-card ${cardStyle} cursor-pointer select-none`}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header row: kid badge + teacher + date */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {kid && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: kid.color }}
            >
              {kid.name}
            </span>
          )}
          <p className="font-display text-sm font-bold leading-tight truncate">{teacher}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasAttachments && (
            <span className="flex items-center gap-0.5 text-xs opacity-60">
              <Paperclip size={12} />
              {attachments.length}
            </span>
          )}
          <span className="text-xs opacity-60 whitespace-nowrap">
            {formattedDate}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <CaretDown size={14} className="opacity-50" />
          </motion.div>
        </div>
      </div>

      {/* Subject line */}
      <p className="text-sm font-semibold opacity-90 mb-1.5">{msg.subject || "No Subject"}</p>

      {/* Preview (summary) — always visible */}
      <p className="text-sm leading-relaxed opacity-70 line-clamp-2">{msg.summary || "No preview available"}</p>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-3 border-t border-current/10">
              {/* From line */}
              {teacherEmail && (
                <p className="text-xs opacity-50 mb-3">
                  From: {teacher} &lt;{teacherEmail}&gt;
                </p>
              )}

              {/* Full email body */}
              {hasFullBody && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">Full Email</p>
                  <div className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap break-words bg-black/5 dark:bg-white/5 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                    {msg.fullBody}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {hasAttachments && (
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
                    Attachments ({attachments.length})
                  </p>
                  <div className="space-y-2">
                    {attachments.map((att: any, aIdx: number) => (
                      <div key={aIdx} className="bg-black/5 dark:bg-white/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-2 mb-1">
                          <AttachmentIcon type={att.type || ""} />
                          <span className="text-sm font-medium truncate">{att.filename || "file"}</span>
                          <span className="text-[10px] opacity-40 shrink-0 uppercase">
                            {att.type?.split("/").pop()?.replace("vnd.openxmlformats-officedocument.presentationml.presentation", "pptx") || "file"}
                          </span>
                        </div>
                        {att.description && (
                          <p className="text-xs opacity-50 ml-6">{att.description}</p>
                        )}
                        {att.extractedContent && (
                          <details className="mt-2 ml-6">
                            <summary className="text-xs font-semibold opacity-60 cursor-pointer hover:opacity-80 transition-opacity">
                              View extracted content
                            </summary>
                            <div className="mt-2 text-xs leading-relaxed opacity-70 whitespace-pre-wrap break-words bg-black/5 dark:bg-white/5 rounded p-2.5 max-h-[300px] overflow-y-auto">
                              {att.extractedContent}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TeacherComms() {
  const { week, kids } = useWeek();
  const comms = week.teacherComms || [];
  if (!comms.length) return null;

  let animIdx = 0;

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <Chalkboard size={22} weight="duotone" className="text-dh-teal" />
        <h2 className="font-display text-xl text-foreground tracking-tight">
          Teacher Updates
        </h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Full emails from the family inbox — tap to expand
      </p>

      <div className="space-y-3">
        {comms.map((comm: any, cIdx: number) => {
          const kid = kids.find((k) => k.id === comm.kidId);
          const cardStyle = comm.kidId
            ? KID_CARD_STYLE[comm.kidId] || "dh-card-sage"
            : "dh-card-sage";

          const messages = comm.messages || [];

          return messages.map((msg: any, mIdx: number) => {
            animIdx++;
            return (
              <EmailCard
                key={`${cIdx}-${mIdx}`}
                msg={msg}
                teacher={comm.teacher || "Teacher"}
                teacherEmail={comm.teacherEmail}
                kid={kid}
                cardStyle={cardStyle}
                delay={animIdx * 0.04}
              />
            );
          });
        })}
      </div>
    </section>
  );
}
