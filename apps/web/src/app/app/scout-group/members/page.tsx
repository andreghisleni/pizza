import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { MembersTable } from './members-table'

export const metadata: Metadata = {
  title: 'Membros',
}

export default async function MemberPage() {
  unstable_noStore()

  const { members } = await serverClient.getMyMembers()

  const { scoutGroup } = await serverClient.getMyScoutGroup()

  return (
    <MembersTable members={members} isSubmitted={!!scoutGroup?.submitedAt} />
  )
}
