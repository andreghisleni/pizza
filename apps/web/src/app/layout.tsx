import './globals.css'

import { env } from '@pizza/env'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'
import { Toaster as T2 } from '@/components/ui/toaster'

import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    template: '%s | Pizza extra',
    absolute: 'Pizza extra',
  },
  description: 'Pizza extra.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className={inter.variable} suppressHydrationWarning>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {env.NODE_ENV === 'production' && (
        <script
          defer
          data-domain="pizza.gexapeco.com"
          src="https://analytics.andreg.com.br/js/script.js"
        ></script>
      )}

      <body className="overflow-y-hidden antialiased">
        <Providers>
          {children}

          <Toaster />
          <T2 />
        </Providers>
      </body>
    </html>
  )
}
