'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Responsible, ResponsibleForm } from './responsible-form'

export function ResponsibleFormDialog({
  refetch,
  responsible,
}: {
  refetch: () => void
  responsible?: Responsible
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {responsible ? 'Editar' : 'Adicionar'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{responsible ? 'Editar' : 'Cadastrar'}</DialogTitle>
        </DialogHeader>
        <ResponsibleForm
          refetch={() => {
            refetch()
            setIsOpen(false)
          }}
          responsible={responsible}
        />
      </DialogContent>
    </Dialog>
  )
}
