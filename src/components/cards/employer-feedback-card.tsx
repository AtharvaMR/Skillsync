import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployerFeedbackCardProps {
  employerName: string;
  rating: number; // 1-5
  feedbackType: "INTERVIEW_READINESS" | "TECHNICAL_SKILLS" | "SOFT_SKILLS" | "RETENTION";
  comments: string;
  createdAt: string;
}

export function EmployerFeedbackCard({ employerName, rating, feedbackType, comments, createdAt }: EmployerFeedbackCardProps) {
  const date = new Date(createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const typeLabels = {
    INTERVIEW_READINESS: "Interview Readiness",
    TECHNICAL_SKILLS: "Technical Skills",
    SOFT_SKILLS: "Soft Skills",
    RETENTION: "Retention & Performance"
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-slate-900">{employerName}</h4>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
            {typeLabels[feedbackType]}
          </span>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              size={14} 
              className={cn(
                "fill-current", 
                star <= rating ? "text-amber-400" : "text-slate-200"
              )} 
            />
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 mt-4 text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <MessageSquare size={16} className="text-slate-400 shrink-0 mt-0.5" />
        <p className="text-sm italic">&ldquo;{comments}&rdquo;</p>
      </div>

      <div className="mt-4 text-right">
        <span className="text-xs text-slate-400">Received {date}</span>
      </div>
    </div>
  );
}
