'use client'

import { RouterOutput } from '@pizza/trpc'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc/react'

import { ResponsibleForm } from '../create/responsible/responsible-form'
import { ResponsibleFormDialog } from '../create/responsible/responsible-form-with-dialog'
import { ScoutGroupForm } from '../create/scout-group-form'
import { ScoutGroupFormDialog } from '../create/scout-group-form-with-dialog'

type ScoutGroup = RouterOutput['getMyScoutGroup']['scoutGroup']

export function Info({ scoutGroup: sg }: { scoutGroup: ScoutGroup }) {
  if (!sg) {
    return null
  }

  const { data, refetch } = trpc.getMyScoutGroup.useQuery()

  const scoutGroup = data?.scoutGroup

  if (!scoutGroup) {
    return null
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Card className="w-full max-w-[500px]">
        <CardHeader className="space-y-4">
          <Link href="/app/scout-group" className="flex gap-4">
            <ArrowLeft /> Voltar
          </Link>
          <CardTitle>Dados do grupo escoteiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ScoutGroupForm viewOnly scoutGroup={scoutGroup as any/*eslint-disable-line*/} />
          {!scoutGroup.submitedAt && (
            <ScoutGroupFormDialog scoutGroup={scoutGroup} refetch={refetch} />
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Dados do responsável do grupo escoteiro</CardTitle>
        </CardHeader>
        <CardContent>
          {scoutGroup.responsible ? (
            <>
              <ResponsibleForm viewOnly responsible={scoutGroup.responsible} />
              {!scoutGroup.submitedAt && (
                <ResponsibleFormDialog
                  responsible={scoutGroup.responsible}
                  refetch={refetch}
                />
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl">Responsável não cadastrado</h2>
              <Button variant="outline" asChild>
                <Link href="/app/scout-group/create/responsible">
                  Cadastrar responsável
                </Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
