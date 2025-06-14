'use client'
/** eslint @typescript-eslint/no-explicit-any: 0 */
import * as Portal from '@radix-ui/react-portal'
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
import { ChevronDown, Expand, Shrink } from 'lucide-react'
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
import { cn } from '@/lib/utils'

import { Checkbox } from './ui/checkbox'
import { Skeleton } from './ui/skeleton'

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

  paginationComponent?: React.ReactNode

  rowBgColor?: (row: any) => string

  loading?: boolean
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

export function DataTable<TData, TValue>({
  paginationComponent,
  rowBgColor,
  loading,
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

  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const tabelaRef = React.useRef(null)

  const toggleFullScreen = () => {
    // if (isFullScreen) {
    //   document.exitFullscreen();
    // } else {
    //   tabelaRef.current?.requestFullscreen(); // eslint-disable-line
    // }
    setIsFullScreen(!isFullScreen)
  }

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    enableRowSelection(row) {
      return actionDisabledFunction ? !actionDisabledFunction({ row }) : true
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
    <>
      <div
        className={cn(
          'flex flex-1 flex-col overflow-x-hidden',
          'relative overflow-x-auto',
          // 'data-[full-screen=true]:fixed data-[full-screen=true]:left-0 data-[full-screen=true]:top-0 data-[fullScreen=true]:z-50',
          // 'data-[full-screen=true]:h-screen data-[full-screen=true]:w-screen',
          // 'data-[full-screen=true]:p-8',
          'bg-white text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50',
        )}
        ref={tabelaRef}
        data-full-screen={isFullScreen ? 'true' : 'false'}
      >
        <DateTableContent
          {...{
            table,
            columns,
            globalFilter,
            setGlobalFilter,
            filterComponent,
            ifJustFilterComponent,
            addFunction,
            addComponent,
            noDataMessage,
            toggleFullScreen,
            isFullScreen,
            pagination,
            paginationComponent,
            rowBgColor,
            loading,
            showVisibilityToggle,
          }}
        />
      </div>

      {isFullScreen && (
        <Portal.Root
          className="z-500 pointer-events-auto fixed inset-0 isolation-auto overflow-y-auto bg-white p-8 dark:bg-zinc-950"
          style={{
            pointerEvents: 'auto',
          }}
          tabIndex={-1}
        >
          <DateTableContent
            {...{
              table,
              columns,
              globalFilter,
              setGlobalFilter,
              filterComponent,
              ifJustFilterComponent,
              addFunction,
              addComponent,
              noDataMessage,
              toggleFullScreen,
              isFullScreen,
              pagination,
              paginationComponent,
              rowBgColor,
              loading,
              showVisibilityToggle,
              actionComponent,
            }}
          />
        </Portal.Root>
      )}
    </>
  )
}

function DateTableContent({
  table,
  columns,
  globalFilter,
  setGlobalFilter,
  filterComponent,
  ifJustFilterComponent,
  addFunction,
  addComponent,
  noDataMessage,
  toggleFullScreen,
  isFullScreen,
  pagination,
  paginationComponent,
  rowBgColor,
  loading,
  showVisibilityToggle = true,
  actionComponent,
}: {
  table: any
  columns: any
  globalFilter: any
  setGlobalFilter: any
  filterComponent: any
  ifJustFilterComponent: any
  addFunction: any
  addComponent: any
  noDataMessage: any
  toggleFullScreen: any
  isFullScreen: any
  pagination: any
  paginationComponent: any
  rowBgColor?: (row: any) => string
  loading?: boolean
  showVisibilityToggle?: boolean
  actionComponent?: (props: { table: TableInstance<any> }) => React.ReactNode
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-2 py-4 md:flex-row md:gap-0">
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
                        {getHeaderValue(column)}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {addFunction && (
            <Button variant="outline" className="ml-2" onClick={addFunction}>
              Add
            </Button>
          )}
          {addComponent && addComponent}
          {actionComponent && actionComponent({ table })}
          <Button onClick={toggleFullScreen} variant="outline">
            {isFullScreen ? <Shrink /> : <Expand />}
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto">
        {/* <ScrollArea> */}
        <Table className="table-auto">
          <TableHeader className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'bg-white dark:bg-zinc-950',
                        header.column.columnDef.meta?.className,
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!loading ? (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className={cn('group')}
                    onDoubleClick={() =>
                      row.toggleSelected(!row.getIsSelected())
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'bg-white dark:bg-zinc-950',
                          'group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800/50',
                          'group-data-[state=selected]:bg-zinc-200 dark:group-data-[state=selected]:bg-zinc-800/50',
                          'group-data-[state=selected]:group-hover:bg-blue-200/70 dark:group-data-[state=selected]:group-hover:bg-blue-800/40',
                          rowBgColor?.(row),
                          cell.column.columnDef.meta?.className,
                        )}
                      >
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
                  {columns.length < 6 ? (
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {noDataMessage}
                    </TableCell>
                  ) : (
                    Array(Math.ceil(columns.length / 3))
                      .fill(null)
                      .map((_, i) => i)
                      .map((i) => (
                        <TableCell
                          colSpan={Math.ceil(columns.length / 3)}
                          className="h-24 text-center"
                          key={i}
                        >
                          {noDataMessage}
                        </TableCell>
                      ))
                  )}
                </TableRow>
              )
            ) : (
              [1, 2, 3, 4, 5, 6, 7].map((i) => (
                <TableRow key={i} className={cn('group')}>
                  {table.getVisibleFlatColumns().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-white dark:bg-zinc-950',
                        'group-hover:bg-zinc-100/50 dark:group-hover:bg-zinc-800/50',

                        // cell.column.columnDef.meta?.className,
                      )}
                    >
                      {cell.id === 'actions' ? (
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-[80px]" />
                          <Skeleton className="h-10 w-[80px]" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-full" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {/* <ScrollBar orientation="horizontal" />
  </ScrollArea> */}
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
      {paginationComponent && paginationComponent}
    </>
  )
}
