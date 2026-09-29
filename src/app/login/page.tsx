'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Lock, LogIn, Mail, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslations } from '@/hooks/useTranslations'
import Button from '@/components/ui/Button'
import {
  getAuthSwitchUrl,
  getSafeReturnTo,
} from '@/lib/auth/redirect'
import { resendVerification } from '@/lib/api/authService'
import { ApiRequestError } from '@/lib/api/client'

export default function LoginPage() {
  const router = useRouter()
  const { login, status } = useAuth()
  const t = useTranslations()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendMessage, setResendMessage] = useState('')
  const [resendError, setResendError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [registerUrl, setRegisterUrl] = useState('/register')
  const [isEmailNotVerified, setIsEmailNotVerified] = useState(false)

  useEffect(() => {
    const returnTo = getSafeReturnTo(
      new URLSearchParams(window.location.search).get('returnTo'),
    )

    setRegisterUrl(getAuthSwitchUrl('/register'))

    if (status === 'authenticated') {
      router.replace(returnTo)
    }
  }, [router, status])

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setResendCooldown((value) => Math.max(0, value - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendCooldown])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsEmailNotVerified(false)
    setResendMessage('')
    setResendError('')
    setIsSubmitting(true)

    try {
      await login({ email, password })

      const returnTo = getSafeReturnTo(
        new URLSearchParams(window.location.search).get('returnTo'),
      )

      router.push(returnTo)
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        error.code === 'email_not_verified'
      ) {
        setIsEmailNotVerified(true)
      } else {
        setError(t('auth.loginFailed'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResendVerification() {
    if (resendCooldown > 0 || isResending) {
      return
    }

    setResendMessage('')
    setResendError('')
    setIsResending(true)

    try {
      await resendVerification(email)
      setResendMessage('auth.verificationResent')
      setResendCooldown(60)
    } catch {
      setResendError('auth.resendVerificationFailed')
    } finally {
      setIsResending(false)
    }
  }

  if (status === 'loading' || status === 'authenticated') {
    return null
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_65%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="relative overflow-hidden rounded-[28px] border border-border bg-surface/95 shadow-[0_30px_90px_-45px_rgba(124,58,237,0.55)] backdrop-blur-sm"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_70%)]" />

          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_12px_35px_-18px_rgba(124,58,237,0.75)]">
                <LogIn className="size-6 rtl:rotate-180" />
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t('auth.login')}
              </h1>

              <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                {t('auth.loginDescription')}
              </p>
            </div>

            <div className="mt-8 space-y-5">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">
                  {t('auth.email')}
                </span>

                <div className="relative">
                  <Mail className="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-muted" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-border bg-surface-muted px-3.5 ps-10 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">
                  {t('auth.password')}
                </span>

                <div className="relative">
                  <Lock className="pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4 text-muted" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="h-12 w-full rounded-xl border border-border bg-surface-muted px-3.5 ps-10 pe-11 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={t('auth.togglePassword')}
                    className="absolute inset-y-0 end-2 flex size-8 my-auto cursor-pointer items-center justify-center rounded-lg text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </label>

              {isEmailNotVerified && (
                <div className="space-y-4 rounded-2xl border border-border bg-surface-muted px-4 py-5 text-center">
                  <p
                    role="alert"
                    className="text-sm font-medium leading-6 text-foreground"
                  >
                    {t('auth.emailNotVerified')}
                  </p>

                  <p className="mx-auto max-w-sm text-justify text-sm leading-6 text-muted">
                    {t('auth.emailVerificationDescription')}
                  </p>

                  {resendMessage && (
                    <p role="status" className="text-sm text-success">
                      {t(resendMessage)}
                    </p>
                  )}

                  {resendError && (
                    <p role="alert" className="text-sm text-destructive">
                      {t(resendError)}
                    </p>
                  )}

                  <Button
                    type="button"
                    isLoading={isResending}
                    disabled={resendCooldown > 0}
                    onClick={handleResendVerification}
                  >
                    {resendCooldown > 0
                      ? t('auth.resendVerificationCountdown').replace(
                          '{seconds}',
                          String(resendCooldown),
                        )
                      : t('auth.resendVerification')}
                  </Button>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm leading-6 text-red-500"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                {t('auth.login')}
              </Button>

              <p className="text-center text-sm text-muted">
                {t('auth.noAccount')}{' '}
                <Link
                  href={registerUrl}
                  className="font-medium text-primary transition hover:opacity-80"
                >
                  <UserPlus className="me-1 inline size-4 align-[-2px]" />
                  {t('auth.createAccount')}
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
