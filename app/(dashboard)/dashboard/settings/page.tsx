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
  Unplug,
  CreditCard,
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

const BOOKING_SYSTEM_LABELS: Record<string, string> = {
  internal: 'Internal (SpadeChat)',
  calendly: 'Calendly',
  acuity: 'Acuity Scheduling',
  square: 'Square Appointments',
  other: 'Other',
}

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

  // Booking system
  const [disconnecting, setDisconnecting] = useState(false)

  // Payment settings
  const [paymentUrl, setPaymentUrl] = useState('')
  const [defaultHoldMinutes, setDefaultHoldMinutes] = useState(30)
  const [paymentSaving, setPaymentSaving] = useState(false)
  const [paymentSaved, setPaymentSaved] = useState(false)

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
    if (data) {
      setTimezone(data.timezone)
      setPaymentUrl(data.payment_url || '')
      setDefaultHoldMinutes(data.default_hold_minutes ?? 30)
    }
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

  async function handleDisconnectBooking() {
    if (!practice) return
    setDisconnecting(true)
    await supabase
      .from('practices')
      .update({
        booking_system_type: 'internal',
        booking_system_connected: false,
      })
      .eq('id', practice.id)
    setPractice({
      ...practice,
      booking_system_type: 'internal',
      booking_system_connected: false,
    })
    setDisconnecting(false)
  }

  async function handlePaymentSettingsSave() {
    if (!practice) return
    setPaymentSaving(true)
    await supabase
      .from('practices')
      .update({
        payment_url: paymentUrl || null,
        default_hold_minutes: defaultHoldMinutes,
      })
      .eq('id', practice.id)
    setPractice({
      ...practice,
      payment_url: paymentUrl || null,
      default_hold_minutes: defaultHoldMinutes,
    })
    setPaymentSaved(true)
    setTimeout(() => setPaymentSaved(false), 3000)
    setPaymentSaving(false)
  }

  const bookingSystemType = practice?.booking_system_type || 'internal'
  const bookingLabel = BOOKING_SYSTEM_LABELS[bookingSystemType] || 'Internal (SpadeChat)'
  const isExternalSystem = bookingSystemType !== 'internal' && bookingSystemType !== null
  const isConnected = practice?.booking_system_connected ?? false

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="mono-label-sm opacity-40">LOADING SETTINGS</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl w-full">
      {/* Page Header */}
      <div>
        <span className="mono-label-sm opacity-40 block mb-3">ACCOUNT CONFIG</span>
        <h1 className="font-display font-black uppercase text-3xl tracking-tightest">SETTINGS</h1>
        <p className="font-sans text-sm font-light opacity-50 mt-2">
          Manage your account and business preferences
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
        <div className="px-6 pb-6">
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
        <div className="px-6 pb-6 space-y-4">
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
            Set your business timezone for accurate availability and booking
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <select
                value={timezone}
                onChange={(e) => {
                  setTimezone(e.target.value)
                  setTimezoneSaved(false)
                }}
                className="w-full appearance-none px-4 py-2.5 bg-transparent text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all duration-200 cursor-pointer rounded-lg"
                style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
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
        </div>
      </Card>

      {/* Booking System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-accent" />
            Booking System
          </CardTitle>
          <CardDescription>
            Manage your connected booking system for scheduling and appointments
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="p-4 bg-white/[0.02] rounded-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-mono text-foreground font-medium">
                    {bookingLabel}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {isExternalSystem ? (
                      isConnected ? (
                        <Badge variant="success">Connected</Badge>
                      ) : (
                        <Badge variant="warning">Not Connected</Badge>
                      )
                    ) : (
                      <Badge variant="accent">Built-in</Badge>
                    )}
                  </div>
                </div>
              </div>
              {isExternalSystem && isConnected && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDisconnectBooking}
                  loading={disconnecting}
                >
                  <Unplug className="w-4 h-4 mr-1.5" />
                  Disconnect
                </Button>
              )}
            </div>
            <p className="text-xs font-mono text-white/30 mt-3">
              To change your booking system, re-run the setup flow from your onboarding settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Payment Settings
          </CardTitle>
          <CardDescription>
            Configure payment links and hold times for deposit-required services
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-4">
          <Input
            id="payment-url"
            label="Payment URL"
            type="text"
            placeholder="https://pay.stripe.com/... or PayPal.me/..."
            value={paymentUrl}
            onChange={(e) => {
              setPaymentUrl(e.target.value)
              setPaymentSaved(false)
            }}
          />
          <Input
            id="default-hold-minutes"
            label="Default Hold Time (minutes)"
            type="number"
            placeholder="30"
            value={defaultHoldMinutes}
            onChange={(e) => {
              setDefaultHoldMinutes(parseInt(e.target.value) || 0)
              setPaymentSaved(false)
            }}
          />
          <div className="p-4 bg-white/[0.02] rounded-lg" style={{ border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-foreground font-medium">Stripe Connect</p>
                <p className="text-xs font-mono text-white/30 mt-1">
                  Coming soon — connect your Stripe account to auto-generate payment links for AI bookings
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Connect Stripe Account
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handlePaymentSettingsSave}
              loading={paymentSaving}
              disabled={paymentSaved}
            >
              {paymentSaved ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Saved
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="!border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div>
              <p className="text-sm font-mono text-foreground font-medium">
                Delete Account
              </p>
              <p className="text-xs font-mono text-muted-foreground">
                Permanently delete your business, data, and subscription
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
              Account deletion requires contacting support. Please email support@spadechat.com to initiate the process.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
