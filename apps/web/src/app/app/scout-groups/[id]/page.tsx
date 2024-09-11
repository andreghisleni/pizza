import { ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { serverClient } from '@/lib/trpc/server'

import { ResponsibleForm } from '../../scout-group/create/responsible/responsible-form'
import { ScoutGroupForm } from '../../scout-group/create/scout-group-form'
import { MItem } from './member'

export const metadata: Metadata = {
  title: 'Dados do grupo escoteiro',
}

export const revalidate = 10

const propsSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  // searchParams: z.object({

  // }),
})

export default async function ScoutGroupDataPage(
  props: z.infer<typeof propsSchema>,
) {
  unstable_noStore()

  const p = propsSchema.safeParse(props)

  if (!p.success) {
    redirect('/app/scout-groups')
  }
  const {
    params: { id },
  } = p.data

  const { scoutGroup } = await serverClient.getScoutGroup(id)

  if (!scoutGroup) {
    redirect('/app/scout-groups')
  }

  const membersDonation = scoutGroup.members.filter(
    (member) => member.type === 'DONATION',
  )

  const membersWithOutAlimentation = scoutGroup.members.filter(
    (member) => member.type === 'WITHOUT_ALIMENTATION',
  )

  const membersWithAlimentation = scoutGroup.members.filter(
    (member) => member.type === 'WITH_ALIMENTATION',
  )

  return (
    <Tabs defaultValue="data" className="mx-auto">
      <TabsList>
        <TabsTrigger value="data">Dados do grupo escoteiro</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
      </TabsList>
      <TabsContent value="data">
        <div className="flex w-full flex-col items-center gap-4">
          <Card className="w-full max-w-[500px]">
            <CardHeader className="space-y-4">
              <Link href="/app/scout-groups" className="flex gap-4">
                <ArrowLeft /> Voltar
              </Link>
              <CardTitle>Dados do grupo escoteiro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ScoutGroupForm viewOnly scoutGroup={scoutGroup as any/*eslint-disable-line*/} />
            </CardContent>
          </Card>

          <Card className="w-full max-w-[500px]">
            <CardHeader>
              <CardTitle>Dados do responsável do grupo escoteiro</CardTitle>
            </CardHeader>
            <CardContent>
              {scoutGroup.responsible && (
                <>
                  <ResponsibleForm
                    viewOnly
                    responsible={scoutGroup.responsible}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="members">
        <Card>
          <CardHeader className="flex gap-4 lg:flex-row lg:justify-between">
            <CardTitle>Membros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {membersWithAlimentation.length > 0 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold">Com alimentação</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {membersWithAlimentation.map((member) => (
                    <MItem key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
            <Separator />
            {membersWithOutAlimentation.length > 0 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold">Sem alimentação</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {membersWithOutAlimentation.map((member) => (
                    <MItem key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
            <Separator />

            {membersDonation.length > 0 && (
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-bold">Doação</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {membersDonation.map((member) => (
                    <MItem key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
