import { Metadata } from 'next'
import { Suspense } from 'react'

import { Loading } from '@/components/summary/loading'
import { TotalDeliveredTicket } from '@/components/summary/total-delivered-tickets'
import { TotalDeliveredTicketWithCritica } from '@/components/summary/total-delivered-tickets-with-critica'
import { TotalMembers } from '@/components/summary/total-members'
import { TotalPayedTicket } from '@/components/summary/total-payed-tickets'
import { TotalTicketRanges } from '@/components/summary/total-ticket-ranges'
import { TotalTicket } from '@/components/summary/total-tickets'
import { TotalTicketWithoutCritica } from '@/components/summary/total-tickets-without-critica'
import { TotalTicketWithoutDelivered } from '@/components/summary/total-tickets-without-delivered'
import { TotalTicketWithoutImported } from '@/components/summary/total-tickets-without-imported'
import { TotalValuePayedTicket } from '@/components/summary/total-value-payed-tickets'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export const revalidate = 30

export default function DashboardPage() {
  return (
    <div className="px-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalTicket />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalTicketWithoutCritica />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalPayedTicket />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalTicketWithoutImported />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalValuePayedTicket />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalDeliveredTicket />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalDeliveredTicketWithCritica />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalMembers />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalTicketWithoutDelivered />
          </Suspense>
        </div>
        <div className="col-span-2">
          <Suspense fallback={<Loading />}>
            <TotalTicketRanges />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
