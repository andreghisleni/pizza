import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'

import { serverClient } from '@/lib/trpc/server'

import { MemberData } from './member-data'

export const metadata: Metadata = {
  title: 'Membro',
}

export default async function MemberPage({
  params,
}: {
  params: { id: string }
}) {
  unstable_noStore()

  const { member } = await serverClient.getMember({ id: params.id })

  if (!member) {
    return <div className="text-red-500">Membro não encontrado</div>
  }

  return <MemberData member={member} />
}
