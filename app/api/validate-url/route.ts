import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ reachable: false, error: 'No URL provided' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ reachable: false, error: 'Invalid URL format' })
    }

    // Try a HEAD request first (faster), fall back to GET if HEAD is not allowed
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      let response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SpadeChatBot/1.0; +https://spadechat.com)',
        },
      })

      // Some servers reject HEAD requests — try GET if we get 405
      if (response.status === 405) {
        response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; SpadeChatBot/1.0; +https://spadechat.com)',
          },
        })
      }

      clearTimeout(timeout)

      // Consider 2xx and 3xx as reachable
      // Also accept 403 (some booking pages block bots but are still valid)
      const reachable = response.status < 500 && response.status !== 404
      return NextResponse.json({ reachable, status: response.status })
    } catch (fetchError) {
      clearTimeout(timeout)

      // AbortError means timeout
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        // Timeout — might still be valid, some sites are slow
        return NextResponse.json({ reachable: true, status: 0, note: 'timeout' })
      }

      return NextResponse.json({ reachable: false, error: 'Could not reach URL' })
    }
  } catch {
    return NextResponse.json({ reachable: false, error: 'Server error' }, { status: 500 })
  }
}
