import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'
import { QueryProvider } from '@/providers/query-provider'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Tecca',
  description: 'Tecca SaaS platform',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang='en' className={cn('font-sans', geist.variable)}>
      <body className='bg-background text-foreground antialiased'>
        {/* `isolate` creates a stacking context so Base UI portalled popups render above the app. */}
        <div className='isolate flex min-h-svh flex-col'>
          <QueryProvider>{children}</QueryProvider>
        </div>
      </body>
    </html>
  )
}
