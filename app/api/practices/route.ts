import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { NextResponse } from 'next/server'

interface ServicePayload {
  name: string
  price_min: number | null
  price_max: number | null
  duration_minutes: number | null
  description: string | null
}

interface AvailabilityPayload {
  day_of_week: number
  open_time: string
  close_time: string
  is_open: boolean
}

interface CreatePracticeBody {
  name: string
  practice_type: string
  phone: string | null
  website: string | null
  address: {
    street: string
    city: string
    state: string
    zip: string
  } | null
  services: ServicePayload[]
  availability: AvailabilityPayload[]
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreatePracticeBody = await request.json()

    if (!body.name || !body.practice_type) {
      return NextResponse.json(
        { error: 'Name and practice type are required' },
        { status: 400 }
      )
    }

    const slug = generateSlug(body.name)

    const { data: practice, error: practiceError } = await supabase
      .from('practices')
      .insert({
        user_id: user.id,
        slug,
        name: body.name,
        practice_type: body.practice_type,
        phone: body.phone,
        website: body.website,
        address: body.address,
        is_active: true,
        plan: 'starter',
        timezone: 'America/New_York',
      })
      .select()
      .single()

    if (practiceError) {
      return NextResponse.json(
        { error: practiceError.message },
        { status: 500 }
      )
    }

    if (body.services && body.services.length > 0) {
      const servicesWithPracticeId = body.services
        .filter((s) => s.name.trim() !== '')
        .map((service) => ({
          practice_id: practice.id,
          name: service.name,
          price_min: service.price_min,
          price_max: service.price_max,
          duration_minutes: service.duration_minutes,
          description: service.description,
        }))

      if (servicesWithPracticeId.length > 0) {
        const { error: servicesError } = await supabase
          .from('services')
          .insert(servicesWithPracticeId)

        if (servicesError) {
          return NextResponse.json(
            { error: servicesError.message },
            { status: 500 }
          )
        }
      }
    }

    if (body.availability && body.availability.length > 0) {
      const availabilityWithPracticeId = body.availability.map((avail) => ({
        practice_id: practice.id,
        day_of_week: avail.day_of_week,
        open_time: avail.open_time,
        close_time: avail.close_time,
        is_open: avail.is_open,
      }))

      const { error: availError } = await supabase
        .from('availability')
        .insert(availabilityWithPracticeId)

      if (availError) {
        return NextResponse.json(
          { error: availError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ practice }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: practices, error } = await supabase
      .from('practices')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ practices })
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
