'use client'

import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function Logo() {
  const t = useTranslations()

  return (
    <Link
      href="/"
      className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-lg font-bold text-primary sm:gap-2 sm:text-xl"
    >
      <span>{t('common.appName')}</span>
      <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold leading-none tracking-wider text-primary">
        BETA
      </span>
    </Link>
  )
}
