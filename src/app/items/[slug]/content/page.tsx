'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Copy, LockOpen, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/auth/AuthProvider'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { getItemContent } from '@/lib/api/itemContentService'
import { getToken } from '@/lib/api/token'
import { useTranslations } from '@/hooks/useTranslations'
import { getLoginUrl } from '@/lib/auth/redirect'

interface ItemContentPageProps {
  params: Promise<{
    slug: string
  }>
}

type ContentState = 'loading' | 'ready' | 'error'

export default function ItemContentPage({
  params,
}: ItemContentPageProps) {
  const router = useRouter()
  const t = useTranslations()
  const { status } = useAuth()

  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [state, setState] = useState<ContentState>('loading')
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (status === 'guest') {
      router.replace(getLoginUrl())
      return
    }

    if (status !== 'authenticated') {
      return
    }

    const token = getToken()

    if (!token) {
      router.replace(getLoginUrl())
      return
    }

    let isCurrent = true

    params
      .then(({ slug: routeSlug }) => {
        if (!isCurrent) {
          return
        }

        const decodedSlug = decodeURIComponent(routeSlug)

        setSlug(decodedSlug)

        return getItemContent(decodedSlug, token)
      })
      .then((response) => {
        if (!isCurrent || !response) {
          return
        }

        setContent(response.content)
        setState('ready')
      })
      .catch(() => {
        if (isCurrent) {
          setState('error')
        }
      })

    return () => {
      isCurrent = false
    }
  }, [params, router, status])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)

      window.setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch {
      setIsCopied(false)
    }
  }

  if (status === 'loading' || status === 'guest') {
    return null
  }

  if (state === 'loading') {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex items-center gap-3 text-sm text-muted">
          <LoadingSpinner />
          {t('item.loadingContent')}
        </div>
      </main>
    )
  }

  if (state === 'error') {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <section className="w-full max-w-lg rounded-3xl border border-border bg-surface px-6 py-10 text-center shadow-[0_20px_70px_-45px_rgba(124,58,237,0.45)] sm:px-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500">
            <XCircle className="size-6" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
            {t('item.contentUnavailable')}
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
            {t('item.contentUnavailableDescription')}
          </p>

          {slug && (
            <Link
              href={`/items/${encodeURIComponent(slug)}`}
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              {t('item.backToItem')}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8">
        {slug && (
          <Link
            href={`/items/${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
          >
            <ArrowRight className="size-4 rotate-180 rtl:rotate-0" />
            {t('item.backToItem')}
          </Link>
        )}

        <div className="mt-6 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <LockOpen className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t('item.contentTitle')}
            </h1>

            <p className="mt-1 text-sm text-muted">
              {t('item.contentDescription')}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-border bg-surface p-6 shadow-[0_20px_70px_-45px_rgba(124,58,237,0.45)] sm:p-8">
        <div className="mb-5 flex items-center justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-medium text-foreground transition hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            aria-label={t(isCopied ? 'item.copiedPrompt' : 'item.copyPrompt')}
          >
            {isCopied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {t(isCopied ? 'item.copiedPrompt' : 'item.copyPrompt')}
          </button>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-7 text-foreground sm:text-base">
          {content}
        </div>
      </section>
    </main>
  )
}
