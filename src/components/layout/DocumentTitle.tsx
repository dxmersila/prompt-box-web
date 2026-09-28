'use client'

import { useEffect } from 'react'

import { useLocale } from '@/hooks/useLocale'

export default function DocumentTitle() {
  const { locale } = useLocale()

  useEffect(() => {
    document.title = locale === 'fa' ? 'پرامت باکس' : 'Prompt Box'
  }, [locale])

  return null
}
