'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Layers, Sparkles, Loader2 } from 'lucide-react';

interface CourseItem {
  id: string;
  name: string;
  instituteName: string;
  sector: string;
  healthScore: number;
  requiredSkills: string[];
}

interface ProposalItem {
  title: string;
  description: string;
  impact: string;
  effort: string;
  rationale?: string;
}

export default function CurriculumAlignmentPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCourses(list);
        if (list.length > 0) setSelectedId(list[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCourse = courses.find((c) => c.id === selectedId) || courses[0];

  const handleGenerateProposal = async () => {
    if (!activeCourse) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: activeCourse.name,
          sector: activeCourse.sector,
          skills: activeCourse.requiredSkills,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Unable to generate proposal.');
        return;
      }
      setProposals(data.recommendations || []);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="text-blue-600" /> Curriculum Alignment
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Map course modules against industry requirements and generate evidence-backed syllabus updates.
          </p>
        </div>

        {courses.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setProposals([]);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.healthScore}% Health)
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        {loading ? (
          <p className="text-sm text-slate-500">Loading courses...</p>
        ) : !activeCourse ? (
          <p className="text-sm text-slate-500">No courses available.</p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Alignment Matrix: {activeCourse.name}</h2>
                <p className="text-xs text-slate-500">{activeCourse.instituteName} • {activeCourse.sector}</p>
              </div>
              <span className="text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Course Health: {activeCourse.healthScore}%
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-4 items-center bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-bold uppercase text-slate-600">
                <div className="col-span-5">Course Competency</div>
                <div className="col-span-2 text-center"><ArrowRight className="mx-auto text-slate-400" size={14} /></div>
                <div className="col-span-5 text-right">Alignment Status</div>
              </div>

              {activeCourse.requiredSkills.map((sk) => (
                <div key={sk} className="grid grid-cols-12 gap-4 items-center p-3 border-b border-slate-100 text-sm">
                  <div className="col-span-5 font-medium text-slate-800">{sk}</div>
                  <div className="col-span-2 text-center"><ArrowRight className="mx-auto text-slate-300" size={14} /></div>
                  <div className="col-span-5 text-right">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      Mapped to Syllabus
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleGenerateProposal}
                disabled={generating}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              >
                {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generate Syllabus Update Proposal
              </button>
            </div>
          </>
        )}
      </div>

      {proposals.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">AI-Assisted Curriculum Update Proposals</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {proposals.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-blue-700">Impact: {p.impact}</span>
                  <span className="text-slate-500">Effort: {p.effort}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                <p className="text-xs text-slate-600">{p.description}</p>
                {p.rationale && <p className="text-[11px] text-slate-500 italic">{p.rationale}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
