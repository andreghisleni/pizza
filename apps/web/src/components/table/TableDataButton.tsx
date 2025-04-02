/* eslint @typescript-eslint/no-explicit-any:off */
/* eslint react/display-name:off */

import { CellContext, Column, Row, RowData } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import React, { ReactNode } from 'react'

import { Button } from '../ui/button'
import {
  DataType,
  tableDataParser,
  tableDataParserNew,
} from './TableDataParser'

// import { Container } from './styles';

export const TableDataButton: React.FC<{
  column: Column<any> // eslint-disable-line @typescript-eslint/no-explicit-any
  children: ReactNode
}> = ({ column, children }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      data-text={children}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

export const tableDataButton =
  (label: string) =>
  ({ column }: { column: Column<any> }) => (
    <TableDataButton column={column}>{label}</TableDataButton>
  )

export function tdb<TData extends RowData>(
  name: TData extends RowData ? keyof TData : string,
  label: string,
  dataType?: DataType,
  cell?: (c: CellContext<any, unknown>) => any,
  other?: any,
) {
  return {
    ...{
      accessorKey: name,
      header: tableDataButton(label),
    },
    ...(cell ? { cell } : dataType ? { cell: tableDataParser(dataType) } : {}),
    ...other,
  }
}

export function tdbNew<TData extends RowData>({
  name,
  label,
  dataType,
  cell,
  other,
  columns,
  id,
  enableHiding,
  parse,
  link,
}: {
  name?: TData extends RowData ? keyof TData : string
  label?: string
  dataType?: DataType
  cell?: (c: CellContext<any, unknown>) => any
  other?: any

  columns?: Column<any>[]

  id?: string
  enableHiding?: boolean

  parse?: (data: any) => any
  link?: (row: Row<any>) => string
}) {
  return {
    ...{
      accessorKey: name,
      header: label && tableDataButton(label),
      id,
      enableHiding,
    },
    ...(cell
      ? { cell }
      : dataType
        ? {
            cell: tableDataParserNew({
              type: dataType,
              columns,
              parse,
              link,
            }),
          }
        : {}),
    ...other,
  }
}
