import React from "react";
import { AlertTriangle } from "lucide-react";

export function DemoBanner() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    return null;
  }

  return (
    <div className="bg-amber-100 border-b border-amber-200 px-4 py-1.5 flex items-center justify-center gap-2 text-amber-800 text-xs font-medium z-50">
      <AlertTriangle size={14} className="text-amber-600" />
      <span>Demo Environment — Data is simulated for demonstration purposes.</span>
    </div>
  );
}
