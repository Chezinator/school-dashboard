/**
 * TeacherComms — Dayhaven app aesthetic
 * Color-blocked rounded cards, teal accent, staggered entrance animations.
 */
import { MessageSquare, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useWeek } from "@/contexts/WeekContext";
import AnimatedCard from "./AnimatedCard";

export default function TeacherComms() {
  const { week, kids } = useWeek();
  const comms = week.teacherComms;
  if (!comms.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-teal-light dark:bg-teal/15 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-teal" />
        </div>
        <h2 className="font-display text-xl text-foreground tracking-tight">Teacher Notes</h2>
      </div>

      <div className="space-y-3">
        {comms.map((comm, idx) => {
          const kid = kids.find((k) => k.id === comm.kidId);
          return (
            <AnimatedCard key={comm.kidId} delay={idx}>
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-card rounded-2xl border border-border/40 overflow-hidden"
              >
                {/* Teacher header */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20 bg-teal/5 dark:bg-teal/8">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
                    style={{ backgroundColor: kid?.color || "#888" }}
                  >
                    {kid?.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">{comm.teacher}</p>
                    <p className="text-xs text-muted-foreground">{kid?.name}'s Teacher · {kid?.grade}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-2.5">
                  {comm.messages.map((msg, mIdx) => (
                    <div key={mIdx} className="card-teal rounded-xl p-3.5 bg-muted/30 dark:bg-muted/15">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal" />
                        <span className="text-xs font-semibold text-teal">{msg.subject}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{msg.summary}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(msg.date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatedCard>
          );
        })}
      </div>
    </section>
  );
}
