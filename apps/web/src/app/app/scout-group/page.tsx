import { auth } from '@pizza/auth'
import { CheckCircle, Circle } from 'lucide-react'
import { Metadata } from 'next'
import { unstable_noStore } from 'next/cache'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { serverClient } from '@/lib/trpc/server'
import { formatToBRL } from '@/utils/formatToBRL'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export const revalidate = 10

export default async function DashboardScoutGroupPage() {
  unstable_noStore()

  const session = await auth()
  const { scoutGroup } = await serverClient.getMyScoutGroup()

  const finish = [
    {
      text: 'Cadastre o seu grupo escoteiro',
      href: '/app/scout-group/create',
      isOk: !!scoutGroup,
      disableIfOk: true,
    },
    {
      text: 'Cadastre um responsável pelo grupo escoteiro',
      href: '/app/scout-group/create/responsible',
      isOk: !!scoutGroup?.responsible,
      disabled: !scoutGroup,
      disableIfOk: true,
    },
    {
      text: 'Realize a inscrição dos membros do seu grupo escoteiro',
      href: '/app/scout-group/members',
      isOk: scoutGroup?.members && scoutGroup?.members?.length >= 1,
      disabled: !scoutGroup,
      disableIfOk: false,
    },
  ]

  const membersDonation = scoutGroup?.members.filter(
    (member) => member.type === 'DONATION',
  )

  const membersWithOutAlimentation = scoutGroup?.members.filter(
    (member) => member.type === 'WITHOUT_ALIMENTATION',
  )

  const membersWithAlimentation = scoutGroup?.members.filter(
    (member) => member.type === 'WITH_ALIMENTATION',
  )

  return (
    <div className="flex w-full justify-center">
      <div className="w-full max-w-[500px] gap-4 space-y-4 rounded-md border border-b p-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Olá {session?.user.name}!
        </h2>
        <p className="text-justify text-xl tracking-tight">
          Obrigado por realizar o seu cadastro, antes de realizar a inscrição
          dos membros do seu grupo escoteiro, é necessário terminar o cadastro
          do grupo escoteiro. Siga o passo a passo a seguir:
        </p>
        <ul>
          {finish.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="relative ml-10 mt-2 flex text-lg hover:text-green-800 data-[disabled=true]:pointer-events-none data-[ok=true]:data-[disableIfOk=true]:pointer-events-none data-[disabled=true]:text-gray-400 data-[ok=true]:text-green-600"
                data-ok={item.isOk}
                data-disabled={item.disabled}
                data-disableIfOk={item.disableIfOk}
              >
                <div className="absolute -left-10 top-0">
                  {item.isOk ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Circle className="h-6 w-6" />
                  )}
                </div>
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
        {!!scoutGroup && (
          <>
            <p className="text-justify tracking-tight">
              Para submeter a inscrição do grupo, é necessário ter inscrito
              todos os membros que participarão ou estarão fazendo uma doação
              para o campo escoteiro.
            </p>

            <h2 className="text-2xl font-bold tracking-tight">
              Total de membros cadastrados: {scoutGroup?.members?.length}
            </h2>
            <h2 className="text-xl font-bold tracking-tight">
              Total de membros com alimentação:{' '}
              {membersWithAlimentation?.length}
            </h2>
            <h2 className="text-xl font-bold tracking-tight">
              Total de membros sem alimentação:{' '}
              {membersWithOutAlimentation?.length}
            </h2>
            <h2 className="text-xl font-bold tracking-tight">
              Total de membros como doação: {membersDonation?.length}
            </h2>

            <Separator orientation="horizontal" />
            <h2 className="text-2xl font-bold tracking-tight">
              Valores por categoria
            </h2>
            <div className="flex justify-between ">
              <h2 className="text-xl font-bold tracking-tight">
                Membros como doação:
              </h2>
              <h2 className="text-xl tracking-tight">
                {formatToBRL((membersDonation?.length || 0) * 60)}
              </h2>
            </div>
            <div className="flex justify-between ">
              <h2 className="text-xl font-bold tracking-tight">
                Membros com alimentação:
              </h2>
              <h2 className="text-xl tracking-tight">
                {formatToBRL((membersWithAlimentation?.length || 0) * 180)}
              </h2>
            </div>
            <div className="flex justify-between ">
              <h2 className="text-xl font-bold tracking-tight">
                Membros sem alimentação:
              </h2>
              <h2 className="text-xl tracking-tight">
                {formatToBRL((membersWithOutAlimentation?.length || 0) * 80)}
              </h2>
            </div>
            <div className="flex justify-between text-red-600">
              <h2 className="text-2xl font-bold tracking-tight">Total:</h2>
              <h2 className="text-2xl tracking-tight">
                {formatToBRL(
                  (membersDonation?.length || 0) * 60 +
                    (membersWithOutAlimentation?.length || 0) * 80 +
                    (membersWithAlimentation?.length || 0) * 180,
                )}
              </h2>
            </div>

            <p className="text-justify tracking-tight">
              Antes de submeter a inscrição do grupo, é necessário ter realizado
              o pagamento do valor total. O comprovante deve ser enviado na
              submissão da inscrição.
            </p>

            <Separator orientation="horizontal" />

            {!scoutGroup.submitedAt && (
              <Button asChild className="w-full">
                <Link href="/app/scout-group/submit">Submeter inscrição</Link>
              </Button>
            )}

            {scoutGroup.submitedAt && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">
                  Inscrição submetida
                </h2>
                <p>
                  Agora nossa equipe vai analisar os dados cadastrados, caso
                  tivermos algum problema, entraremos em contato.
                </p>
              </>
            )}
            {scoutGroup.paymentConfirmedAt && (
              <h2 className="text-2xl font-bold tracking-tight">
                Pagamento confirmado.
              </h2>
            )}
            {scoutGroup.confirmedAt && (
              <h2 className="text-2xl font-bold tracking-tight">
                Inscrição confirmada.
              </h2>
            )}
          </>
        )}
      </div>
    </div>
  )
}
