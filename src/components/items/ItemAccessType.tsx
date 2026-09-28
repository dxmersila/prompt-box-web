'use client'

import Link from 'next/link'
import { Gift, Layers3, LockKeyhole } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

import { useTranslations } from '@/hooks/useTranslations'

interface ItemAccessTypeProps {
  activeAccessType?: 'free' | 'paid'
}

const options = [
  { key: 'all', value: '', icon: Layers3 },
  { key: 'free', value: 'free', icon: Gift },
  { key: 'paid', value: 'paid', icon: LockKeyhole },
] as const

export default function ItemAccessType({
  activeAccessType,
}: ItemAccessTypeProps) {
  const searchParams = useSearchParams()
  const t = useTranslations()

  const buildHref = (accessType: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (accessType) {
      params.set('access_type', accessType)
    } else {
      params.delete('access_type')
    }

    params.delete('page')

    const query = params.toString()

    return `/items${query ? `?${query}` : ''}`
  }

  return (
    <div className="flex min-w-0 items-center rounded-xl border border-border bg-surface p-1">
      {options.map((option) => {
        const isActive =
          option.value === ''
            ? !activeAccessType
            : activeAccessType === option.value

        return (
          <Link
            key={option.key}
            href={buildHref(option.value)}
            className={[
              'min-w-0 flex-1 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted hover:bg-surface-muted hover:text-foreground',
            ].join(' ')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <option.icon className="size-3.5" />
              <span>{t(`filters.${option.key}`)}</span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
