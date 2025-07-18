'use client'

import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Table as TableInstance,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import reactNodeToString from 'react-node-to-string'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Checkbox } from './ui/checkbox'
import { ScrollArea, ScrollBar } from './ui/scroll-area'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: {
    page: number
    limit: number
    total_pages: number
    total_items: number
  }
  addFunction?: () => void
  addComponent?: React.ReactNode
  noDataMessage?: string
  onRowSelectionChange?: (selectedRows: TData[]) => void

  filterComponent?: React.ReactNode
  ifJustFilterComponent?: boolean

  actionComponent?: (props: { table: TableInstance<TData> }) => React.ReactNode
  actionDisabledFunction?: (props: { row: Row<TData> }) => boolean

  initialColumnVisibility?: VisibilityState
  showVisibilityToggle?: boolean
}

const getHeaderValue = (column: Column<unknown>): string => {
  const { header } = column.columnDef

  if (typeof header === 'string') {
    return header
  }

  if (typeof header === 'function') {
    return reactNodeToString(header(column as any)) // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  return column.id
}

const select = ({
  actionDisabledFunction,
}: {
  actionDisabledFunction: DataTableProps<any, any>['actionDisabledFunction'] // eslint-disable-line
}) => ({
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && 'indeterminate')
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="border-gray-950 disabled:border-gray-400 dark:border-gray-500"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="border-gray-950 disabled:border-gray-400 dark:border-gray-500"
      disabled={actionDisabledFunction && actionDisabledFunction({ row })}
    />
  ),
  enableSorting: false,
  enableHiding: false,
  maxSize: 2,
})

export function DataTableOld<TData, TValue>({
  columns: c,
  data,
  pagination = undefined,
  addFunction,
  addComponent,
  noDataMessage = 'No results.',
  onRowSelectionChange,
  filterComponent,
  ifJustFilterComponent = false,
  actionComponent,
  actionDisabledFunction,
  initialColumnVisibility = {},
  showVisibilityToggle = true,
}: DataTableProps<TData, TValue>) {
  const columns = actionComponent
    ? [select({ actionDisabledFunction }), ...c]
    : c

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility)
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection(row) {
      return actionDisabledFunction ? !actionDisabledFunction({ row }) : true
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  React.useEffect(() => {
    onRowSelectionChange &&
      onRowSelectionChange(
        table.getSelectedRowModel().rows.map((row) => row.original),
      )
  }, [table, onRowSelectionChange, rowSelection])

  React.useEffect(() => {
    !pagination && table.setPageSize(10000)
  }, [table, pagination])

  return (
    <ScrollArea>
      <div className="w-full">
        <div className="w-full">
          <div className="flex items-center py-4">
            {!ifJustFilterComponent ? (
              <div className="flex flex-row gap-2">
                <Input
                  placeholder="Filter..."
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="max-w-ssm"
                />
                {filterComponent && filterComponent}
              </div>
            ) : (
              filterComponent && filterComponent
            )}
            <div className="ml-auto flex gap-2">
              {showVisibilityToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                          {getHeaderValue(column as any) /* eslint-disable-line */}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {addFunction && (
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={addFunction}
                >
                  Add
                </Button>
              )}
              {addComponent && addComponent}
              {actionComponent && actionComponent({ table })}
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {
                            header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header, //eslint-disable-line
                                header.getContext(),// eslint-disable-line
                              )/*eslint-disable-line*/}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      onDoubleClick={() => row.toggleSelected()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {noDataMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            {!!table.getAllColumns().find((c) => c.id === 'select') && (
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
            )}
            {pagination && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
