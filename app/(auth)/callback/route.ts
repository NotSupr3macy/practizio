import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = await createClient()

  // Handle recovery/invite links (token_hash based)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'recovery' | 'invite' | 'email',
    })

    if (!error) {
      if (type === 'recovery' || type === 'invite') {
        return NextResponse.redirect(`${origin}/set-password`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // Handle code-based auth (OAuth, magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user is admin
        const adminEmails = (process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean)

        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          return NextResponse.redirect(`${origin}/admin`)
        }

        const { data: practices } = await supabase
          .from('practices')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)

        if (practices && practices.length > 0) {
          return NextResponse.redirect(`${origin}/dashboard`)
        }
        return NextResponse.redirect(`${origin}/onboarding`)
      }
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
