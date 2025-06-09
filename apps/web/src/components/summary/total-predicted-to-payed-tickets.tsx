import { BarChart } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'
// import { serverClient } from '@/lib/trpc/server'

export async function TotalPredictedPayedTicket() {
  unstable_noStore()

  const { totalPredictedCalabresa, totalPredictedMista, possibleTotalTickets } =
    await serverClient.getTotalTicketPayments()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Total de ingressos que devem ser pagos
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(possibleTotalTickets).padStart(4, '0')}
        </span>
        <p className="text-xs text-muted-foreground">
          Calabresa: {String(totalPredictedCalabresa).padStart(4, '0')}
        </p>
        <p className="text-xs text-muted-foreground">
          Mista: {String(totalPredictedMista).padStart(4, '0')}
        </p>
      </CardContent>
    </Card>
  )
}
