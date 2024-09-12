import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { MembersTable } from './member-table'

export const metadata: Metadata = {
  title: 'Equipes',
}

export default async function MemberPage() {
  unstable_noStore()

  const { members } = await serverClient.getMembers()

  return <MembersTable members={members} />
}
