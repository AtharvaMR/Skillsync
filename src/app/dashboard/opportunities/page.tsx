"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, CheckCircle2, Search, Sparkles, Plus, Wifi } from "lucide-react";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";

interface OpportunityItem {
  id: string;
  title: string;
  employer_name: string;
  type: string;
  sector: string;
  location: string;
  is_remote: number;
  stipend_or_salary: string;
  experience_required: string;
  eligibility: string;
  description: string;
  requiredSkills: string[];
  matchedSkills: Array<{ name: string; provenance: string }>;
  missingSkills: string[];
  semanticScore?: number;
  matchingEngine?: string;
  matchScore: number;
  matchReasons: string[];
  applicationStatus: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  apprenticeship: "Apprenticeship",
  entry_level_job: "Entry-Level Job",
  training_program: "Training Program",
};

export default function OpportunitiesPage() {
  const [items, setItems] = useState<OpportunityItem[]>([]);
  const [userRole, setUserRole] = useState<string>("student");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  // Post opportunity form
  const [title, setTitle] = useState("");
  const [type, setType] = useState("internship");
  const [location, setLocation] = useState("Bengaluru, Karnataka");
  const [stipend, setStipend] = useState("₹18,000 / month");
  const [skillsInput, setSkillsInput] = useState("");
  const [description, setDescription] = useState("");
  const [isRemote, setIsRemote] = useState(true);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (search.trim()) params.set("search", search.trim());
      if (remoteOnly) params.set("remote", "true");

      const [meRes, oppRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch(`/api/opportunities?${params.toString()}`),
      ]);
      if (meRes.ok) {
        const me = await meRes.json();
        setUserRole(me.user?.role || "student");
      }
      if (oppRes.ok) {
        const data = await oppRes.json();
        setItems(data.opportunities || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const params = new URLSearchParams();
    if (typeFilter !== "all") params.set("type", typeFilter);
    if (search.trim()) params.set("search", search.trim());
    if (remoteOnly) params.set("remote", "true");

    Promise.all([
      fetch("/api/auth/me"),
      fetch(`/api/opportunities?${params.toString()}`),
    ])
      .then(async ([meRes, oppRes]) => ({
        me: meRes.ok ? await meRes.json() : null,
        opp: oppRes.ok ? await oppRes.json() : null,
      }))
      .then(({ me, opp }) => {
        if (!active) return;
        if (me) setUserRole(me.user?.role || "student");
        if (opp) setItems(opp.opportunities || []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, remoteOnly]);

  const handleApply = async (opp: OpportunityItem) => {
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "apply", opportunityId: opp.id, matchScore: opp.matchScore }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((item) => (item.id === opp.id ? { ...item, applicationStatus: "applied" } : item))
      );
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        type,
        location,
        stipendOrSalary: stipend,
        requiredSkills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
        description,
        isRemote,
      }),
    });
    if (res.ok) {
      setShowPostForm(false);
      setTitle("");
      setDescription("");
      setSkillsInput("");
      await loadOpportunities();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="text-blue-600" /> Matched Opportunities
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Internships, apprenticeships, entry-level jobs, and training programs ranked by your demonstrated skills.
          </p>
        </div>

        {["employer", "institute", "government"].includes(userRole) && (
          <button
            type="button"
            onClick={() => setShowPostForm(!showPostForm)}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <Plus size={16} /> Post Opportunity
          </button>
        )}
      </div>

      {showPostForm && (
        <form onSubmit={handlePost} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900">Publish New Opportunity</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Role Title"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
              required
            />
            <select value={type} onChange={(e) => setType(e.target.value)} className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white">
              <option value="internship">Internship</option>
              <option value="apprenticeship">Apprenticeship</option>
              <option value="entry_level_job">Entry-Level Job</option>
              <option value="training_program">Training Program</option>
            </select>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
            <input
              type="text"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
              placeholder="Stipend / Salary"
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="Required skills (comma-separated, e.g. React, TypeScript, SQL)"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Role summary and practical responsibilities..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            required
          />
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
              <input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} />
              Remote / Hybrid accessible
            </label>
            <button type="submit" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold">
              Publish
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadOpportunities()}
            placeholder="Search role, skill, company, or district..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          <option value="all">All Types</option>
          <option value="internship">Internships</option>
          <option value="apprenticeship">Apprenticeships</option>
          <option value="entry_level_job">Entry-Level Jobs</option>
          <option value="training_program">Training Programs</option>
        </select>

        <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 px-3 py-2 border border-slate-200 rounded-lg cursor-pointer">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
          Remote Only
        </label>

        <button
          type="button"
          onClick={loadOpportunities}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          Matching opportunities against your skill profile...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
          No opportunities match your current filter.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((opp) => (
            <div key={opp.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {TYPE_LABELS[opp.type] || opp.type}
                    </span>
                    {Boolean(opp.is_remote) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Wifi size={11} /> Remote Friendly
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{opp.sector}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{opp.title}</h2>
                  <div className="text-sm text-slate-600 flex flex-wrap items-center gap-3 mt-1">
                    <span className="font-semibold text-slate-800">{opp.employer_name}</span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <MapPin size={14} /> {opp.location}
                    </span>
                    <span className="font-semibold text-emerald-700">{opp.stipend_or_salary}</span>
                  </div>
                </div>

                {userRole === "student" && (
                  <div className="text-left md:text-right shrink-0">
                    <div className="text-2xl font-bold text-blue-600">{opp.matchScore}% Match</div>
                    <div className="text-xs text-slate-500">
                      Skill & Location Fit
                      {typeof opp.semanticScore === "number" && (
                        <span> • {opp.semanticScore}% {opp.matchingEngine === "cohere" ? "Cohere Semantic" : "Semantic"}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-600">{opp.description}</p>

              {/* Explainability Block */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" /> Why This Opportunity Is Recommended
                </div>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {opp.matchReasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                  <li>Eligibility: {opp.eligibility} ({opp.experience_required})</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {opp.matchedSkills.map((ms) => (
                    <span key={ms.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-900">
                      {ms.name}
                      <ProvenanceBadge provenance={ms.provenance} />
                    </span>
                  ))}
                  {opp.missingSkills.map((missing) => (
                    <span key={missing} className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
                      Gap: {missing}
                    </span>
                  ))}
                </div>

                {userRole === "student" && (
                  opp.applicationStatus ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold shrink-0">
                      <CheckCircle2 size={14} /> Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleApply(opp)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0"
                    >
                      Apply with Skill Portfolio
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
