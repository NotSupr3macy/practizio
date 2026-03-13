import { z } from 'zod'
import { SupabaseClient } from '@supabase/supabase-js'
import { generateConfirmationNumber, formatTime } from '@/lib/utils'
import { sendEmail, appointmentConfirmationEmail } from '@/lib/email/resend'

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

type ToolDefinition = {
  name: string
  description: string
  inputSchema?: z.ZodObject<z.ZodRawShape>
  handler: (params: Record<string, unknown>) => Promise<{ content: Array<{ type: 'text'; text: string }> }>
}

// ---------------------------------------------------------------------------
// Helper: log every tool invocation to ai_queries
// ---------------------------------------------------------------------------

async function logQuery(
  supabase: SupabaseClient,
  practiceId: string,
  toolCalled: string,
  queryPayload: unknown,
  responsePayload: unknown,
  agentIdentifier?: string
) {
  await supabase.from('ai_queries').insert({
    practice_id: practiceId,
    tool_called: toolCalled,
    agent_identifier: agentIdentifier ?? null,
    query_payload: queryPayload ?? {},
    response_payload: responsePayload ?? {},
  })
}

// ---------------------------------------------------------------------------
// 1. get_practice_info
// ---------------------------------------------------------------------------

export function getPracticeInfoTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_practice_info',
    description:
      'Returns general information about this practice including name, address, phone number, website, practice type, and accepted insurance plans.',
    handler: async () => {
      const { data, error } = await supabase
        .from('practices')
        .select('name, address, phone, website, practice_type, accepted_insurance')
        .eq('id', practiceId)
        .single()

      if (error) {
        const result = { error: 'Failed to retrieve practice information.' }
        await logQuery(supabase, practiceId, 'get_practice_info', {}, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      const result = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        website: data.website,
        practice_type: data.practice_type,
        accepted_insurance: data.accepted_insurance ?? [],
      }

      await logQuery(supabase, practiceId, 'get_practice_info', {}, result)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}

// ---------------------------------------------------------------------------
// 2. get_services
// ---------------------------------------------------------------------------

export function getServicesTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_services',
    description:
      'Returns the list of services offered by this practice, including name, price range, duration in minutes, and description.',
    handler: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('name, price_min, price_max, duration_minutes, description')
        .eq('practice_id', practiceId)

      if (error) {
        const result = { error: 'Failed to retrieve services.' }
        await logQuery(supabase, practiceId, 'get_services', {}, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      const result = { services: data ?? [] }
      await logQuery(supabase, practiceId, 'get_services', {}, result)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}

// ---------------------------------------------------------------------------
// 3. get_providers
// ---------------------------------------------------------------------------

export function getProvidersTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'get_providers',
    description:
      'Returns the list of providers (doctors, dentists, lawyers, etc.) at this practice, including name, title, specialties, bio, and whether they are accepting new patients.',
    handler: async () => {
      const { data, error } = await supabase
        .from('providers')
        .select('name, title, specialties, bio, accepting_new_patients')
        .eq('practice_id', practiceId)

      if (error) {
        const result = { error: 'Failed to retrieve providers.' }
        await logQuery(supabase, practiceId, 'get_providers', {}, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      const result = { providers: data ?? [] }
      await logQuery(supabase, practiceId, 'get_providers', {}, result)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}

// ---------------------------------------------------------------------------
// 4. check_availability
// ---------------------------------------------------------------------------

export function checkAvailabilityTool(supabase: SupabaseClient, practiceId: string): ToolDefinition {
  return {
    name: 'check_availability',
    description:
      'Checks available appointment time slots for a given date. Returns a list of open 30-minute slots after excluding already-booked appointments.',
    inputSchema: z.object({
      date: z
        .string()
        .describe('The date to check availability for, in ISO format (e.g. 2024-01-15).'),
    }),
    handler: async (params) => {
      const { date } = params as { date: string }

      // Determine day of week (0 = Sunday, 6 = Saturday)
      const dateObj = new Date(date + 'T00:00:00')
      const dayOfWeek = dateObj.getUTCDay()

      // Get availability schedule for this day
      const { data: availData, error: availError } = await supabase
        .from('availability')
        .select('open_time, close_time, is_open')
        .eq('practice_id', practiceId)
        .eq('day_of_week', dayOfWeek)

      if (availError) {
        const result = { error: 'Failed to retrieve availability.' }
        await logQuery(supabase, practiceId, 'check_availability', { date }, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // Find the first open schedule entry (there may be none)
      const schedule = availData?.find((a) => a.is_open)

      if (!schedule) {
        const result = { date, available_slots: [], message: 'The practice is closed on this day.' }
        await logQuery(supabase, practiceId, 'check_availability', { date }, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // Get existing appointments for this date
      const { data: existingAppts } = await supabase
        .from('appointments')
        .select('appointment_time')
        .eq('practice_id', practiceId)
        .eq('appointment_date', date)

      const bookedTimes = new Set(
        (existingAppts ?? []).map((a) => a.appointment_time.substring(0, 5)) // "HH:MM"
      )

      // Generate 30-minute slots between open_time and close_time
      const slots: string[] = []
      const [openH, openM] = schedule.open_time.split(':').map(Number)
      const [closeH, closeM] = schedule.close_time.split(':').map(Number)
      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM

      for (let m = openMinutes; m + 30 <= closeMinutes; m += 30) {
        const hh = String(Math.floor(m / 60)).padStart(2, '0')
        const mm = String(m % 60).padStart(2, '0')
        const slot = `${hh}:${mm}`
        if (!bookedTimes.has(slot)) {
          slots.push(slot)
        }
      }

      const result = {
        date,
        day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
        open_time: schedule.open_time,
        close_time: schedule.close_time,
        available_slots: slots.map((s) => ({
          time: s,
          formatted: formatTime(s),
        })),
      }

      await logQuery(supabase, practiceId, 'check_availability', { date }, result)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}

// ---------------------------------------------------------------------------
// 5. book_appointment
// ---------------------------------------------------------------------------

export function bookAppointmentTool(
  supabase: SupabaseClient,
  practiceId: string,
  practiceName: string
): ToolDefinition {
  return {
    name: 'book_appointment',
    description:
      'Books an appointment at this practice. Validates the requested slot is available, creates the appointment, and sends a confirmation email to the patient. Returns the confirmation number and appointment details.',
    inputSchema: z.object({
      date: z.string().describe('Appointment date in ISO format (e.g. 2024-01-15).'),
      time: z.string().describe('Appointment time in HH:MM 24-hour format (e.g. 14:30).'),
      patient_name: z.string().describe('Full name of the patient.'),
      patient_email: z.string().email().describe('Email address of the patient.'),
      patient_phone: z.string().describe('Phone number of the patient.'),
      service: z.string().describe('Name of the service to book.'),
      notes: z.string().optional().describe('Optional notes for the appointment.'),
    }),
    handler: async (params) => {
      const {
        date,
        time,
        patient_name,
        patient_email,
        patient_phone,
        service,
        notes,
      } = params as {
        date: string
        time: string
        patient_name: string
        patient_email: string
        patient_phone: string
        service: string
        notes?: string
      }

      // ---- Validate the slot is open ----

      const dateObj = new Date(date + 'T00:00:00')
      const dayOfWeek = dateObj.getUTCDay()

      const { data: availData } = await supabase
        .from('availability')
        .select('open_time, close_time, is_open')
        .eq('practice_id', practiceId)
        .eq('day_of_week', dayOfWeek)

      const schedule = availData?.find((a) => a.is_open)

      if (!schedule) {
        const result = { error: 'The practice is closed on the requested day.' }
        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // Check that the requested time falls within operating hours
      const requestedMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])
      const [openH, openM] = schedule.open_time.split(':').map(Number)
      const [closeH, closeM] = schedule.close_time.split(':').map(Number)
      const openMinutes = openH * 60 + openM
      const closeMinutes = closeH * 60 + closeM

      if (requestedMinutes < openMinutes || requestedMinutes + 30 > closeMinutes) {
        const result = {
          error: `The requested time is outside operating hours (${formatTime(schedule.open_time)} - ${formatTime(schedule.close_time)}).`,
        }
        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // Check the slot is not already booked
      const { data: existingAppts } = await supabase
        .from('appointments')
        .select('id')
        .eq('practice_id', practiceId)
        .eq('appointment_date', date)
        .eq('appointment_time', time)

      if (existingAppts && existingAppts.length > 0) {
        const result = { error: 'This time slot is already booked. Please choose a different time.' }
        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // ---- Create the appointment ----

      const confirmationNumber = generateConfirmationNumber()

      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          practice_id: practiceId,
          confirmation_number: confirmationNumber,
          patient_name,
          patient_email,
          patient_phone,
          service,
          appointment_date: date,
          appointment_time: time,
          notes: notes ?? null,
          booked_by: 'ai_agent',
        })
        .select()
        .single()

      if (insertError) {
        const result = { error: 'Failed to book the appointment. Please try again.' }
        await logQuery(supabase, practiceId, 'book_appointment', params, result)
        return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
      }

      // ---- Send confirmation email ----

      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(dateObj)

      const formattedTime = formatTime(time)

      const emailHtml = appointmentConfirmationEmail({
        patientName: patient_name,
        practiceName,
        service,
        date: formattedDate,
        time: formattedTime,
        confirmationNumber,
      })

      await sendEmail({
        to: patient_email,
        subject: `Appointment Confirmed — ${confirmationNumber}`,
        html: emailHtml,
      })

      // ---- Log & return ----

      const result = {
        confirmation_number: confirmationNumber,
        appointment_details: {
          date: formattedDate,
          time: formattedTime,
          patient_name,
          patient_email,
          patient_phone,
          service,
          notes: notes ?? null,
        },
      }

      await logQuery(supabase, practiceId, 'book_appointment', params, result)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  }
}
