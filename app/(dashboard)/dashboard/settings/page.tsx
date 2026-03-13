'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Practice } from '@/types/database'
import {
  Settings as SettingsIcon,
  Mail,
  Lock,
  Globe,
  Link2,
  AlertTriangle,
  Check,
} from 'lucide-react'

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)' },
  { value: 'UTC', label: 'UTC' },
]

const INTEGRATIONS = [
  {
    name: 'Dentrix',
    description: 'Dental practice management',
    icon: '\u{1F9B7}',
    status: 'coming_soon' as const,
  },
  {
    name: 'Jane App',
    description: 'Health & wellness practice management',
    icon: '\u{1F3E5}',
    status: 'coming_soon' as const,
  },
  {
    name: 'SimplePractice',
    description: 'Health & wellness EHR',
    icon: '\u{1F4CB}',
    status: 'coming_soon' as const,
  },
  {
    name: 'Clio',
    description: 'Legal practice management',
    icon: '\u2696\uFE0F',
    status: 'coming_soon' as const,
  },
  {
    name: 'Google Calendar',
    description: 'Sync availability',
    icon: '\u{1F4C5}',
    status: 'coming_soon' as const,
  },
]

export default function SettingsPage() {
  const supabase = createClient()
  const [practice, setPractice] = useState<Practice | null>(null)
  const [loading, setLoading] = useState(true)

  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)

  // Password form
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Timezone
  const [timezone, setTimezone] = useState('')
  const [timezoneSaving, setTimezoneSaving] = useState(false)
  const [timezoneSaved, setTimezoneSaved] = useState(false)

  // Danger zone
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('practices')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setPractice(data)
    if (data) setTimezone(data.timezone)
    setLoading(false)
  }

  async function handleEmailChange() {
    if (!newEmail.trim()) return
    setEmailSaving(true)
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (!error) {
      setEmailSaved(true)
      setNewEmail('')
      setTimeout(() => setEmailSaved(false), 3000)
    }
    setEmailSaving(false)
  }

  async function handlePasswordChange() {
    setPasswordError('')
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    setPasswordSaving(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (!error) {
      setPasswordSaved(true)
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSaved(false), 3000)
    } else {
      setPasswordError(error.message)
    }
    setPasswordSaving(false)
  }

  async function handleTimezoneChange() {
    if (!practice) return
    setTimezoneSaving(true)
    await supabase
      .from('practices')
      .update({ timezone })
      .eq('id', practice.id)
    setTimezoneSaved(true)
    setTimeout(() => setTimezoneSaved(false), 3000)
    setTimezoneSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="mono-label-sm opacity-40">LOADING_SETTINGS</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">ACCOUNT_CONFIG</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">SETTINGS</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">
          Manage your account and practice preferences
        </p>
      </div>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-accent" />
            Email Address
          </CardTitle>
          <CardDescription>
            Update your account email. A confirmation will be sent to the new address.
          </CardDescription>
        </CardHeader>
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              id="new-email"
              type="email"
              placeholder="new@email.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <Button
            onClick={handleEmailChange}
            loading={emailSaving}
            disabled={!newEmail.trim() || emailSaved}
          >
            {emailSaved ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Sent
              </>
            ) : (
              'Update Email'
            )}
          </Button>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            Password
          </CardTitle>
          <CardDescription>
            Set a new password for your account
          </CardDescription>
        </CardHeader>
        <div className="space-y-4">
          <Input
            id="new-password"
            type="password"
            label="New Password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value)
              setPasswordError('')
            }}
          />
          <Input
            id="confirm-password"
            type="password"
            label="Confirm Password"
            placeholder="Repeat new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setPasswordError('')
            }}
            error={passwordError}
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePasswordChange}
              loading={passwordSaving}
              disabled={!newPassword || !confirmPassword || passwordSaved}
            >
              {passwordSaved ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Updated
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Timezone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Timezone
          </CardTitle>
          <CardDescription>
            Set your practice timezone for accurate availability and booking
          </CardDescription>
        </CardHeader>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <select
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value)
                setTimezoneSaved(false)
              }}
              className="w-full appearance-none px-4 py-2.5 bg-card hairline text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200 cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleTimezoneChange}
            loading={timezoneSaving}
            disabled={timezoneSaved || timezone === practice?.timezone}
          >
            {timezoneSaved ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Saved
              </>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </Card>

      {/* Connected Software */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-accent" />
            Connected Software
          </CardTitle>
          <CardDescription>
            Connect your existing practice management software for seamless sync
          </CardDescription>
        </CardHeader>
        <div className="space-y-3">
          {INTEGRATIONS.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between p-4 bg-background hairline"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <p className="text-sm font-mono text-foreground font-medium">
                    {integration.name}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {integration.description}
                  </p>
                </div>
              </div>
              <Badge variant="default">Coming Soon</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20">
          <div>
            <p className="text-sm font-mono text-foreground font-medium">
              Delete Account
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              Permanently delete your practice, data, and subscription
            </p>
          </div>
          {!showDeleteConfirm ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" size="sm" disabled>
                Contact Support
              </Button>
            </div>
          )}
        </div>
        {showDeleteConfirm && (
          <p className="text-xs font-mono text-muted-foreground mt-3">
            Account deletion requires contacting support. Please email support@practizio.com to initiate the process.
          </p>
        )}
      </Card>
    </div>
  )
}
