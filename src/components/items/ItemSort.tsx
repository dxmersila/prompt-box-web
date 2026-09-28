'use client'

import Link from 'next/link'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from '@/hooks/useTranslations'

interface ItemSortProps {
  activeSort?: 'latest' | 'oldest'
}

const options = [
  { key: 'latest', value: 'latest', icon: ArrowDown },
  { key: 'oldest', value: 'oldest', icon: ArrowUp },
] as const

export default function ItemSort({
  activeSort,
}: ItemSortProps) {
  const searchParams = useSearchParams()
  const t = useTranslations()

  const buildSortHref = (sort: 'latest' | 'oldest') => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('sort', sort)
    params.delete('page')

    return `/items?${params.toString()}`
  }

  return (
    <div className="flex w-full min-w-0 items-center rounded-xl border border-border bg-surface p-1 lg:w-fit">
      {options.map((option) => (
        <Link
          key={option.value}
          href={buildSortHref(option.value)}
          className={[
            'min-w-0 flex-1 shrink rounded-lg px-3 py-1.5 text-sm font-medium text-center transition whitespace-nowrap',
            activeSort === option.value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted hover:bg-surface-muted hover:text-foreground',
          ].join(' ')}
        >
          <div className="flex items-center justify-center gap-1">
            <option.icon className="size-3.5" />
            <span>{t(`filters.${option.key}`)}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
