// src/components/member-payments-table-modal.tsx
'use client'

import { RouterOutput } from '@pizza/trpc'
import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { trpc } from '@/lib/trpc/react'
import { cn } from '@/lib/utils'
import { formatToBRL } from '@/utils/formatToBRL'

import { TicketPaymentForm } from '../../tickets/payments/ticket-payment-form'
import { EditablePaymentRow, PaymentFormData } from './EditablePaymentRow'

type PaymentsTableProps = {
  memberId: string
  refetchMembers: () => void
  payments: NonNullable<RouterOutput['getMember']['member']>['ticketPayments']
  toReceive: number
}

export function PaymentsTable({
  memberId,
  refetchMembers,
  payments,
  toReceive,
}: PaymentsTableProps) {
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)

  // Exemplo de mutação para atualizar um pagamento
  const updatePaymentMutation = trpc.updateTicketPayment.useMutation({
    onSuccess: () => {
      refetchMembers()
      toast.success('Pagamento atualizado com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao atualizar pagamento:', error)
      toast.error(`Erro ao atualizar pagamento: ${error.message}`)
    },
  })

  const handleUpdatePayment = (paymentId: string, data: PaymentFormData) => {
    console.log('Atualizando pagamento:', paymentId, data)
    updatePaymentMutation.mutate({
      id: paymentId,
      amount: data.amount,
      type: data.type as 'CASH' | 'PIX',
      payedAt: data.payedAt,
      visionId: data.visionId,
      memberId,
    })
  }

  const handleEdit = (paymentId: string) => {
    setEditingPaymentId(paymentId)
  }

  const handleCancelEdit = () => {
    setEditingPaymentId(null)
  }

  const received = payments.reduce((acc, payment) => acc + payment.amount, 0)

  const total = received - toReceive

  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="flex">
          <TicketPaymentForm memberId={memberId} refetch={refetchMembers} />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pagamento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum pagamento encontrado para este membro.
              </TableCell>
            </TableRow>
          ) : (
            payments?.map((payment) => (
              <EditablePaymentRow
                key={payment.id}
                payment={payment}
                onSave={handleUpdatePayment}
                isEditing={editingPaymentId === payment.id}
                onEdit={() => handleEdit(payment.id)}
                onCancel={handleCancelEdit}
                refetch={refetchMembers}
              />
            ))
          )}
          <TableRow className={cn('', total < 0 && 'bg-red-100')}>
            <TableCell className="text-right">Total Recebido:</TableCell>
            <TableCell className="font-bold">{formatToBRL(received)}</TableCell>
            <TableCell className="text-right">Total a Receber:</TableCell>
            <TableCell className="font-bold">
              {formatToBRL(toReceive)}
            </TableCell>
            <TableCell className="whitespace-nowrap text-right font-bold">
              Saldo: {formatToBRL(total)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}
