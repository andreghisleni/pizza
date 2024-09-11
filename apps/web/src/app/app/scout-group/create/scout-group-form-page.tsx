'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { ScoutGroupForm } from './scout-group-form'

export function ScoutGroupFormPage() {
  const { update, data } = useSession()
  const router = useRouter()

  async function handleCreateScoutGroup(id) {
    try {
      await update({
        ...data,
        user: { ...data?.user, scoutGroupId: id },
      })

      router.push(`/app/scout-group?t=${new Date().getTime()}`)
    } catch (error) {
      console.error(error)
    }
  }
  return <ScoutGroupForm refetch={(data) => handleCreateScoutGroup(data.id)} />
}
