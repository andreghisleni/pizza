'use client'

import { useRouter } from 'next/navigation'

import { ResponsibleForm } from './responsible-form'

export function ResponsibleFormPage() {
  const router = useRouter()

  async function handleCreateResponsible() {
    try {
      router.push(`/app/scout-group?t=${new Date().getTime()}`)
    } catch (error) {
      console.error(error)
    }
  }
  return <ResponsibleForm refetch={() => handleCreateResponsible()} />
}
