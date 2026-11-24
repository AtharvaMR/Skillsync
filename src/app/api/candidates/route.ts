import { NextRequest, NextResponse } from 'next/server';
import { candidates } from '@/lib/mock-data';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Anonymize for non-admin roles
  const returnCandidates = candidates.map(c => {
    if (user.role !== 'government' && user.role !== 'institute') {
      return {
        ...c,
        id: c.id.substring(0, 4) + '****',
        name: 'Candidate ' + c.id.substring(0, 4),
      };
    }
    return c;
  });

  return NextResponse.json(returnCandidates);
}
