import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    await signOut();
    return NextResponse.json({ message: 'Signed out successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
