import { BarChart } from 'lucide-react'
import { unstable_noStore } from 'next/cache'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { serverClient } from '@/lib/trpc/server'
// import { serverClient } from '@/lib/trpc/server'

export async function TotalTicketRanges() {
  unstable_noStore()

  const { totalTicketRangeToGenerate, totalNumbersToGenerate } =
    await serverClient.getTotalTicketRangeToGenerate()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">
          Total de faixas de ingressos
        </CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-1">
        <span className="text-2xl font-bold">
          {String(totalTicketRangeToGenerate).padStart(4, '0')}
        </span>
        <p className="text-xs text-muted-foreground">
          Total de números para gerar
        </p>
        <p className="text-xs text-muted-foreground">
          {String(totalNumbersToGenerate).padStart(4, '0')}
        </p>
      </CardContent>
    </Card>
  )
}
