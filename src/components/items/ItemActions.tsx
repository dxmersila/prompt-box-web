'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  LockOpen,
  ShoppingCart,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

import type { Item } from '@/types/item'
import { useAuth } from '@/components/auth/AuthProvider'
import { useLocale } from '@/hooks/useLocale'
import { useTranslations } from '@/hooks/useTranslations'
import { useCart } from '@/components/cart/CartProvider'
import {
  claimFreeItem,
  getItemAccess,
} from '@/lib/api/itemAccessService'
import { getToken } from '@/lib/api/token'
import { getLoginUrl } from '@/lib/auth/redirect'
import { formatNumber } from '@/lib/format/number'

interface ItemActionsProps {
  item: Item
}

export default function ItemActions({ item }: ItemActionsProps) {
  const router = useRouter()
  const t = useTranslations()
  const { locale } = useLocale()
  const { status } = useAuth()
  const { addItem, hasItem } = useCart()

  const isFree = item.access_type === 'free'
  const isInCart = hasItem(item.id)

  const [hasAccess, setHasAccess] = useState(false)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)

  useEffect(() => {
    if (status !== 'authenticated') {
      setHasAccess(false)
      setIsCheckingAccess(false)
      return
    }

    const token = getToken()

    if (!token) {
      setHasAccess(false)
      setIsCheckingAccess(false)
      return
    }

    let isCurrent = true

    setIsCheckingAccess(true)

    getItemAccess(item.slug, token)
      .then(() => {
        if (isCurrent) {
          setHasAccess(true)
        }
      })
      .catch(() => {
        if (isCurrent) {
          setHasAccess(false)
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsCheckingAccess(false)
        }
      })

    return () => {
      isCurrent = false
    }
  }, [item.slug, status])

  const formattedPrice = formatNumber(item.price, locale)

  return (
    <section className="border-t border-border pt-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted">
          {t('item.access')}
        </span>

        <span className="text-sm font-medium text-foreground">
          {isFree ? t('item.free') : t('item.paid')}
        </span>
      </div>

      {!isFree && (
        <div className="mb-4 text-right">
          <span className="text-xl font-semibold tabular-nums text-foreground">
            {formattedPrice}
          </span>

          <span className="ms-1 text-sm text-muted">
            {t('item.toman')}
          </span>
        </div>
      )}

      {hasAccess ? (
        <Link
          href={`/items/${encodeURIComponent(item.slug)}/content`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
        >
          <LockOpen className="size-4" />
          {t('item.usePrompt')}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      ) : isInCart && !isFree ? (
        <Link
          href="/cart"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
        >
          <Check className="size-4" />
          {t('item.inCart')}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <button
          type="button"
          disabled={isCheckingAccess || isClaiming}
          onClick={async () => {
            if (isFree) {
              if (status !== 'authenticated') {
                router.replace(getLoginUrl())
                return
              }

              const token = getToken()

              if (!token) {
                router.replace(getLoginUrl())
                return
              }

              try {
                setIsClaiming(true)
                await claimFreeItem(item.slug, token)
                setHasAccess(true)
                router.push(
                  `/items/${encodeURIComponent(item.slug)}/content`,
                )
              } catch {
                setHasAccess(false)
              } finally {
                setIsClaiming(false)
              }

              return
            }

            addItem(item)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85 disabled:cursor-default disabled:opacity-70"
        >
          {isCheckingAccess || isClaiming ? (
            <span>{t('item.access')}</span>
          ) : isFree ? (
            <>
              <LockOpen className="size-4" />
              {t('item.getPrompt')}
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              {t('item.addToCart')}
            </>
          )}
        </button>
      )}
    </section>
  )
}
