'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { useTranslations } from '@/hooks/useTranslations'

interface PaginationProps {
  currentPage: number
  lastPage: number
  category?: string
  search?: string
  sort?: 'latest' | 'oldest'
  accessType?: 'free' | 'paid'
}

export default function Pagination({
  currentPage,
  lastPage,
  category,
  search,
  sort,
  accessType,
}: PaginationProps) {
  const t = useTranslations()

  if (lastPage <= 1) {
    return null
  }

  const buildHref = (page: number) => {
    const searchParams = new URLSearchParams()

    if (category) {
      searchParams.set('category', category)
    }

    if (search) {
      searchParams.set('search', search)
    }

    if (sort) {
      searchParams.set('sort', sort)
    }

    if (accessType) {
      searchParams.set('access_type', accessType)
    }

    searchParams.set('page', String(page))

    return `/items?${searchParams.toString()}`
  }

  return (
    <nav
      aria-label={t('common.pagination')}
      className="mt-10 flex items-center justify-center gap-2"
    >
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:border-foreground/20 hover:text-foreground"
          aria-label={t('orders.previous')}
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface-muted text-muted/40"
          aria-hidden="true"
        >
          <ChevronLeft className="size-4 rtl:rotate-180" />
        </span>
      )}

      {Array.from({ length: lastPage }, (_, index) => index + 1).map(
        (page) =>
          page === currentPage ? (
            <span
              key={page}
              aria-current="page"
              className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground"
            >
              {page}
            </span>
          ) : (
            <Link
              key={page}
              href={buildHref(page)}
              className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
            >
              {page}
            </Link>
          ),
      )}

      {currentPage < lastPage ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface text-muted transition hover:border-foreground/20 hover:text-foreground"
          aria-label={t('orders.next')}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface-muted text-muted/40"
          aria-hidden="true"
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
        </span>
      )}
    </nav>
  )
}
