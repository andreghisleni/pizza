import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { ScoutGroupsTable } from './scout-groups-table'

export const metadata: Metadata = {
  title: 'Grupos escoteiros',
}

export default async function ScoutGroupsPage() {
  unstable_noStore()

  const { scoutGroups } = await serverClient.getScoutGroups()

  return <ScoutGroupsTable scoutGroups={scoutGroups} />
}
