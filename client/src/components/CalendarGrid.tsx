import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { useWeek } from "@/contexts/WeekContext";

interface CalendarGridProps {
  onDateClick?: (date: Date) => void;
}

export default function CalendarGrid({ onDateClick }: CalendarGridProps) {
  const { week } = useWeek();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Helper to get events for a specific day
  const getEventsForDay = (day: Date) => {
    if (!week?.importantDates) return [];
    const dateStr = format(day, "yyyy-MM-dd");
    return week.importantDates.filter((event: any) => event.date === dateStr);
  };

  const categories = [
    { label: "Assessment", color: "bg-[#E8725A]" }, // Coral
    { label: "Event", color: "bg-[#EBA856]" },      // Amber
    { label: "School", color: "bg-[#5BA4A4]" },     // Teal
    { label: "Holiday", color: "bg-[#7AA2E3]" },    // Blue
    { label: "Homework", color: "bg-[#F5B7B1]" },   // Pink
  ];

  return (
    <div className="bg-[#F9F6F0] rounded-3xl p-6 shadow-sm border border-border/50">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={prevMonth}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-display text-xl text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button 
          onClick={nextMonth}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 mb-2">
        {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
          <div key={day} className="text-center text-[10px] font-bold text-muted-foreground/60 tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-4">
        {calendarDays.map((day, idx) => {
          const events = getEventsForDay(day);
          const isToday = isSameDay(day, new Date(2026, 4, 20)); // Mocking today as May 20
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div 
              key={idx} 
              className="flex flex-col items-center gap-1"
              onClick={() => onDateClick?.(day)}
            >
              <div className={`
                w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full transition-colors
                ${isToday ? "bg-[#E8725A] text-white" : ""}
                ${!isCurrentMonth ? "text-muted-foreground/30" : "text-foreground"}
                ${!isToday && isCurrentMonth ? "hover:bg-black/5" : ""}
              `}>
                {format(day, "d")}
              </div>
              
              {/* Event Indicators */}
              <div className="flex gap-1 h-1">
                {events.slice(0, 3).map((event: any, i: number) => {
                  let color = "bg-gray-300";
                  if (event.type === "test") color = "bg-[#E8725A]";
                  if (event.type === "event") color = "bg-[#EBA856]";
                  if (event.type === "school") color = "bg-[#5BA4A4]";
                  if (event.type === "holiday") color = "bg-[#7AA2E3]";
                  
                  return (
                    <div key={i} className={`w-1 h-1 rounded-full ${color}`} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-4">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            <span className="text-xs text-muted-foreground font-medium">{cat.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#E8725A] flex items-center justify-center text-[10px] text-white font-bold">T</div>
          <span className="text-xs text-muted-foreground font-medium">Today</span>
        </div>
      </div>
    </div>
  );
}
