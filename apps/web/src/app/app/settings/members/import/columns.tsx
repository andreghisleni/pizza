'use client'

import { ColumnDef } from '@tanstack/react-table'

import { tdb } from '@/components/TableDataButton'

import { Item } from './page'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Item>[] = [
  tdb('visionId', 'Vision'),
  tdb('name', 'Nome'),
  tdb('register', 'Registro'),
  tdb('sessionName', 'Seção'),
]
