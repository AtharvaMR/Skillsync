"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, Plus, CheckCircle2, Clock } from "lucide-react";

interface KaizenCycle {
  id: string;
  title: string;
  phase: "plan" | "do" | "check" | "act";
  category: string;
  status: string;
  evidence: string;
  impact_metric: string;
  created_at: string;
}

const PHASE_INFO = {
  plan: { label: "Plan", desc: "Identify skill & curriculum gaps from industry reality", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  do: { label: "Do", desc: "Implement course, trainer, or lab improvements", badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  check: { label: "Check", desc: "Evaluate competencies, assessments & placements", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  act: { label: "Act", desc: "Standardize & refine learning pathways", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default function KaizenLoopPage() {
  const [cycles, setCycles] = useState<KaizenCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState<"plan" | "do" | "check" | "act">("plan");
  const [category, setCategory] = useState("Curriculum");
  const [evidence, setEvidence] = useState("");
  const [impactMetric, setImpactMetric] = useState("");
  const [error, setError] = useState("");

  const loadCycles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kaizen");
      if (res.ok) {
        const data = await res.json();
        setCycles(data.cycles || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/kaizen")
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data) setCycles(data.cycles || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/kaizen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, phase, category, evidence, impactMetric }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not add Kaizen cycle item.");
      return;
    }
    setTitle("");
    setEvidence("");
    setImpactMetric("");
    setShowAdd(false);
    await loadCycles();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="text-blue-600" /> Digital Kaizen Loop (PDCA)
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Genchi Genbutsu → Plan → Do → Check → Act continuous improvement based on real industry & outcome evidence.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={16} /> Log Kaizen Action
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base">New PDCA Intervention</h2>
          {error && <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200">{error}</div>}
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Intervention title"
              className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
            <select value={phase} onChange={(e) => setPhase(e.target.value as KaizenCycle["phase"])} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
              <option value="plan">Plan (Identify Gap)</option>
              <option value="do">Do (Implement)</option>
              <option value="check">Check (Evaluate)</option>
              <option value="act">Act (Standardize)</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (Curriculum, Assessment, Outcomes)"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={impactMetric}
              onChange={(e) => setImpactMetric(e.target.value)}
              placeholder="Measured or target impact"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <textarea
            rows={2}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            placeholder="Observed evidence (employer feedback, job postings, placement data)..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            required
          />
          <button type="submit" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
            Save PDCA Item
          </button>
        </form>
      )}

      {/* PDCA Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(["plan", "do", "check", "act"] as const).map((p) => (
          <div key={p} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${PHASE_INFO[p].badge}`}>
              {PHASE_INFO[p].label}
            </span>
            <p className="text-xs text-slate-600 mt-2">{PHASE_INFO[p].desc}</p>
            <div className="text-xl font-bold text-slate-900 mt-2">
              {cycles.filter((c) => c.phase === p).length} items
            </div>
          </div>
        ))}
      </div>

      {/* Cycles List */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-base">Active & Completed PDCA Cycles</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading Kaizen cycles...</p>
        ) : (
          <div className="space-y-3">
            {cycles.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${PHASE_INFO[c.phase]?.badge || "bg-slate-100"}`}>
                      {PHASE_INFO[c.phase]?.label || c.phase}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{c.category}</span>
                    <h3 className="font-bold text-sm text-slate-900">{c.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600"><strong>Evidence:</strong> {c.evidence}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {c.phase === "act" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                    {c.impact_metric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
