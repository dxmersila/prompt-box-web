'use client'

import ThemeProvider from './ThemeProvider'
import DocumentTitle from '@/components/layout/DocumentTitle'
import I18nProvider from '@/i18n/I18nProvider'
import { LocaleProvider } from '@/i18n/LocaleProvider'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { CartProvider } from '@/components/cart/CartProvider'

export default function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <DocumentTitle />
        <I18nProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </I18nProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
