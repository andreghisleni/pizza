import { X } from 'lucide-react'

import { formatTimeDifference } from '@/utils/time-difference'

interface ErrorPopupProps {
  error: 'Ticket not found' | 'Ticket already delivered' | null | string
  onClose: () => void
}

export function ErrorPopup({ error, onClose }: ErrorPopupProps) {
  if (!error) return null

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Ticket not found':
        return {
          title: 'Ingresso não encontrado',
          description:
            'O código do ingresso digitado não foi encontrado no sistema.',
        }
      case 'Ticket already delivered':
        return {
          title: 'Ingresso já entregue',
          description: 'Este ingresso já foi entregue anteriormente.',
        }
      default:
        if (error.startsWith('Ticket already delivered-')) {
          const ticket = JSON.parse(error.split('--->>')[1])
          return {
            title: 'Ingresso já entregue',
            description: `Este ingresso já foi entregue anteriormente. à ${formatTimeDifference(ticket.deliveredAt)}.`,
          }
        }
        return {
          title: 'Erro',
          description: 'Ocorreu um erro inesperado.',
        }
    }
  }

  const { title, description } = getErrorMessage(error)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <p className="mb-6 text-gray-700 dark:text-gray-300">{description}</p>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
