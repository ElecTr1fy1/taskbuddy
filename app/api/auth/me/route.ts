import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, getProfile } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Verify token with Supabase
    const { data, error } = await getSupabaseClient().auth.getUser(token);

    if (error || !data.user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user profile
    const profile = await getProfile(data.user.id);

    return NextResponse.json({
      user: data.user,
      profile,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
