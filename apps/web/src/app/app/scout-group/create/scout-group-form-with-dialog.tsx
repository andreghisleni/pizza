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

import { ScoutGroup, ScoutGroupForm } from './scout-group-form'

export function ScoutGroupFormDialog({
  refetch,
  scoutGroup,
}: {
  refetch: () => void
  scoutGroup?: ScoutGroup
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {scoutGroup ? 'Editar' : 'Adicionar'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{scoutGroup ? 'Editar' : 'Cadastrar'}</DialogTitle>
        </DialogHeader>
        <ScoutGroupForm
          refetch={() => {
            refetch()
            setIsOpen(false)
          }}
          scoutGroup={scoutGroup}
        />
      </DialogContent>
    </Dialog>
  )
}
