import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const path = request.nextUrl.pathname

  // Skip auth checks for public routes that don't need Supabase
  const isPublicRoute =
    path === '/' ||
    path.startsWith('/directory') ||
    path.startsWith('/api/mcp') ||
    path.startsWith('/api/directory') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon')

  if (isPublicRoute) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options as any)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protected routes - redirect to login if not authenticated
    if (!user && (path.startsWith('/dashboard') || path.startsWith('/onboarding'))) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Redirect authenticated users away from auth pages
    if (user && (path === '/login' || path === '/signup')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch {
    // If Supabase is unreachable, allow the request through for public pages
    // but redirect to login for protected routes
    if (path.startsWith('/dashboard') || path.startsWith('/onboarding')) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
