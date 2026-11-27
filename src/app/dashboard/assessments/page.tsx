"use client";

import React, { useEffect, useState } from "react";
import { ClipboardCheck, CheckCircle2, AlertCircle, FileText, ExternalLink, MapPin } from "lucide-react";

interface SubmissionRow {
  id: string;
  user_id: string;
  title: string;
  description: string;
  role_in_project: string;
  skills_json: string;
  demo_url: string;
  attachment_path?: string | null;
  attachment_name?: string | null;
  status: string;
  learner_name: string;
  learner_location?: string;
  learner_target_role?: string;
  created_at: string;
}

export default function AssessmentsQueuePage() {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<Record<string, string[]>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/assessments");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to load validation queue.");
        return;
      }
      const rows: SubmissionRow[] = data.submissions || [];
      setSubmissions(rows);
      const initSkills: Record<string, string[]> = {};
      const initScores: Record<string, number> = {};
      for (const r of rows) {
        initSkills[r.id] = JSON.parse(r.skills_json || "[]");
        initScores[r.id] = 85;
      }
      setSelectedSkills(initSkills);
      setScores(initScores);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/assessments")
      .then(async (res) => ({ ok: res.ok, data: await res.json() }))
      .then(({ ok, data }) => {
        if (!active) return;
        if (!ok) {
          setError(data.error || "Unable to load validation queue.");
          return;
        }
        const rows: SubmissionRow[] = data.submissions || [];
        setSubmissions(rows);
        const initSkills: Record<string, string[]> = {};
        const initScores: Record<string, number> = {};
        for (const r of rows) {
          initSkills[r.id] = JSON.parse(r.skills_json || "[]");
          initScores[r.id] = 85;
        }
        setSelectedSkills(initSkills);
        setScores(initScores);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleSkill = (projectId: string, skill: string) => {
    setSelectedSkills((prev) => {
      const current = prev[projectId] || [];
      return {
        ...prev,
        [projectId]: current.includes(skill)
          ? current.filter((s) => s !== skill)
          : [...current, skill],
      };
    });
  };

  const handleAssess = async (projectId: string, decision: "approved" | "needs_revision") => {
    const fb = (feedbacks[projectId] || "").trim();
    if (!fb) {
      setError("Please enter structured assessment feedback before submitting.");
      return;
    }
    setSubmittingId(projectId);
    setError("");
    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          decision,
          rubricScore: scores[projectId] ?? 85,
          validatedSkills: selectedSkills[projectId] || [],
          feedback: fb,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Assessment failed.");
        return;
      }
      setFeedbacks((prev) => ({ ...prev, [projectId]: "" }));
      await loadQueue();
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ClipboardCheck className="text-blue-600" /> Competency Validation Queue
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Review practical learner projects and work samples to issue Assessor-Validated competency badges.
        </p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>}

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          Loading learner submissions...
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          No practical submissions found.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const mappedSkills = JSON.parse(sub.skills_json || "[]") as string[];
            const checked = selectedSkills[sub.id] || [];
            return (
              <div key={sub.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-slate-900">{sub.title}</h2>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          sub.status === "validated"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : sub.status === "needs_revision"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-700">Learner: {sub.learner_name}</span>
                      {sub.learner_location && (
                        <span className="inline-flex items-center gap-1"><MapPin size={12} /> {sub.learner_location}</span>
                      )}
                      {sub.learner_target_role && <span>Target: {sub.learner_target_role}</span>}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-700">{sub.description}</p>

                <div className="flex flex-wrap gap-3 text-xs">
                  {sub.demo_url && (
                    <a href={sub.demo_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      Open Demo / Repo <ExternalLink size={12} />
                    </a>
                  )}
                  {sub.attachment_path && (
                    <a href={sub.attachment_path} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline inline-flex items-center gap-1">
                      <FileText size={12} /> {sub.attachment_name || "View Attached Evidence"}
                    </a>
                  )}
                </div>

                {sub.status !== "validated" && (
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-700 mb-1.5">Select Competencies Verified in This Submission:</div>
                      <div className="flex flex-wrap gap-2">
                        {mappedSkills.map((sk) => (
                          <label key={sk} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked.includes(sk)}
                              onChange={() => toggleSkill(sub.id, sk)}
                            />
                            <span>{sk}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Rubric Score (0–100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={scores[sub.id] ?? 85}
                          onChange={(e) => setScores((p) => ({ ...p, [sub.id]: Number(e.target.value) }))}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Structured Assessor Feedback</label>
                        <input
                          type="text"
                          value={feedbacks[sub.id] || ""}
                          onChange={(e) => setFeedbacks((p) => ({ ...p, [sub.id]: e.target.value }))}
                          placeholder="Note practical strengths, code/work quality, and next improvement step..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={submittingId === sub.id}
                        onClick={() => handleAssess(sub.id, "approved")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold disabled:opacity-60"
                      >
                        <CheckCircle2 size={14} /> Approve & Validate Competencies
                      </button>
                      <button
                        type="button"
                        disabled={submittingId === sub.id}
                        onClick={() => handleAssess(sub.id, "needs_revision")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold disabled:opacity-60"
                      >
                        <AlertCircle size={14} /> Request Revision
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
