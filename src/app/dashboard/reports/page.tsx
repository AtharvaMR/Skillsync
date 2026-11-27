'use client';

import { useState } from 'react';
import { FileText, Download, Loader2, CheckCircle2 } from 'lucide-react';

interface GeneratedReport {
  id: string;
  title: string;
  generatedAt: string;
  format: 'json' | 'md';
  content: string;
}

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [reports, setReports] = useState<GeneratedReport[]>([]);

  const downloadContent = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateSnapshot = async (format: 'json' | 'md') => {
    setGenerating(true);
    try {
      const [coursesRes, skillsRes, kaizenRes, feedbackRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/skills'),
        fetch('/api/kaizen'),
        fetch('/api/feedback'),
      ]);

      const courses = coursesRes.ok ? await coursesRes.json() : [];
      const skills = skillsRes.ok ? await skillsRes.json() : [];
      const kaizen = kaizenRes.ok ? (await kaizenRes.json()).cycles || [] : [];
      const feedback = feedbackRes.ok ? await feedbackRes.json() : [];

      const now = new Date().toISOString();
      const content =
        format === 'json'
          ? JSON.stringify({ generatedAt: now, courses, skills, kaizenCycles: kaizen, employerFeedback: feedback }, null, 2)
          : [
              `# SkillSync Ecosystem Report`,
              `Generated: ${now}`,
              '',
              `## Summary Counts`,
              `- Courses Tracked: ${Array.isArray(courses) ? courses.length : 0}`,
              `- Benchmark Skills: ${Array.isArray(skills) ? skills.length : 0}`,
              `- Kaizen PDCA Cycles: ${Array.isArray(kaizen) ? kaizen.length : 0}`,
              `- Employer Feedback Submissions: ${Array.isArray(feedback) ? feedback.length : 0}`,
              '',
              `## Top Courses by Health Score`,
              ...(Array.isArray(courses)
                ? courses.map((c: { name: string; healthScore: number; sector: string }) => `- **${c.name}** (${c.sector}): ${c.healthScore}%`)
                : []),
            ].join('\n');

      const report: GeneratedReport = {
        id: `rep_${Date.now()}`,
        title: `SkillSync Ecosystem Snapshot (${format.toUpperCase()})`,
        generatedAt: now,
        format,
        content,
      };
      setReports((prev) => [report, ...prev]);
      downloadContent(
        `skillsync-report-${now.slice(0, 10)}.${format}`,
        content,
        format === 'json' ? 'application/json' : 'text/markdown'
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" /> Ecosystem Reports & Exports
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Generate real-time exports directly from SQLite courses, skills, employer feedback, and Kaizen PDCA records.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateSnapshot('md')}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {generating ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            Export Markdown
          </button>
          <button
            type="button"
            disabled={generating}
            onClick={() => handleGenerateSnapshot('json')}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            <Download size={15} /> Export JSON
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h2 className="text-base font-bold text-slate-900">Generated Exports This Session</h2>
        {reports.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            Click &ldquo;Export Markdown&rdquo; or &ldquo;Export JSON&rdquo; above to generate and download a live snapshot from SQLite.
          </p>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <div>
                  <div className="font-bold text-sm text-slate-900">{r.title}</div>
                  <div className="text-xs text-slate-500">Generated {new Date(r.generatedAt).toLocaleTimeString()}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  downloadContent(
                    `skillsync-report.${r.format}`,
                    r.content,
                    r.format === 'json' ? 'application/json' : 'text/markdown'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Download size={14} /> Download Again
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
