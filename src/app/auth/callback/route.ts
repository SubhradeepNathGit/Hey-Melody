import { NextResponse } from 'next/server';

// import { cookies } from 'next/headers';
import getSupabaseClient from '../../../../api/SupabaseClient';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to home page after successful authentication
  return NextResponse.redirect(new URL('/', request.url));
}