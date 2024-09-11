'use client'

import { RouterOutput } from '@cepe/trpc'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { trpc } from '@/lib/trpc/react'

import { MemberDonateForm } from './member-donate-form-dialog'
import { MemberItem } from './member-item'
import { MemberWithAlimentationForm } from './member-with-alimentation-form-dialog'
import { MemberWithOutAlimentationForm } from './member-with-out-alimentation-form-dialog'

export type Member = RouterOutput['getMyMembers']['members'][0]

type IProps = {
  members: Member[]
  isSubmitted?: boolean
}

export const MembersTable: React.FC<IProps> = ({ members, isSubmitted }) => {
  const { data: sg, refetch: rSC } = trpc.getMyScoutGroup.useQuery()
  const { data, refetch: r } = trpc.getMyMembers.useQuery()

  function refetch() {
    rSC()
    r()
  }

  const isSubmit = !!sg?.scoutGroup?.submitedAt || isSubmitted

  const membersDonation = (data?.members || members).filter(
    (member) => member.type === 'DONATION',
  )

  const membersWithOutAlimentation = (data?.members || members).filter(
    (member) => member.type === 'WITHOUT_ALIMENTATION',
  )

  const membersWithAlimentation = (data?.members || members).filter(
    (member) => member.type === 'WITH_ALIMENTATION',
  )

  return (
    <Card>
      <CardHeader className="flex gap-4 lg:flex-row lg:justify-between">
        <CardTitle>Membros</CardTitle>
        <div className="max-w-80 space-y-2">
          {!isSubmit && (
            <>
              <MemberDonateForm refetch={refetch} />
              <MemberWithOutAlimentationForm refetch={refetch} />
              <MemberWithAlimentationForm refetch={refetch} />
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {membersWithAlimentation.length > 0 && (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Com alimentação</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {membersWithAlimentation.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  refetch={refetch}
                  isSubmitted={isSubmit}
                />
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
                <MemberItem
                  key={member.id}
                  member={member}
                  refetch={refetch}
                  isSubmitted={isSubmit}
                />
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
                <MemberItem
                  key={member.id}
                  member={member}
                  refetch={refetch}
                  isSubmitted={isSubmit}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
