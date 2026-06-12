"use client"

import { type MouseEvent, type ReactNode } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"

export interface PaginationWithLinksProps {
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string
    pageSizeOptions: number[]
  }
  totalCount: number
  pageSize: number
  page: number
  pageSearchParam?: string
  navigationMode?: "link" | "router"
}

export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  page,
  pageSearchParam = "page",
}: PaginationWithLinksProps) {
  const totalPageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  function currentLocation() {
    if (typeof window === "undefined") {
      return { pathname: "", search: "" }
    }

    return {
      pathname: window.location.pathname,
      search: window.location.search,
    }
  }

  function buildLink(newPage: number) {
    const { pathname, search } = currentLocation()
    const params = new URLSearchParams(search)

    if (newPage === 1) {
      params.delete(pageSearchParam)
    } else {
      params.set(pageSearchParam, String(newPage))
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  function navigate(event: MouseEvent<HTMLAnchorElement>, url: string) {
    event.preventDefault()
    window.location.assign(url)
  }

  function navToPageSize(newPageSize: number) {
    const { pathname, search } = currentLocation()
    const params = new URLSearchParams(search)
    params.set(pageSizeSelectOptions?.pageSizeSearchParam || "pageSize", String(newPageSize))
    params.delete(pageSearchParam)
    window.location.assign(`${pathname}?${params.toString()}`)
  }

  function renderPageNumbers() {
    const items: ReactNode[] = []
    const maxVisiblePages = 5

    const createPageItem = (pageNum: number) => {
      const href = buildLink(pageNum)

      return (
        <PaginationItem key={pageNum}>
          <PaginationLink
            href={href}
            onClick={(event) => navigate(event, href)}
            isActive={page === pageNum}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
      )
    }

    if (totalPageCount <= maxVisiblePages) {
      for (let index = 1; index <= totalPageCount; index += 1) {
        items.push(createPageItem(index))
      }
      return items
    }

    items.push(createPageItem(1))

    if (page > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    const start = Math.max(2, page - 1)
    const end = Math.min(totalPageCount - 1, page + 1)

    for (let index = start; index <= end; index += 1) {
      items.push(createPageItem(index))
    }

    if (page < totalPageCount - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      )
    }

    items.push(createPageItem(totalPageCount))
    return items
  }

  return (
    <div className="flex w-full flex-col items-center gap-3 md:flex-row">
      {pageSizeSelectOptions && (
        <div className="flex flex-1">
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ "md:justify-end": pageSizeSelectOptions })}>
        <PaginationContent className="max-sm:gap-0">
          <PaginationItem className="hidden">
            <Loader2 />
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              href={buildLink(Math.max(page - 1, 1))}
              onClick={(event) => navigate(event, buildLink(Math.max(page - 1, 1)))}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={page === 1 ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href={buildLink(Math.min(page + 1, totalPageCount))}
              onClick={(event) => navigate(event, buildLink(Math.min(page + 1, totalPageCount)))}
              aria-disabled={page === totalPageCount}
              tabIndex={page === totalPageCount ? -1 : undefined}
              className={page === totalPageCount ? "pointer-events-none opacity-50" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize,
}: {
  options: number[]
  setPageSize: (newSize: number) => void
  pageSize: number
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="whitespace-nowrap text-sm">Baris per halaman</span>
      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih jumlah baris" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
