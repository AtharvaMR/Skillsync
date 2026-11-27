import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getLockerStatus } from '@/lib/security/secret-locker';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      locker: getLockerStatus(),
      exposurePolicy: 'server-only-env',
    });
  } catch (error) {
    console.error('Error reading locker status:', error);
    return NextResponse.json({ error: 'Failed to check locker status.' }, { status: 500 });
  }
}
