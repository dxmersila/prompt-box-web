'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/components/auth/AuthProvider'
import { useCart } from '@/components/cart/CartProvider'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import {
  createItemOrder,
  getOrder,
} from '@/lib/api/orderService'
import {
  createPayment,
  initiatePayment,
} from '@/lib/api/paymentService'
import { getToken } from '@/lib/api/token'
import type { Order } from '@/types/order'
import { useLocale } from '@/hooks/useLocale'
import { useTranslations } from '@/hooks/useTranslations'
import { getLoginUrl } from '@/lib/auth/redirect'
import { formatNumber } from '@/lib/format/number'

export default function CheckoutPage() {
  const router = useRouter()
  const t = useTranslations()
  const { locale } = useLocale()
  const { status } = useAuth()
  const { items, total, itemCount, isHydrated } = useCart()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [paymentId, setPaymentId] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'guest') {
      router.replace(getLoginUrl())
    }
  }, [router, status])

  const formattedTotal = formatNumber(total, locale)

  async function handleCreateOrder() {
    const token = getToken()

    if (!token || items.length === 0) {
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const response = await createItemOrder(
        items.map((item) => item.id),
        token,
      )

      setOrder(response.data)
    } catch {
      setError(t('checkout.createOrderFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleContinueToPayment() {
    if (!order) {
      return
    }

    const token = getToken()

    if (!token) {
      router.replace(getLoginUrl())
      return
    }

    setError('')
    setIsPaying(true)

    try {
      let currentPaymentId = paymentId

      if (!currentPaymentId) {
        const orderResponse = await getOrder(order.id, token)

        const pendingPayment = orderResponse.data.payments?.find(
          (payment) => payment.status === 'pending',
        )

        if (pendingPayment) {
          currentPaymentId = pendingPayment.id
        } else {
          const paymentResponse = await createPayment(order.id, token)
          currentPaymentId = paymentResponse.data.id
        }

        setPaymentId(currentPaymentId)
      }

      const initiationResponse = await initiatePayment(
        currentPaymentId,
        token,
      )

      if (!initiationResponse.data.redirect_url) {
        throw new Error('Missing payment redirect URL')
      }

      window.location.assign(initiationResponse.data.redirect_url)
    } catch {
      setError(t('checkout.paymentFailed'))
      setIsPaying(false)
    }
  }

  if (status === 'loading' || status === 'guest' || !isHydrated) {
    return null
  }

  if (items.length === 0 && !order) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title={t('cart.emptyTitle')}
        description={t('cart.emptyDescription')}
        action={
          <Link
            href="/cart"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
          >
            {t('checkout.backToCart')}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        }
      />
    )
  }

  if (order) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-3xl items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <section className="relative w-full overflow-hidden rounded-3xl border border-border bg-surface px-6 py-10 text-center shadow-[0_20px_70px_-45px_rgba(124,58,237,0.45)] sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_40%)]" />

          <div className="relative">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Lock className="size-6" />
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t('checkout.orderCreated')}
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              {t('checkout.orderCreatedDescription')}
            </p>

            <div className="mx-auto mt-6 flex w-full max-w-sm items-center justify-between rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm">
              <span className="text-muted">
                {t('checkout.orderNumber')}
              </span>

              <span className="font-semibold tabular-nums text-foreground">
                #{order.id}
              </span>
            </div>

            {error && (
              <p
                role="alert"
                className="mx-auto mt-5 max-w-sm rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm leading-6 text-red-500"
              >
                {error}
              </p>
            )}

            <Button
              type="button"
              onClick={handleContinueToPayment}
              isLoading={isPaying}
              className="mt-6 px-5 gap-2"
            >
              {t('checkout.continuePayment')}
            </Button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t('checkout.title')}
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted">
          {t('checkout.description')}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold text-foreground">
              {t('checkout.products')}
            </h2>
          </div>

          <div className="divide-y divide-border">
            {items.map((item) => {
              const formattedPrice = formatNumber(item.price, locale)

              return (
                <article
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-5 sm:px-6"
                >
                  <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted">
                        <ShoppingCart className="size-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      {t('cart.oneTime')}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                    {formattedPrice}
                    <span className="ms-1 text-xs font-normal text-muted">
                      {t('item.toman')}
                    </span>
                  </span>
                </article>
              )
            })}
          </div>
        </section>

        <aside className="h-fit overflow-hidden rounded-3xl border border-border bg-surface">
          <div className="px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold text-foreground">
              {t('checkout.summary')}
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-muted">
                  {itemCount} {t('cart.itemsCount')}
                </span>

                <span className="font-medium text-foreground">
                  {formattedTotal}
                  <span className="ms-1 text-xs font-normal text-muted">
                    {t('item.toman')}
                  </span>
                </span>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-foreground">
                  {t('cart.total')}
                </span>

                <span className="text-lg font-semibold tabular-nums text-foreground">
                  {formattedTotal}
                  <span className="ms-1 text-xs font-normal text-muted">
                    {t('item.toman')}
                  </span>
                </span>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-3 text-sm leading-6 text-red-500"
              >
                {error}
              </p>
            )}

            <Button
              type="button"
              onClick={handleCreateOrder}
              isLoading={isSubmitting}
              className="mt-6 px-5 gap-2"
            >
              {t('checkout.createOrder')}
            </Button>

            <Link
              href="/cart"
              className="mt-3 flex h-10 items-center justify-center rounded-xl text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              {t('checkout.backToCart')}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
