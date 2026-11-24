import React from "react";
import { cn } from "@/lib/utils";
import { Check, X, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import type { Recommendation } from "@/types";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RecommendationCard({ recommendation, onApprove, onReject }: RecommendationCardProps) {
  const priorityStyles: Record<string, string> = {
    critical: "bg-rose-100 text-rose-800 border-rose-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  };

  const confidenceStyles: Record<string, string> = {
    high: "text-emerald-600 bg-emerald-50",
    medium: "text-amber-600 bg-amber-50",
    low: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2 items-center">
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", priorityStyles[recommendation.priority])}>
              {recommendation.priority} PRIORITY
            </span>
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1", confidenceStyles[recommendation.confidence])}>
              Confidence: {Math.round(recommendation.confidenceScore * 100)}%
            </span>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">
            {recommendation.validationStatus}
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">{recommendation.title}</h3>
        <p className="text-sm text-slate-600">{recommendation.recommendation}</p>
      </div>

      <div className="p-5 bg-slate-50">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1">
          <FileText size={14} /> Supporting Evidence
        </h4>
        <ul className="space-y-2 mb-4">
          {recommendation.evidence.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {recommendation.validationStatus === "pending" && (
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => onApprove?.(recommendation.id)}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <Check size={16} /> Approve
            </button>
            <button
              onClick={() => onReject?.(recommendation.id)}
              className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <X size={16} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
