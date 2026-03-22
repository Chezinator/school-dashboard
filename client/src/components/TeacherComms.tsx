/**
 * TeacherComms — Color-coded per kid (Bronson=teal, Kaia=coral).
 * Phosphor icon in section title. Solid color-blocked cards.
 */
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import { Chalkboard } from "@phosphor-icons/react";

const KID_CARD_STYLE: Record<string, string> = {
  bronson: "dh-card-teal",
  kaia: "dh-card-coral",
};

export default function TeacherComms() {
  const { week, kids } = useWeek();
  const comms = week.teacherComms;
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
      <p className="text-sm text-muted-foreground mb-5">Inside the family inbox</p>

      <div className="space-y-3">
        {comms.map((comm, cIdx) => {
          const kid = kids.find((k) => k.id === comm.kidId);
          const cardStyle = comm.kidId ? (KID_CARD_STYLE[comm.kidId] || "dh-card-sage") : "dh-card-sage";

          return comm.messages.map((msg, mIdx) => {
            animIdx++;
            return (
              <motion.div
                key={`${cIdx}-${mIdx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: animIdx * 0.06 }}
                whileHover={{ y: -2 }}
                className={`dh-card ${cardStyle}`}
              >
                <p className="font-display text-base font-bold leading-tight">{comm.teacher}</p>
                <p className="text-sm font-semibold opacity-80 italic mb-2">{msg.subject}</p>
                <p className="text-sm leading-relaxed opacity-80">{msg.summary}</p>
                <div className="flex items-center gap-2 mt-3">
                  {kid && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: kid.color }}
                    >
                      {kid.name}
                    </span>
                  )}
                  <span className="text-xs opacity-60">
                    {new Date(msg.date + "T00:00:00").toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            );
          });
        })}
      </div>
    </section>
  );
}
