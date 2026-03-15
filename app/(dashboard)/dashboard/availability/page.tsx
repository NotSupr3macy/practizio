'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatTime } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { Availability } from '@/types/database'
import { Clock, Save, Check } from 'lucide-react'

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const DEFAULT_AVAILABILITY: Omit<Availability, 'id' | 'practice_id'>[] = DAY_NAMES.map(
  (_, i) => ({
    day_of_week: i,
    open_time: '09:00',
    close_time: '17:00',
    is_open: i >= 1 && i <= 5, // Mon-Fri open by default
  })
)

export default function AvailabilityPage() {
  const supabase = createClient()
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [availability, setAvailability] = useState<
    Omit<Availability, 'id' | 'practice_id'>[]
  >(DEFAULT_AVAILABILITY)
  const [existingIds, setExistingIds] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: practice } = await supabase
      .from('practices')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!practice) return
    setPracticeId(practice.id)

    const { data: existing } = await supabase
      .from('availability')
      .select('*')
      .eq('practice_id', practice.id)
      .order('day_of_week')

    if (existing && existing.length > 0) {
      const ids: Record<number, string> = {}
      const merged = DEFAULT_AVAILABILITY.map((day) => {
        const found = existing.find((e) => e.day_of_week === day.day_of_week)
        if (found) {
          ids[found.day_of_week] = found.id
          return {
            day_of_week: found.day_of_week,
            open_time: found.open_time,
            close_time: found.close_time,
            is_open: found.is_open,
          }
        }
        return day
      })
      setExistingIds(ids)
      setAvailability(merged)
    }

    setLoading(false)
  }

  function updateDay(
    dayIndex: number,
    field: 'open_time' | 'close_time' | 'is_open',
    value: string | boolean
  ) {
    setAvailability((prev) =>
      prev.map((day) =>
        day.day_of_week === dayIndex ? { ...day, [field]: value } : day
      )
    )
    setSaved(false)
  }

  async function handleSave() {
    if (!practiceId) return
    setSaving(true)

    for (const day of availability) {
      const payload = {
        practice_id: practiceId,
        day_of_week: day.day_of_week,
        open_time: day.open_time,
        close_time: day.close_time,
        is_open: day.is_open,
      }

      if (existingIds[day.day_of_week]) {
        await supabase
          .from('availability')
          .update(payload)
          .eq('id', existingIds[day.day_of_week])
      } else {
        const { data } = await supabase
          .from('availability')
          .insert(payload)
          .select('id')
          .single()
        if (data) {
          setExistingIds((prev) => ({ ...prev, [day.day_of_week]: data.id }))
        }
      }
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="mono-label-sm opacity-40">LOADING AVAILABILITY</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="mono-label-sm opacity-40 block mb-3">SCHEDULE CONFIG</span>
          <h1 className="font-display font-black uppercase text-3xl tracking-tightest">AVAILABILITY</h1>
          <p className="font-sans text-sm font-light opacity-50 mt-2">
            Set your weekly hours so AI agents can book appointments
          </p>
        </div>
        <Button onClick={handleSave} loading={saving} disabled={saved}>
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-1.5" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-1.5" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Availability Grid */}
      <div className="space-y-3">
        {availability.map((day) => (
          <Card
            key={day.day_of_week}
            className={!day.is_open ? 'opacity-60' : undefined}
          >
            <div className="flex items-center gap-6">
              {/* Day toggle */}
              <div className="w-[140px] flex items-center gap-3">
                <Switch
                  checked={day.is_open}
                  onCheckedChange={(checked) =>
                    updateDay(day.day_of_week, 'is_open', checked)
                  }
                />
                <span className="text-sm font-mono text-foreground font-medium">
                  {DAY_NAMES[day.day_of_week]}
                </span>
              </div>

              {/* Time inputs */}
              {day.is_open ? (
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <input
                      type="time"
                      value={day.open_time}
                      onChange={(e) =>
                        updateDay(day.day_of_week, 'open_time', e.target.value)
                      }
                      className="px-3 py-1.5 bg-transparent hairline-b text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">to</span>
                  <div>
                    <input
                      type="time"
                      value={day.close_time}
                      onChange={(e) =>
                        updateDay(day.day_of_week, 'close_time', e.target.value)
                      }
                      className="px-3 py-1.5 bg-transparent hairline-b text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {formatTime(day.open_time)} - {formatTime(day.close_time)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-mono text-muted-foreground">Closed</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
