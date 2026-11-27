"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  FileText,
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";

interface LearnerSkill {
  id: string;
  skill_name: string;
  category: string;
  proficiency: string;
  provenance: string;
  evidence_note: string;
}

interface GapResult {
  targetRole: string;
  sector: string;
  coveragePercent: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  gapReasons: Array<{ skill: string; whyItMatters: string; priority: string }>;
  roadmap: Array<{ step: string; duration: string; focusSkills: string[]; outcome: string }>;
  aiPowered: boolean;
}

const TARGET_ROLES = [
  "Full Stack Web Developer",
  "Data Analyst",
  "Cloud & DevOps Associate",
  "EV Battery & Diagnostics Technician",
  "Solar PV Technician",
];

export default function GapAnalysisPage() {
  const [skills, setSkills] = useState<LearnerSkill[]>([]);
  const [targetRole, setTargetRole] = useState("Full Stack Web Developer");
  const [location, setLocation] = useState("");
  const [headline, setHeadline] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newProficiency, setNewProficiency] = useState("intermediate");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [gapResult, setGapResult] = useState<GapResult | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    try {
      const res = await fetch("/api/learner/profile");
      if (!res.ok) return;
      const data = await res.json();
      if (data.profile) {
        setTargetRole(data.profile.target_role || "Full Stack Web Developer");
        setLocation(data.profile.location || "");
        setHeadline(data.profile.headline || "");
        setResumeText(data.profile.resume_text || "");
        setResumeFilename(data.profile.resume_filename || "");
      }
      if (Array.isArray(data.skills)) {
        setSkills(data.skills);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveProfileMeta = async () => {
    setError("");
    setMessage("");
    const res = await fetch("/api/learner/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target_role: targetRole, location, headline, resume_text: resumeText, resume_filename: resumeFilename }),
    });
    if (res.ok) {
      setMessage("Profile and target role saved.");
    } else {
      setError("Could not save profile.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setMessage("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", "resume_or_certificate");
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      setResumeFilename(data.originalName);
      if (data.extractedText) {
        setResumeText(data.extractedText);
        setMessage(`Uploaded "${data.originalName}" and extracted text. Click "Extract Skills with AI" below.`);
      } else {
        setMessage(`Uploaded "${data.originalName}". If it is a PDF or image certificate, paste key points below to extract skills.`);
      }
      await fetch("/api/learner/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_filename: data.originalName, resume_text: data.extractedText || resumeText }),
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setError("");
    const res = await fetch("/api/learner/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skillName: newSkill.trim(),
        proficiency: newProficiency,
        provenance: "self_declared",
        evidenceNote: "Added manually by learner",
      }),
    });
    if (res.ok) {
      setNewSkill("");
      await loadProfile();
    } else {
      setError("Unable to add skill.");
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const res = await fetch(`/api/learner/skills?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) {
      setSkills((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleExtractSkills = async () => {
    if (resumeText.trim().length < 10) {
      setError("Please upload a .txt/.md resume or paste at least 10 characters of resume/project text.");
      return;
    }
    setExtracting(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch("/api/ai/skill-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: resumeText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Skill extraction failed.");
        return;
      }

      const extracted = Array.isArray(data.skills) ? data.skills : [];
      if (extracted.length > 0) {
        await fetch("/api/learner/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: extracted.map((s: { name: string; category?: string }) => ({
              skillName: s.name,
              category: s.category || "hard_skill",
              proficiency: "intermediate",
              provenance: "ai_mapped",
              evidenceNote: `AI-mapped from ${resumeFilename || "resume/experience text"}`,
            })),
          }),
        });
        await loadProfile();
        setMessage(`Mapped ${extracted.length} skills (tagged as AI-Mapped — validate via practical work in Skill Portfolio).`);
      } else {
        setMessage("No distinct skills detected. Try adding more detail or entering skills manually.");
      }
    } finally {
      setExtracting(false);
    }
  };

  const handleRunGapAnalysis = async () => {
    setAnalyzing(true);
    setError("");
    try {
      await fetch("/api/learner/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target_role: targetRole, location, headline }),
      });
      const res = await fetch("/api/ai/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole, resumeText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gap analysis failed.");
        return;
      }
      setGapResult(data);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="text-blue-600" /> Skill Profile & AI Gap Analysis
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Build your profile, extract skills from resumes/projects, and see clear explanations of missing competencies.
          </p>
        </div>
        <Link
          href="/dashboard/portfolio"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Go to Practical Portfolio <ArrowRight size={15} />
        </Link>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>}
      {message && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-lg">{message}</div>}

      {/* Profile & Target Role */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Target Role & Learner Context</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Target Job Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g., Diploma CS Graduate"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Location / District</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Dharwad, Karnataka"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveProfileMeta}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Save Profile
          </button>
          <button
            type="button"
            onClick={handleRunGapAnalysis}
            disabled={analyzing}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-60"
          >
            {analyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Run Skill Gap Analysis
          </button>
        </div>
      </div>

      {/* Resume / Certificate Upload + AI Skill Extraction */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">2. Upload Resume / Certificate or Paste Experience</h2>
            {resumeFilename && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                <FileText size={13} /> {resumeFilename}
              </span>
            )}
          </div>

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg p-4 text-sm text-slate-600 hover:border-blue-400 cursor-pointer bg-slate-50">
            <Upload size={18} className="text-blue-600" />
            <span>{uploading ? "Uploading..." : "Upload Resume / Certificate (PDF, TXT, MD, PNG, JPG — max 5 MB)"}</span>
            <input type="file" accept=".pdf,.txt,.md,.png,.jpg,.jpeg,.webp" onChange={handleFileUpload} className="hidden" />
          </label>

          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume summary, coursework, or practical project description here..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              AI-extracted skills are tagged <strong>AI-Mapped</strong> and require trainer/employer validation for certification.
            </p>
            <button
              type="button"
              onClick={handleExtractSkills}
              disabled={extracting}
              className="shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
            >
              {extracting ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              Extract Skills with AI
            </button>
          </div>
        </div>

        {/* Current Skills Inventory */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">3. Your Skills & Validation Tier</h2>
          <form onSubmit={handleAddSkill} className="flex flex-wrap gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g., TypeScript, SQL, Docker)"
              className="flex-1 min-w-[180px] px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <select
              value={newProficiency}
              onChange={(e) => setNewProficiency(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-semibold"
            >
              <Plus size={16} /> Add
            </button>
          </form>

          {loadingProfile ? (
            <div className="text-sm text-slate-500 py-6 text-center">Loading your skills...</div>
          ) : skills.length === 0 ? (
            <div className="text-sm text-slate-500 py-6 text-center">No skills recorded yet.</div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {skills.map((sk) => (
                <div key={sk.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-900">{sk.skill_name}</div>
                    <div className="text-[11px] text-slate-500 capitalize">{sk.proficiency}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ProvenanceBadge provenance={sk.provenance} />
                    {(sk.provenance === "self_declared" || sk.provenance === "ai_mapped") && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(sk.id)}
                        title="Remove skill"
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gap Analysis Output */}
      {gapResult && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Gap Analysis for {gapResult.targetRole}
              </h2>
              <p className="text-sm text-slate-600 mt-1">{gapResult.summary}</p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-blue-600">{gapResult.coveragePercent}%</div>
              <div className="text-xs text-slate-500">
                Benchmark Coverage {gapResult.aiPowered ? "• Gemini AI" : "• Curated Rules"}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Existing Competencies ({gapResult.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {gapResult.matchedSkills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {s}
                  </span>
                ))}
                {gapResult.matchedSkills.length === 0 && (
                  <span className="text-xs text-slate-500">No benchmark skills matched yet.</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-1.5">
                <AlertTriangle size={16} /> Missing Industry-Required Skills ({gapResult.missingSkills.length})
              </h3>
              <div className="space-y-2.5">
                {gapResult.gapReasons.map((g) => (
                  <div key={g.skill} className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-900">{g.skill}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {g.priority} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{g.whyItMatters}</p>
                  </div>
                ))}
                {gapResult.gapReasons.length === 0 && (
                  <span className="text-xs text-emerald-700">All benchmark skills covered! Focus on practical validation.</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recommended Learning Roadmap</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {gapResult.roadmap.map((step, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-semibold text-blue-700">{step.duration}</div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">{step.step}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {step.focusSkills.map((fs) => (
                      <span key={fs} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {fs}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-2.5">
                    <strong>Deliverable:</strong> {step.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
