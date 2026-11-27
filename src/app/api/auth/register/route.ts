import { NextRequest, NextResponse } from 'next/server';
import { registerUser, COOKIE_NAME } from '@/lib/auth';
import type { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const role = (typeof body.role === 'string' ? body.role : 'student') as UserRole;
    const organisationName = typeof body.organisationName === 'string' ? body.organisationName : undefined;
    const location = typeof body.location === 'string' ? body.location : undefined;

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Full name is required (at least 2 characters).' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const result = await registerUser({
      name,
      email,
      password,
      role,
      organisationName,
      location,
    });

    const response = NextResponse.json({ user: result.user }, { status: 201 });
    response.cookies.set(COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 });
  }
}
