/**
 * KidProfiles — Compact profile badges for each child.
 * Teal for Bronson, coral for Kaia.
 */
import { User } from "lucide-react";
import data from "@/data/weeklyReport.json";

export default function KidProfiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {data.kids.map((kid) => (
        <div
          key={kid.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 flex items-center gap-3 transition-all hover:shadow-md"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: kid.color }}
          >
            {kid.avatar}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground text-base truncate">{kid.name}</h3>
            <p className="text-muted-foreground text-xs">{kid.grade}</p>
            <p className="text-muted-foreground text-xs truncate">{kid.teacher}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
