import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { TicketsTable } from './ticket-table'

export const metadata: Metadata = {
  title: 'Seções',
}

export default async function TicketPage() {
  unstable_noStore()

  const { tickets } = await serverClient.getTicketsAfterImport()

  return <TicketsTable tickets={tickets} />
}
