'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, AlertTriangle, CheckCircle2, ArrowRight, RefreshCcw } from 'lucide-react';

interface CourseItem {
  id: string;
  name: string;
  instituteName: string;
  description: string;
  sector: string;
  duration: string;
  healthScore: number;
  healthLevel: string;
  requiredSkills: string[];
  enrolledCount: number;
  completedCount: number;
  placedCount: number;
}

export default function CoursesIntelligencePage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/courses')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (active) setCourses(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const healthyCount = courses.filter((c) => c.healthScore >= 80).length;
  const updateCount = courses.filter((c) => c.healthScore >= 50 && c.healthScore < 80).length;
  const criticalCount = courses.filter((c) => c.healthScore < 50).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="text-blue-600" /> Courses & Health Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1">Monitor course health, completion, placement rates, and alignment actions</p>
        </div>
        <Link
          href="/dashboard/curriculum"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Open Curriculum Alignment <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg"><CheckCircle2 size={22} /></div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Healthy Courses</div>
            <div className="text-2xl font-bold text-slate-900">{healthyCount}</div>
            <div className="text-xs text-emerald-700">Health Score &gt;= 80%</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-lg"><RefreshCcw size={22} /></div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Needs Update</div>
            <div className="text-2xl font-bold text-slate-900">{updateCount}</div>
            <div className="text-xs text-amber-700">Health Score 50–79%</div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-lg"><AlertTriangle size={22} /></div>
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Critical / Sunset Risk</div>
            <div className="text-2xl font-bold text-slate-900">{criticalCount}</div>
            <div className="text-xs text-rose-700">Health Score &lt; 50%</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-sm text-slate-500">
            Loading courses...
          </div>
        ) : (
          courses.map((course) => {
            const placementPct = course.completedCount
              ? Math.round((course.placedCount / course.completedCount) * 100)
              : 0;
            return (
              <div key={course.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">{course.name}</h2>
                    <div className="text-xs text-slate-500">{course.instituteName} • {course.sector} • {course.duration}</div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                      course.healthScore >= 80
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : course.healthScore >= 50
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {course.healthScore}% Health
                  </span>
                </div>

                <p className="text-xs text-slate-600">{course.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {course.requiredSkills.map((sk) => (
                    <span key={sk} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600">
                    Enrolled: <strong>{course.enrolledCount}</strong> • Placed: <strong>{course.placedCount} ({placementPct}%)</strong>
                  </span>
                  <Link href="/dashboard/curriculum" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1">
                    Align Syllabus <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
