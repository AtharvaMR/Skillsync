import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import { ProvenanceBadge } from "@/components/ui/provenance-badge";
import { MapPin, ExternalLink, FileText, ShieldCheck, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();

  const userRow = db
    .prepare("SELECT id, name, role, organisation_name FROM users WHERE id = ?")
    .get(id) as { id: string; name: string; role: string; organisation_name?: string } | undefined;

  if (!userRow) {
    notFound();
  }

  const profile = db
    .prepare("SELECT * FROM learner_profiles WHERE user_id = ?")
    .get(id) as
    | {
        headline: string;
        bio: string;
        location: string;
        education_level: string;
        target_role: string;
        portfolio_public: number;
      }
    | undefined;

  if (profile && !profile.portfolio_public) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md bg-white border border-slate-200 rounded-xl p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto text-slate-400 mb-3" size={32} />
          <h1 className="text-lg font-bold text-slate-900">Portfolio is Private</h1>
          <p className="text-sm text-slate-600 mt-1">
            This learner has restricted public visibility for their skill portfolio.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline">
            Return to SkillSync
          </Link>
        </div>
      </div>
    );
  }

  const skills = db
    .prepare("SELECT * FROM learner_skills WHERE user_id = ? ORDER BY CASE provenance WHEN 'employer_verified' THEN 0 WHEN 'assessor_validated' THEN 1 WHEN 'ai_mapped' THEN 2 ELSE 3 END")
    .all(id) as Array<{
      id: string;
      skill_name: string;
      proficiency: string;
      provenance: string;
      evidence_note: string;
      validated_by?: string | null;
    }>;

  const projects = db
    .prepare("SELECT * FROM portfolio_projects WHERE user_id = ? ORDER BY created_at DESC")
    .all(id) as Array<{
      id: string;
      title: string;
      description: string;
      role_in_project: string;
      skills_json: string;
      demo_url: string;
      attachment_path?: string | null;
      attachment_name?: string | null;
      status: string;
    }>;

  const assessments = db
    .prepare("SELECT * FROM assessments WHERE learner_id = ? ORDER BY created_at DESC")
    .all(id) as Array<{
      id: string;
      project_id: string;
      assessor_name: string;
      assessor_role: string;
      rubric_score: number;
      feedback: string;
    }>;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-sm">S</div>
            <span>SkillSync</span>
            <span className="text-xs font-normal text-slate-400 hidden sm:inline">• Verified Skill Portfolio</span>
          </div>
          <Link href="/dashboard" className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft size={14} /> Portal
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Learner Header */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{userRow.name}</h1>
              <p className="text-sm text-slate-600 mt-1">{profile?.headline || "SkillSync Learner"}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-2">
                {profile?.location && (
                  <span className="inline-flex items-center gap-1"><MapPin size={13} /> {profile.location}</span>
                )}
                {profile?.education_level && <span>{profile.education_level}</span>}
                {profile?.target_role && (
                  <span className="text-blue-700 font-semibold">Target Role: {profile.target_role}</span>
                )}
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs font-semibold uppercase text-slate-500">Verified Skills</div>
              <div className="text-2xl font-bold text-emerald-700">
                {skills.filter((s) => s.provenance === "assessor_validated" || s.provenance === "employer_verified").length} / {skills.length}
              </div>
            </div>
          </div>
          {profile?.bio && <p className="text-sm text-slate-700 mt-4 pt-4 border-t border-slate-100">{profile.bio}</p>}
        </section>

        {/* Skills & Provenance */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Competencies & Verification Provenance</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {skills.map((s) => (
              <div key={s.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-sm text-slate-900">{s.skill_name}</div>
                  {s.validated_by && (
                    <div className="text-xs text-emerald-700 mt-0.5">Verified by: {s.validated_by}</div>
                  )}
                  {s.evidence_note && (
                    <div className="text-xs text-slate-500 mt-0.5">{s.evidence_note}</div>
                  )}
                </div>
                <ProvenanceBadge provenance={s.provenance} className="shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Practical Work */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Practical Projects & Evidence</h2>
          {projects.map((p) => {
            const pAssessments = assessments.filter((a) => a.project_id === p.id);
            const pSkills = JSON.parse(p.skills_json || "[]") as string[];
            return (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    {p.role_in_project && <div className="text-xs text-slate-500">{p.role_in_project}</div>}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.status === "validated"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {p.status === "validated" ? "Assessor Validated" : "Submitted"}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{p.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pSkills.map((sk) => (
                    <span key={sk} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{sk}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-xs">
                  {p.demo_url && (
                    <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                      Project Link <ExternalLink size={12} />
                    </a>
                  )}
                  {p.attachment_path && (
                    <a href={p.attachment_path} target="_blank" rel="noreferrer" className="text-slate-700 hover:underline inline-flex items-center gap-1">
                      <FileText size={12} /> {p.attachment_name || "Work Sample"}
                    </a>
                  )}
                </div>
                {pAssessments.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <strong>Assessor Endorsement ({a.assessor_name}, {a.rubric_score}/100):</strong> {a.feedback}
                  </div>
                ))}
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
