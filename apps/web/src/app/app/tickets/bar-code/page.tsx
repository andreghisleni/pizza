import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { CheckTicket } from './check-ticket'

export const metadata: Metadata = {
  title: 'Seções',
}

export default async function TicketPage() {
  unstable_noStore()

  return <CheckTicket />
}
