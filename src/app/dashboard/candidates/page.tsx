"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Search, MapPin, ExternalLink } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";

interface CandidateItem {
  id: string;
  displayId: string;
  name: string;
  headline: string;
  location: string;
  targetRole: string;
  portfolioPublic: boolean;
  skills: Array<{ skill_name: string; provenance: string }>;
  verifiedCount: number;
  validatedProjects: number;
  totalProjects: number;
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCandidates = async (q = search) => {
    setLoading(true);
    try {
      const params = q.trim() ? `?search=${encodeURIComponent(q.trim())}` : "";
      const res = await fetch(`/api/candidates${params}`);
      if (res.ok) {
        const data = await res.json();
        setCandidates(data.candidates || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/candidates")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) setCandidates(data.candidates || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-blue-600" /> Competency-Based Talent Discovery
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Discover learners by verified skills and practical portfolio evidence while respecting privacy controls.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadCandidates(search)}
              placeholder="Filter by skill, role, or city..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            />
          </div>
          <button
            type="button"
            onClick={() => loadCandidates(search)}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
          >
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          Loading learner profiles...
        </div>
      ) : candidates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          No learners match your filter.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {candidates.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{c.name}</h2>
                  <p className="text-xs text-slate-600">{c.headline}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {c.location}</span>
                    <span>Target: <strong className="text-slate-700">{c.targetRole}</strong></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-emerald-700">{c.verifiedCount} Verified</div>
                  <div className="text-[11px] text-slate-500">{c.validatedProjects}/{c.totalProjects} projects validated</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {c.skills.slice(0, 6).map((s, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-medium text-slate-800">{s.skill_name}</span>
                    <ProvenanceBadge provenance={s.provenance} />
                  </span>
                ))}
              </div>

              {c.portfolioPublic && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/portfolio/${c.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Verified Skill Portfolio <ExternalLink size={13} />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
