import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export const PROTECTED_PATHS = ['/dashboard', '/tiles', '/bookmarks'];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const authPaths = ['/login', '/register'];

  const isProtectedPath = PROTECTED_PATHS.some(p => request.nextUrl.pathname.startsWith(p));
  const isAuthPath = authPaths.some(p => request.nextUrl.pathname.startsWith(p));

  if (!user && isProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}
