import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { SessionsTable } from './session-table'

export const metadata: Metadata = {
  title: 'Equipes',
}

export default async function SessionPage() {
  unstable_noStore()

  const { sessions } = await serverClient.getSessions()

  return <SessionsTable sessions={sessions} />
}
