import xlsx from 'json-as-xlsx'

import { Button } from '@/components/ui/button'
import { agruparNumbers } from '@/utils/agrupar-numaros'

import { Member, Ticket } from './page'

export function ExportButton({
  members,
  tickets,
}: {
  members: Member[]
  tickets: Ticket[]
}) {
  function handleExport() {
    xlsx(
      [
        {
          sheet: 'Membros',
          columns: [
            { label: 'VisionId', value: 'visionId' },
            { label: 'Nome', value: 'name' },
            { label: 'Seção', value: 'session' },
            { label: 'N° Tickets', value: 'tickets' },
            { label: 'Números', value: 'numbers' },
            { label: 'A retirar', value: 'tickets-a-retirar' },
          ],
          content: members.map((item) => ({
            visionId: item.visionId,
            name: item.name,
            session: item.session.name,
            tickets: item.tickets.length,
            numbers: agruparNumbers(item.tickets.map((t) => t.number)).join(
              '\n',
            ),
            'tickets-a-retirar': item.tickets.filter((t) => !t.deliveredAt)
              .length,
          })),
        },
        {
          sheet: 'Tickets',
          columns: [
            { label: 'N', value: 'number' },
            { label: 'Nome', value: 'name' },
            { label: 'Seção', value: 'session' },
            { label: 'Critica', value: 'returned' },
          ],
          content: tickets.map((t) => ({
            number: t.number,
            name: t.member?.name || 'Sem nome',
            session: t.member?.session.name || 'Sem seção',
            returned: t.returned ? 'Sim' : 'Não',
          })),
        },
      ],
      {
        fileName: 'tickets-nao-retirados',
      },
    )
  }

  return <Button onClick={handleExport}>Exportar</Button>
}
