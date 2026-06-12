'use client'

import { router, usePage } from '@inertiajs/react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'
import type { PaginationMeta } from '~/types/pagination'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination: PaginationMeta
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
}: DataTableProps<TData, TValue>) {
  const { url } = usePage()
  const searchFromUrl = useMemo(() => {
    const parsedUrl = new URL(url, 'http://localhost')
    return parsedUrl.searchParams.get('search') ?? ''
  }, [url])
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchInput, setSearchInput] = useState(searchFromUrl)
  const [debouncedSearchInput] = useDebounce(searchInput, 400)
  const [rowSelection, setRowSelection] = useState({})
  const didMount = useRef(false)

  useEffect(() => {
    setSearchInput(searchFromUrl)
  }, [searchFromUrl])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    const currentUrl = new URL(window.location.href)
    const currentSearch = currentUrl.searchParams.get('search') ?? ''

    if (debouncedSearchInput === currentSearch) {
      return
    }

    if (debouncedSearchInput) {
      currentUrl.searchParams.set('search', debouncedSearchInput)
    } else {
      currentUrl.searchParams.delete('search')
    }
    currentUrl.searchParams.set('page', '1')

    visitUrl(currentUrl)
  }, [debouncedSearchInput])

  const table = useReactTable({
    data,
    columns,
    columnResizeMode: 'onChange',
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
  })

  const visiblePages = getVisiblePages(pagination.currentPage, pagination.lastPage)
  const firstRow =
    pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.perPage + 1
  const lastRow = Math.min(pagination.currentPage * pagination.perPage, pagination.total)

  function changePage(page: number) {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('page', String(page))
    visitUrl(currentUrl)
  }

  function changePerPage(perPage: string) {
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('perPage', perPage)
    currentUrl.searchParams.set('page', '1')
    visitUrl(currentUrl)
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-3 overflow-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Cari data..."
          className="w-full focus-visible:border-input focus-visible:ring-0 sm:max-w-xs"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Baris</span>
          <Select value={String(pagination.perPage)} onValueChange={changePerPage}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="overflow-x-auto rounded-md border">
        <Table className="min-w-max table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="group/head relative h-10 select-none last:[&>.cursor-col-resize]:opacity-0"
                      {...{
                        colSpan: header.colSpan,
                        style: {
                          width: header.getSize(),
                        },
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanResize() && (
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className:
                              'group-last/head:hidden absolute top-0 h-full w-4 cursor-col-resize user-select-none touch-none -right-2 z-10 flex justify-center before:absolute before:w-px before:inset-y-0 before:bg-border before:translate-x-px',
                          }}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top whitespace-normal break-words">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {firstRow}-{lastRow} dari {pagination.total} data
        </div>
        <Pagination className="sm:mx-0 sm:w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                text="Sebelumnya"
                aria-disabled={pagination.currentPage <= 1}
                tabIndex={pagination.currentPage <= 1 ? -1 : undefined}
                className={
                  pagination.currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined
                }
                onClick={(event) => {
                  event.preventDefault()
                  changePage(pagination.currentPage - 1)
                }}
              />
            </PaginationItem>
            {visiblePages.map((page, index) =>
              page === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={page === pagination.currentPage}
                    onClick={(event) => {
                      event.preventDefault()
                      changePage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                text="Berikutnya"
                aria-disabled={pagination.currentPage >= pagination.lastPage}
                tabIndex={pagination.currentPage >= pagination.lastPage ? -1 : undefined}
                className={
                  pagination.currentPage >= pagination.lastPage
                    ? 'pointer-events-none opacity-50'
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault()
                  changePage(pagination.currentPage + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

function visitUrl(url: URL) {
  router.get(url.pathname, Object.fromEntries(url.searchParams.entries()), {
    preserveScroll: true,
    preserveState: true,
    replace: true,
  })
}

function getVisiblePages(currentPage: number, pageCount: number) {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 'ellipsis', pageCount] as const
  }

  if (currentPage >= pageCount - 2) {
    return [1, 'ellipsis', pageCount - 3, pageCount - 2, pageCount - 1, pageCount] as const
  }

  return [
    1,
    'ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis',
    pageCount,
  ] as const
}
