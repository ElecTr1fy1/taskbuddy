import { NextRequest, NextResponse } from 'next/server';
import { signIn, getProfile } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const session = await signIn(email, password);

    // Get user profile
    const profile = await getProfile(session.user.id);

    return NextResponse.json({
      session,
      profile,
      message: `Welcome back, ${profile?.email}!`,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}
