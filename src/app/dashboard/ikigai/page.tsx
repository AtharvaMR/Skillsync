"use client";

import React, { useEffect, useState } from "react";
import { Compass, Sparkles, Loader2, Info, Check } from "lucide-react";

interface PathwayStep {
  stepName: string;
  description: string;
  skillsToAcquire: string[];
  estimatedDuration: string;
}

export default function IkigaiDiscoveryPage() {
  const [interests, setInterests] = useState("");
  const [strengths, setStrengths] = useState("");
  const [societalNeeds, setSocietalNeeds] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [targetRole, setTargetRole] = useState("Full Stack Web Developer");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [loadingPathway, setLoadingPathway] = useState(false);
  const [pathway, setPathway] = useState<PathwayStep[]>([]);

  useEffect(() => {
    fetch("/api/learner/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.profile) {
          setInterests(data.profile.interests || "");
          setStrengths(data.profile.strengths || "");
          setSocietalNeeds(data.profile.societal_needs || "");
          setCareerGoals(data.profile.career_goals || "");
          setTargetRole(data.profile.target_role || "Full Stack Web Developer");
        }
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      const res = await fetch("/api/learner/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests,
          strengths,
          societal_needs: societalNeeds,
          career_goals: careerGoals,
          target_role: targetRole,
        }),
      });
      if (res.ok) setSavedMsg("Reflections saved to your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleExplorePathway = async () => {
    setLoadingPathway(true);
    try {
      await handleSave();
      const res = await fetch("/api/ai/career-pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: strengths.split(",").map((s) => s.trim()).filter(Boolean),
          targetRole,
          experience: "Learner exploration",
        }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.pathway)) {
        setPathway(data.pathway);
      }
    } finally {
      setLoadingPathway(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="text-indigo-600" /> Ikigai-Inspired Career Discovery
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore where your interests, strengths, community needs, and job opportunities intersect.
        </p>
      </div>

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
        <Info size={16} className="shrink-0 mt-0.5 text-blue-600" />
        <span>
          <strong>Guidance Aid Only:</strong> Ikigai discovery helps you reflect on meaningful directions. You remain in control—SkillSync never locks or auto-decides your career path.
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-1">1. What You Enjoy (Interests)</label>
          <p className="text-xs text-slate-500 mb-2">Topics, tools, or activities you want to spend time building.</p>
          <textarea
            rows={3}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="e.g., Building mobile-friendly web tools, renewable energy hardware, data storytelling"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-1">2. What You Are Good At (Strengths)</label>
          <p className="text-xs text-slate-500 mb-2">Existing technical, practical, or communication strengths.</p>
          <textarea
            rows={3}
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="e.g., JavaScript, React, troubleshooting electronics, teamwork"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-1">3. What Communities Need (Societal Needs)</label>
          <p className="text-xs text-slate-500 mb-2">Problems in your district or sector you want to help solve.</p>
          <textarea
            rows={3}
            value={societalNeeds}
            onChange={(e) => setSocietalNeeds(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="e.g., Affordable digital tools for local shops, clean energy maintenance, rural healthcare access"
          />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <label className="block text-sm font-bold text-slate-900 mb-1">4. Career Opportunities You Want to Explore</label>
          <p className="text-xs text-slate-500 mb-2">Roles or livelihoods that match sustainable demand.</p>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm mb-2"
            placeholder="Target Role"
          />
          <textarea
            rows={2}
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="e.g., Secure a junior role or apprenticeship within 90 days"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700"
        >
          <Check size={16} /> {saving ? "Saving..." : "Save Reflections"}
        </button>
        <button
          type="button"
          onClick={handleExplorePathway}
          disabled={loadingPathway}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-60"
        >
          {loadingPathway ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Explore Suggested Pathway Ideas
        </button>
        {savedMsg && <span className="text-xs font-medium text-emerald-700">{savedMsg}</span>}
      </div>

      {pathway.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Exploratory Learning Pathway for {targetRole}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {pathway.map((p, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-indigo-700">{p.estimatedDuration}</div>
                <h3 className="font-bold text-sm text-slate-900 mt-1">{p.stepName}</h3>
                <p className="text-xs text-slate-600 mt-1.5">{p.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.skillsToAcquire?.map((sk) => (
                    <span key={sk} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
