"use client";

import React from "react";
import { Sparkles, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type SkillProvenance =
  | "self_declared"
  | "ai_mapped"
  | "assessor_validated"
  | "employer_verified";

const CONFIG: Record<
  SkillProvenance,
  { label: string; style: string; icon: React.ComponentType<{ size?: number }>; title: string }
> = {
  self_declared: {
    label: "Self-Declared",
    style: "bg-slate-100 text-slate-700 border-slate-200",
    icon: UserCheck,
    title: "Added directly by the learner",
  },
  ai_mapped: {
    label: "AI-Mapped",
    style: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Sparkles,
    title: "Mapped by AI from resume or project text (not independently certified)",
  },
  assessor_validated: {
    label: "Assessor-Validated",
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
    title: "Verified by an authorized trainer or institutional assessor",
  },
  employer_verified: {
    label: "Employer-Verified",
    style: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: ShieldCheck,
    title: "Verified by an employer through practical review or placement",
  },
};

export function ProvenanceBadge({
  provenance,
  className,
}: {
  provenance: string;
  className?: string;
}) {
  const key = (provenance in CONFIG ? provenance : "self_declared") as SkillProvenance;
  const item = CONFIG[key];
  const Icon = item.icon;

  return (
    <span
      title={item.title}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border",
        item.style,
        className
      )}
    >
      <Icon size={12} />
      {item.label}
    </span>
  );
}
