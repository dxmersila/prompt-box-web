'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { Category } from '@/types/category'
import { useTranslations } from '@/hooks/useTranslations'

interface ItemFiltersProps {
  categories: Category[]
  activeCategory?: string
}

export default function ItemFilters({
  categories,
  activeCategory,
}: ItemFiltersProps) {
  const searchParams = useSearchParams()
  const t = useTranslations()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const buildCategoryHref = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }

    params.delete('page')

    const query = params.toString()

    return `/items${query ? `?${query}` : ''}`
  }

  const updateScrollState = () => {
    const element = scrollRef.current

    if (!element) {
      return
    }

    setCanScrollLeft(element.scrollLeft > 0)
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    )
  }

  useEffect(() => {
    updateScrollState()

    const element = scrollRef.current

    if (!element) {
      return
    }

    element.addEventListener('scroll', updateScrollState)
    window.addEventListener('resize', updateScrollState)

    return () => {
      element.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [categories])

  const scrollCategories = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -240 : 240,
      behavior: 'smooth',
    })
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll categories left"
          onClick={() => scrollCategories('left')}
          className="flex shrink-0 rounded-full border border-border bg-surface p-2 text-muted transition hover:border-foreground/20 hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
        </button>
      )}

      <div
        ref={scrollRef}
        className="category-scrollbar min-w-0 flex-1 overflow-x-auto"
      >
        <div className="flex min-w-max items-center gap-1">
          <Link
            href={buildCategoryHref('')}
            className={[
              'shrink-0 rounded-full border px-2.5 py-2 text-sm font-medium transition lg:px-2',
              !activeCategory
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground',
            ].join(' ')}
          >
            {t('filters.all')}
          </Link>

          {categories.map((category) => (
            <Link
              key={category.id}
              href={buildCategoryHref(category.slug)}
              className={[
                'shrink-0 rounded-full border px-2.5 py-2 text-sm font-medium transition lg:px-2',
                activeCategory === category.slug
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-surface text-muted hover:border-foreground/20 hover:text-foreground',
              ].join(' ')}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll categories right"
          onClick={() => scrollCategories('right')}
          className="flex shrink-0 rounded-full border border-border bg-surface p-2 text-muted transition hover:border-foreground/20 hover:text-foreground"
        >
          <ChevronRight className="size-4" />
        </button>
      )}
    </div>
  )
}
