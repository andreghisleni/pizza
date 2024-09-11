import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import { redirect } from 'next/navigation'

import { serverClient } from '@/lib/trpc/server'

import { Info } from './info'

export const metadata: Metadata = {
  title: 'Dados do grupo escoteiro',
}

export const revalidate = 10

export default async function ScoutGroupDataPage() {
  unstable_noStore()

  const { scoutGroup } = await serverClient.getMyScoutGroup()

  if (!scoutGroup) {
    redirect('/app/scout-group/create')
  }

  return <Info scoutGroup={scoutGroup} />
}
