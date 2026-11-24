"use client";

import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  status: "COMPLETED" | "CURRENT" | "PENDING";
  description?: string;
}

interface OutcomeTimelineProps {
  events: TimelineEvent[];
}

export function OutcomeTimeline({ events }: OutcomeTimelineProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6">Candidate Journey</h3>
      
      <div className="relative space-y-0">
        <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-100"></div>
        
        {events.map((event, index) => {
          const isCompleted = event.status === "COMPLETED";
          const isCurrent = event.status === "CURRENT";
          const isPending = event.status === "PENDING";
          
          return (
            <div key={event.id} className="relative flex gap-4 pb-8 last:pb-0 group">
              <div className="relative z-10 shrink-0 mt-1">
                {isCompleted && (
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border-2 border-white shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>
                )}
                {isCurrent && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm ring-4 ring-indigo-50">
                    <Clock size={18} />
                  </div>
                )}
                {isPending && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 border-2 border-white shadow-sm">
                    <Circle size={14} className="fill-current" />
                  </div>
                )}
              </div>
              
              <div className={cn("flex-1 pt-1.5", isPending && "opacity-50")}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className={cn("font-semibold", isCurrent ? "text-indigo-900" : "text-slate-900")}>
                    {event.title}
                  </h4>
                  <span className="text-xs font-medium text-slate-500">{event.date}</span>
                </div>
                {event.description && (
                  <p className="text-sm text-slate-600">{event.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
