/**
 * TeacherComms — Matches the Dayhaven Communications mockup exactly:
 * "School Communications" heading, stacked color-blocked cards per teacher.
 * Each card has solid fill (sage, teal, coral), bold name, subject, summary.
 * No borders, no shadows.
 */
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";

const COMM_COLORS = ["dh-card-sage", "dh-card-teal", "dh-card-coral", "dh-card-amber", "dh-card-pink"];

export default function TeacherComms() {
  const { week, kids } = useWeek();
  const comms = week.teacherComms;
  if (!comms.length) return null;

  let colorIdx = 0;

  return (
    <section>
      <h2 className="font-display text-2xl text-foreground tracking-tight mb-1">
        School Communications
      </h2>
      <p className="text-sm text-muted-foreground mb-5">Inside the family inbox</p>

      <div className="space-y-3">
        {comms.map((comm, cIdx) => {
          const kid = kids.find((k) => k.id === comm.kidId);
          return comm.messages.map((msg, mIdx) => {
            const style = COMM_COLORS[colorIdx % COMM_COLORS.length];
            colorIdx++;
            return (
              <motion.div
                key={`${cIdx}-${mIdx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ type: "spring", stiffness: 260, damping: 24, delay: colorIdx * 0.06 }}
                whileHover={{ y: -2 }}
                className={`dh-card ${style}`}
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
