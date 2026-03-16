/**
 * TeacherComms — Teacher communication highlights per kid.
 * Teal accent for informational content.
 */
import { MessageSquare, Mail } from "lucide-react";
import { useWeek } from "@/contexts/WeekContext";

export default function TeacherComms() {
  const { week, kids } = useWeek();
  const comms = week.teacherComms;
  if (!comms.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-teal" />
        </div>
        <h2 className="font-display text-xl text-foreground">Teacher Communications</h2>
      </div>

      <div className="space-y-4">
        {comms.map((comm) => {
          const kid = kids.find((k) => k.id === comm.kidId);
          return (
            <div
              key={comm.kidId}
              className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden"
            >
              {/* Teacher header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-gradient-to-r from-teal-50/50 to-transparent">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
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
              <div className="p-4 space-y-3">
                {comm.messages.map((msg, idx) => (
                  <div key={idx} className="card-info rounded-lg p-3 bg-gray-50/50">
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
