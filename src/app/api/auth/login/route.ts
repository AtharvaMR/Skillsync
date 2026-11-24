import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const result = await authenticateUser(email, password);
    if (!result) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const response = NextResponse.json({ user: result.user });
    response.cookies.set(COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
