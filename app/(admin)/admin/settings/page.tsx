'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, Check, Settings as SettingsIcon } from 'lucide-react'

export default function AdminSettingsPage() {
  const supabase = createClient()

  // Email form
  const [newEmail, setNewEmail] = useState('')
  const [emailSaving, setEmailSaving] = useState(false)
  const [emailSaved, setEmailSaved] = useState(false)
  const [emailError, setEmailError] = useState('')

  // Password form
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  async function handleEmailChange() {
    if (!newEmail.trim()) return
    setEmailSaving(true)
    setEmailError('')
    const { error } = await supabase.auth.updateUser({ email: newEmail })
    if (!error) {
      setEmailSaved(true)
      setNewEmail('')
      setTimeout(() => setEmailSaved(false), 3000)
    } else {
      setEmailError(error.message)
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

  return (
    <div className="space-y-8 max-w-4xl w-full">
      {/* Page Header */}
      <div>
        <span className="block mb-3 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>ADMIN CONFIG</span>
        <h1 className="text-3xl flex items-center gap-3 text-[var(--foreground)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
          <SettingsIcon className="w-8 h-8 text-[var(--primary-accent)]" />
          Settings
        </h1>
        <p className="text-sm mt-2 text-[var(--muted-text)]" style={{ fontFamily: "'Space Mono', monospace" }}>
          Manage your admin account credentials
        </p>
      </div>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[var(--primary-accent)]" />
            Email Address
          </CardTitle>
          <CardDescription>
            Update your admin account email. A confirmation will be sent to the new address.
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="admin-new-email"
                type="email"
                placeholder="new@email.com"
                value={newEmail}
                onChange={(e) => {
                  setNewEmail(e.target.value)
                  setEmailError('')
                }}
                error={emailError}
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
            <Lock className="w-5 h-5 text-[var(--primary-accent)]" />
            Password
          </CardTitle>
          <CardDescription>
            Set a new password for your admin account
          </CardDescription>
        </CardHeader>
        <div className="px-6 pb-6 space-y-4">
          <Input
            id="admin-new-password"
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
            id="admin-confirm-password"
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
    </div>
  )
}
