"use client";

import React, { useEffect, useState } from "react";
import {
  FolderCheck,
  Upload,
  Plus,
  ExternalLink,
  Share2,
  Check,
  Trash2,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";

interface ProjectItem {
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
  created_at: string;
}

interface AssessmentItem {
  id: string;
  project_id: string;
  assessor_name: string;
  assessor_role: string;
  decision: string;
  rubric_score: number;
  feedback: string;
  created_at: string;
}

interface SkillItem {
  id: string;
  skill_name: string;
  provenance: string;
  validated_by?: string | null;
}

export default function SkillPortfolioPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [copied, setCopied] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roleInProject, setRoleInProject] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [attachment, setAttachment] = useState<{ path: string; name: string; mime: string } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    const [meRes, portRes] = await Promise.all([fetch("/api/auth/me"), fetch("/api/portfolio")]);
    if (meRes.ok) {
      const me = await meRes.json();
      setUserId(me.user?.id || "");
    }
    if (portRes.ok) {
      const data = await portRes.json();
      setProjects(data.projects || []);
      setAssessments(data.assessments || []);
      setSkills(data.skills || []);
      setPortfolioPublic(Boolean(data.portfolioPublic));
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([fetch("/api/auth/me"), fetch("/api/portfolio")])
      .then(async ([meRes, portRes]) => ({
        me: meRes.ok ? await meRes.json() : null,
        port: portRes.ok ? await portRes.json() : null,
      }))
      .then(({ me, port }) => {
        if (!active) return;
        if (me) setUserId(me.user?.id || "");
        if (port) {
          setProjects(port.projects || []);
          setAssessments(port.assessments || []);
          setSkills(port.skills || []);
          setPortfolioPublic(Boolean(port.portfolioPublic));
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("purpose", "portfolio_evidence");
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed.");
        return;
      }
      setAttachment({ path: data.url, name: data.originalName, mime: data.mimeType });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const parsedSkills = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          roleInProject,
          skills: parsedSkills,
          demoUrl,
          attachmentPath: attachment?.path,
          attachmentName: attachment?.name,
          attachmentMime: attachment?.mime,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not submit project.");
        return;
      }
      setTitle("");
      setDescription("");
      setRoleInProject("");
      setSkillsText("");
      setDemoUrl("");
      setAttachment(null);
      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublic = async () => {
    const next = !portfolioPublic;
    setPortfolioPublic(next);
    await fetch("/api/learner/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ portfolio_public: next }),
    });
  };

  const handleCopyShareLink = () => {
    if (!userId) return;
    const url = `${window.location.origin}/portfolio/${userId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteProject = async (id: string) => {
    const res = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (res.ok) await loadData();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderCheck className="text-emerald-600" /> Evidence-Based Skill Portfolio
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Upload practical work samples, map them to competencies, and earn assessor validation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleTogglePublic}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {portfolioPublic ? <Eye size={14} className="text-emerald-600" /> : <EyeOff size={14} className="text-slate-400" />}
            {portfolioPublic ? "Public Share On" : "Private Only"}
          </button>

          {userId && (
            <>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                {copied ? "Link Copied" : "Copy Share Link"}
              </button>
              <a
                href={`/portfolio/${userId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Open Public Portfolio <ExternalLink size={14} />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Competency Provenance Legend & Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs font-semibold uppercase text-slate-500 mb-3">
          Competency Verification Tiers (AI assists mapping; Humans validate practical proof)
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <ProvenanceBadge provenance="self_declared" />
          <ProvenanceBadge provenance="ai_mapped" />
          <ProvenanceBadge provenance="assessor_validated" />
          <ProvenanceBadge provenance="employer_verified" />
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <div key={s.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <span className="font-semibold text-slate-900">{s.skill_name}</span>
              <ProvenanceBadge provenance={s.provenance} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Submit Practical Work Form */}
        <form
          onSubmit={handleCreateProject}
          className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4 h-fit"
        >
          <h2 className="text-base font-bold text-slate-900">Add Practical Work / Project</h2>
          {error && <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">{error}</div>}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Solar Microgrid Voltage Monitor"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Your Role</label>
            <input
              type="text"
              value={roleInProject}
              onChange={(e) => setRoleInProject(e.target.value)}
              placeholder="e.g., Lead Developer / Technician"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Practical Description & Outcome</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you built, tested, or repaired and the measurable outcome..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Competencies Demonstrated (comma-separated)</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g., TypeScript, REST APIs, SQL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Demo / Repository Link (optional)</label>
            <input
              type="url"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-3 text-xs text-slate-600 hover:border-blue-400 cursor-pointer bg-slate-50">
              <Upload size={15} className="text-blue-600" />
              <span>{uploading ? "Uploading..." : attachment ? `Attached: ${attachment.name}` : "Upload Work Sample (PDF, PNG, JPG, TXT)"}</span>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.md" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            <Plus size={16} /> {submitting ? "Submitting..." : "Submit for Assessor Validation"}
          </button>
        </form>

        {/* Project List & Assessment History */}
        <div className="lg:col-span-3 space-y-4">
          {projects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
              No practical work submitted yet. Add your first project on the left to request trainer validation.
            </div>
          ) : (
            projects.map((p) => {
              const projAssessments = assessments.filter((a) => a.project_id === p.id);
              const projSkills = JSON.parse(p.skills_json || "[]") as string[];
              return (
                <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{p.title}</h3>
                      {p.role_in_project && <div className="text-xs text-slate-500">{p.role_in_project}</div>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === "validated"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : p.status === "needs_revision"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {p.status === "validated"
                          ? "Assessor Validated"
                          : p.status === "needs_revision"
                          ? "Needs Revision"
                          : "Pending Validation"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600">{p.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {projSkills.map((sk) => (
                      <span key={sk} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs">
                    {p.demo_url && (
                      <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                        Demo Link <ExternalLink size={12} />
                      </a>
                    )}
                    {p.attachment_path && (
                      <a href={p.attachment_path} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline inline-flex items-center gap-1">
                        <FileText size={12} /> {p.attachment_name || "View Work Sample"}
                      </a>
                    )}
                  </div>

                  {projAssessments.length > 0 && (
                    <div className="mt-2 pt-3 border-t border-slate-100 space-y-2">
                      {projAssessments.map((a) => (
                        <div key={a.id} className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs">
                          <div className="flex items-center justify-between font-semibold text-emerald-900">
                            <span>Assessor: {a.assessor_name} ({a.assessor_role})</span>
                            <span>Rubric Score: {a.rubric_score}/100</span>
                          </div>
                          <p className="text-emerald-800 mt-1">{a.feedback}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
