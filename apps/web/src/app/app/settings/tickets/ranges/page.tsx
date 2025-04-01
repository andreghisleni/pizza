import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { TicketRangesTable } from './ticket-range-table'

export const metadata: Metadata = {
  title: 'Equipes',
}

export default async function TicketRangesPage() {
  unstable_noStore()

  const { members } = await serverClient.getMembers()

  return <TicketRangesTable members={members} />
}
