'use client'

import { FunctionsMember } from '@cepe/schema'
import React, { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { inputPhoneMask } from '@/utils/inputMasks'

import { MemberDeleteButton } from './member-delete-button'
import { MemberDonateForm } from './member-donate-form-dialog'
import { MemberWithAlimentationForm } from './member-with-alimentation-form-dialog'
import { MemberWithOutAlimentationForm } from './member-with-out-alimentation-form-dialog'
import { Member } from './members-table'

type IProps = {
  member: Member
  refetch: () => void
  isSubmitted?: boolean
}
function DataItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div className="font-semibold">{label}:</div>
      <p className="line-clamp-2">{children}</p>
    </>
  )
}

export const MemberItem: React.FC<IProps> = ({
  member,
  refetch,
  isSubmitted,
}) => {
  return (
    <Card className="max-w-96 rounded-md bg-white p-4 shadow-md">
      <CardHeader>
        <CardTitle>{member.name}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <DataItem label="Nome">{member.name}</DataItem>
        <DataItem label="Registro">
          {member.registerNumber}-{member.registerVerifier}
        </DataItem>
        <DataItem label="Telefone">
          {inputPhoneMask(member.phoneNumber)}
        </DataItem>
        {member.type !== 'DONATION' && (
          <>
            <DataItem label="Data de nascimento">
              {member.birthDate?.toLocaleDateString()}
            </DataItem>
          </>
        )}
        <DataItem label="Sexo">
          {member.sex === 'M' ? 'Masculino' : 'Feminino'}
        </DataItem>
        <DataItem label="Insígnia da Madeira">
          {member.haveInsigniaDaMadeira ? 'Sim' : 'Não'}
        </DataItem>

        {member.type !== 'DONATION' && (
          <>
            <DataItem label="Função">
              {FunctionsMember[member.function as keyof typeof FunctionsMember]}
            </DataItem>
            <DataItem label="Restrições de saúde">
              {member.healthRestrictions}
            </DataItem>
          </>
        )}
        {member.type === 'WITH_ALIMENTATION' && (
          <>
            <DataItem label="Restrições alimentares">
              {member.alimentationRestrictions}
            </DataItem>
          </>
        )}
      </CardContent>
      {!isSubmitted && (
        <CardFooter className="space-x-4">
          <MemberDeleteButton id={member.id} refetch={refetch} />

          {member.type === 'DONATION' && (
            <MemberDonateForm member={member} refetch={refetch} />
          )}
          {member.type === 'WITHOUT_ALIMENTATION' && (
            <MemberWithOutAlimentationForm member={member} refetch={refetch} />
          )}

          {member.type === 'WITH_ALIMENTATION' && (
            <MemberWithAlimentationForm member={member} refetch={refetch} />
          )}
        </CardFooter>
      )}
    </Card>
  )
}
