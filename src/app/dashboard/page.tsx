import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { LearnerDashboard } from '@/components/dashboard/learner-dashboard';
import { EcosystemOverview } from '@/components/dashboard/ecosystem-overview';
import { InstitutionTrainerOverview, EmployerOverview } from '@/components/dashboard/role-home-views';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (user.role === 'student') {
    return <LearnerDashboard user={user} />;
  }

  const db = getDb();

  if (user.role === 'trainer' || user.role === 'institute') {
    const pendingRow = db
      .prepare("SELECT COUNT(*) as count FROM portfolio_projects WHERE status = 'submitted'")
      .get() as { count: number };
    const courseRow = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
    return (
      <InstitutionTrainerOverview
        user={user}
        pendingReviews={pendingRow.count}
        courseCount={courseRow.count}
      />
    );
  }

  if (user.role === 'employer') {
    const oppRow = db.prepare('SELECT COUNT(*) as count FROM opportunities').get() as { count: number };
    const verifiedRow = db
      .prepare("SELECT COUNT(DISTINCT user_id) as count FROM portfolio_projects WHERE status = 'validated'")
      .get() as { count: number };
    return (
      <EmployerOverview
        user={user}
        opportunityCount={oppRow.count}
        verifiedLearnerCount={verifiedRow.count}
      />
    );
  }

  return <EcosystemOverview />;
}
