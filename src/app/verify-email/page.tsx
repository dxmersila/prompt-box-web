'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, MailCheck, XCircle } from 'lucide-react'

import { verifyEmail } from '@/lib/api/authService'
import { useTranslations } from '@/hooks/useTranslations'
import Button from '@/components/ui/Button'

type VerificationStatus = 'loading' | 'success' | 'error'

export default function VerifyEmailPage() {
  const t = useTranslations()
  const [status, setStatus] = useState<VerificationStatus>('loading')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fragment = new URLSearchParams(window.location.hash.slice(1))

    const id = fragment.get('id')
    const hash = params.get('hash')
    const expires = params.get('expires')
    const signature = params.get('signature')

    if (!id || !hash || !expires || !signature) {
      setStatus('error')
      return
    }

    verifyEmail(id, hash, expires, signature)
      .then(() => {
        setStatus('success')
      })
      .catch(() => {
        setStatus('error')
      })
  }, [])

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_65%)]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-surface/95 shadow-[0_30px_90px_-45px_rgba(124,58,237,0.55)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_70%)]" />

          <div className="relative px-6 py-10 text-center sm:px-8">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-[0_12px_35px_-18px_rgba(124,58,237,0.75)]">
              {status === 'loading' && <MailCheck className="size-6" />}
              {status === 'success' && <CheckCircle2 className="size-6 text-success" />}
              {status === 'error' && <XCircle className="size-6 text-destructive" />}
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {status === 'loading'
                ? t('auth.verifyEmailTitle')
                : status === 'success'
                  ? t('auth.verifyEmailSuccessTitle')
                  : t('auth.verifyEmailFailedTitle')}
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted">
              {status === 'loading'
                ? t('auth.verifyEmailLoading')
                : status === 'success'
                  ? t('auth.verifyEmailSuccessDescription')
                  : t('auth.verifyEmailFailedDescription')}
            </p>

            {status === 'success' && (
              <Link
                href="/login"
                className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                {t('auth.verifyEmailLogin')}
              </Link>
            )}

            {status === 'error' && (
              <Link href="/register" className="mt-8 block">
                <Button type="button">
                  {t('auth.verifyEmailRegister')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
