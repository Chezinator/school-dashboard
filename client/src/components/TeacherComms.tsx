/**
 * TeacherComms — Expandable full-email cards.
 * Shows subject, sender, date, and preview. Tap to expand for full email body + attachments.
 * Color-coded per kid (Bronson=teal, Kaia=coral).
 * Attachments are clickable chips:
 *   - URL-based attachments open the URL directly in a new tab.
 *   - File attachments link to a Gmail search for the email thread (via teacherEmail + subject).
 *   - If no link can be constructed, the chip is shown but not interactive.
 *
 * Handles two attachment schemas:
 *   Object: { filename, type, url?, description?, extractedContent? }
 *   String: "filename.pdf"  (newer data format — just the filename as a plain string)
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import {
  Chalkboard,
  CaretDown,
  Paperclip,
  FilePdf,
  FileDoc,
  FileImage,
  File,
  ArrowSquareOut,
  Link,
} from "@phosphor-icons/react";

const KID_CARD_STYLE: Record<string, string> = {
  bronson: "dh-card-teal",
  kaia: "dh-card-coral",
};

/** Normalise an attachment entry to a consistent object shape regardless of input format. */
function normaliseAttachment(att: any): {
  filename: string;
  type: string;
  url?: string;
  description?: string;
  extractedContent?: string;
} {
  if (typeof att === "string") {
    // Plain string schema: just a filename
    return { filename: att, type: guessTypeFromFilename(att) };
  }
  return {
    filename: att.filename || att.name || "Attachment",
    type: att.type || guessTypeFromFilename(att.filename || ""),
    url: att.url || att.link || att.href,
    description: att.description,
    extractedContent: att.extractedContent,
  };
}

/** Guess a MIME-like type string from a filename extension. */
function guessTypeFromFilename(filename: string): string {
  const ext = (filename || "").split(".").pop()?.toLowerCase() || "";
  switch (ext) {
    case "pdf":  return "application/pdf";
    case "pptx":
    case "ppt":  return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "docx":
    case "doc":  return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "xlsx":
    case "xls":  return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "png":  return "image/png";
    case "gif":  return "image/gif";
    default:     return "application/octet-stream";
  }
}

/** Returns a human-readable file extension label from a MIME type string. */
function mimeToLabel(type: string): string {
  const t = type || "";
  if (t.includes("pdf")) return "PDF";
  if (t.includes("presentation") || t.includes("pptx")) return "PPTX";
  if (t.includes("spreadsheet") || t.includes("xlsx")) return "XLSX";
  if (t.includes("document") || t.includes("docx")) return "DOCX";
  if (t.includes("image/jpeg") || t.includes("image/jpg")) return "JPG";
  if (t.includes("image/png")) return "PNG";
  if (t.includes("image")) return "IMG";
  const parts = t.split("/");
  return (parts[1] || parts[0] || "FILE").toUpperCase().slice(0, 6);
}

function AttachmentIcon({ type, isUrl }: { type: string; isUrl: boolean }) {
  const props = { size: 15, weight: "duotone" as const, className: "shrink-0" };
  if (isUrl) return <Link {...props} />;
  const t = type || "";
  if (t.includes("pdf")) return <FilePdf {...props} />;
  if (t.includes("image")) return <FileImage {...props} />;
  if (t.includes("presentation") || t.includes("pptx")) return <FileDoc {...props} />;
  if (t.includes("doc")) return <FileDoc {...props} />;
  return <File {...props} />;
}

/**
 * Builds a Gmail search URL to find the email by sender + subject.
 * Falls back to a generic Gmail inbox link if no email/subject is available.
 */
function buildGmailSearchUrl(teacherEmail?: string, subject?: string): string {
  const parts: string[] = [];
  if (teacherEmail) parts.push(`from:${teacherEmail}`);
  if (subject) parts.push(`subject:"${subject}"`);
  if (!parts.length) return "https://mail.google.com/mail/u/0/#inbox";
  const query = encodeURIComponent(parts.join(" "));
  return `https://mail.google.com/mail/u/0/#search/${query}`;
}

interface AttachmentChipProps {
  att: ReturnType<typeof normaliseAttachment>;
  teacherEmail?: string;
  subject?: string;
  /** Prevent the chip click from bubbling up to the card expand toggle */
  stopPropagation: (e: React.MouseEvent | React.TouchEvent) => void;
}

function AttachmentChip({ att, teacherEmail, subject, stopPropagation }: AttachmentChipProps) {
  const isUrl = Boolean(att.url);

  // Determine the href: direct URL if available, else Gmail search
  const gmailUrl = buildGmailSearchUrl(teacherEmail, subject);
  const href = att.url || gmailUrl;
  const hasLink = Boolean(href);

  const label = mimeToLabel(att.type);
  const filename = att.filename || (isUrl ? "Open Link" : "Attachment");

  const chipBase =
    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 min-h-[36px] select-none";
  const chipInteractive =
    "bg-black/10 hover:bg-black/20 active:scale-95 cursor-pointer";
  const chipStatic =
    "bg-black/5 opacity-60 cursor-default";

  const inner = (
    <>
      <AttachmentIcon type={att.type} isUrl={isUrl} />
      <span className="truncate max-w-[180px]">{filename}</span>
      {!isUrl && (
        <span className="shrink-0 text-[10px] font-bold opacity-50 uppercase">{label}</span>
      )}
      {hasLink && (
        <ArrowSquareOut size={12} weight="bold" className="shrink-0 opacity-50 ml-0.5" />
      )}
    </>
  );

  if (hasLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${chipBase} ${chipInteractive}`}
        onClick={stopPropagation}
        onTouchEnd={stopPropagation}
        title={isUrl ? `Open ${filename}` : `Find this email in Gmail`}
        aria-label={isUrl ? `Open ${filename} in new tab` : `Find email "${subject}" in Gmail`}
      >
        {inner}
      </a>
    );
  }

  return (
    <span className={`${chipBase} ${chipStatic}`} title={filename}>
      {inner}
    </span>
  );
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
  // Normalise all attachments regardless of whether they're strings or objects
  const rawAttachments: any[] = msg.attachments || [];
  const attachments = rawAttachments.map(normaliseAttachment);
  const hasAttachments = attachments.length > 0;
  const hasFullBody = msg.fullBody && msg.fullBody.length > 0;

  const formattedDate = msg.date
    ? new Date(msg.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Recent";

  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

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
          <span className="text-xs opacity-60 whitespace-nowrap">{formattedDate}</span>
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
      <p className="text-sm leading-relaxed opacity-70 line-clamp-2">
        {msg.summary || "No preview available"}
      </p>

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

              {/* Attachments — shown before full body for quick access */}
              {hasAttachments && (
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
                    Attachments ({attachments.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((att, aIdx) => (
                      <div key={aIdx} className="flex flex-col gap-1">
                        <AttachmentChip
                          att={att}
                          teacherEmail={teacherEmail}
                          subject={msg.subject}
                          stopPropagation={stopPropagation}
                        />
                        {att.description && (
                          <p className="text-[11px] opacity-50 px-1 max-w-[220px] leading-snug">
                            {att.description}
                          </p>
                        )}
                        {att.extractedContent && (
                          <details
                            className="mt-0.5"
                            onClick={stopPropagation}
                          >
                            <summary className="text-xs font-semibold opacity-60 cursor-pointer hover:opacity-80 transition-opacity px-1">
                              View extracted content
                            </summary>
                            <div className="mt-2 text-xs leading-relaxed opacity-70 whitespace-pre-wrap break-words bg-black/5 dark:bg-white/5 rounded-lg p-2.5 max-h-[300px] overflow-y-auto">
                              {att.extractedContent}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full email body */}
              {hasFullBody && (
                <div className="mb-3">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2">
                    Full Email
                  </p>
                  <div className="text-sm leading-relaxed opacity-80 whitespace-pre-wrap break-words bg-black/5 dark:bg-white/5 rounded-lg p-3 max-h-[400px] overflow-y-auto">
                    {msg.fullBody}
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
  const comms = (week as any).teacherComms || [];
  if (!comms.length) return null;

  let animIdx = 0;

  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <Chalkboard size={22} weight="duotone" className="text-dh-teal" />
        <h2 className="font-display text-xl text-foreground tracking-tight">Teacher Updates</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Full emails from the family inbox — tap to expand
      </p>

      <div className="space-y-3">
        {comms.map((comm: any, cIdx: number) => {
          const kid = kids.find((k: any) => k.id === comm.kidId);
          const cardStyle = comm.kidId
            ? KID_CARD_STYLE[comm.kidId] || "dh-card-sage"
            : "dh-card-sage";

          const messages: any[] = comm.messages || [];

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
