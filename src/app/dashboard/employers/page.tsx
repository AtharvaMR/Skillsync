"use client";

import React, { useEffect, useState } from "react";
import { Building2, Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";

interface FeedbackRow {
  id: string;
  employer_name: string;
  skill_name?: string | null;
  feedback_type: string;
  rating: number;
  comments: string;
  created_at: string;
}

export default function EmployersPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [skillName, setSkillName] = useState("");
  const [feedbackType, setFeedbackType] = useState("skill_gap");
  const [rating, setRating] = useState(4);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadFeedback = async () => {
    const res = await fetch("/api/feedback");
    if (res.ok) {
      const data = await res.json();
      setFeedbacks(Array.isArray(data) ? data : []);
    }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/feedback")
      .then(async (res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setFeedbacks(Array.isArray(data) ? data : []);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName, feedbackType, rating, comments }),
      });
      if (res.ok) {
        setSkillName("");
        setComments("");
        setSaved(true);
        await loadFeedback();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="text-amber-600" /> Employer Intelligence & Validation Loop
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Capture real employer feedback on graduate readiness and emerging skill gaps to drive Digital Kaizen updates.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 h-fit">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MessageSquarePlus size={18} className="text-blue-600" /> Submit Industry Feedback
          </h2>

          {saved && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Feedback recorded in SkillSync Kaizen loop.
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Feedback Focus</label>
            <select
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="skill_gap">Missing / Emerging Skill Gap</option>
              <option value="curriculum">Curriculum Relevance</option>
              <option value="candidate">Candidate Readiness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Related Skill (optional)</label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g., TypeScript, BMS Diagnostics"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Readiness Rating (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Observations & Recommendations</label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share practical gaps observed in interviews or onboarding..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Recent Employer Feedback ({feedbacks.length})</h2>
          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-slate-900">{fb.employer_name}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <Star size={12} /> {fb.rating}/5
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="uppercase font-semibold">{fb.feedback_type.replace("_", " ")}</span>
                  {fb.skill_name && <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">{fb.skill_name}</span>}
                </div>
                <p className="text-sm text-slate-700">{fb.comments}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
