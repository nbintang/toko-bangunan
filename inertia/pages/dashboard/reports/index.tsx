import * as React from 'react'
import { router } from '@inertiajs/react'
import {
  stockTransactionsColumns,
  type StockTransaction,
} from '@/components/data-table/columns/stock-transactions-columns'
import { DataTable } from '@/components/data-table/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  transactions: StockTransaction[]
  totalTransactions: number
  totalIn: number
  totalOut: number
  type?: string
  startDate?: string
  endDate?: string
}>

export default function ReportsIndex({
  transactions,
  totalTransactions,
  totalIn,
  totalOut,
  type,
  startDate,
  endDate,
}: PageProps) {
  const [filters, setFilters] = React.useState({
    type: type ?? '',
    startDate: startDate ?? '',
    endDate: endDate ?? '',
  })

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    router.get('/dashboard/reports', filters, {
      preserveScroll: true,
      preserveState: true,
    })
  }

  function resetFilters() {
    setFilters({ type: '', startDate: '', endDate: '' })
    router.get('/dashboard/reports', {}, { preserveScroll: true })
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Laporan Persediaan</h1>
        <p className="text-sm text-muted-foreground">
          Lihat rekap transaksi stok berdasarkan jenis dan rentang tanggal.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Total Transaksi"
          value={totalTransactions}
          description="Jumlah transaksi"
        />
        <SummaryCard title="Barang Masuk" value={totalIn} description="Total kuantitas masuk" />
        <SummaryCard title="Barang Keluar" value={totalOut} description="Total kuantitas keluar" />
      </div>

      <form
        className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto]"
        onSubmit={applyFilters}
      >
        <div className="grid gap-2">
          <Label htmlFor="report-type">Jenis</Label>
          <NativeSelect
            id="report-type"
            className="w-full"
            value={filters.type}
            onChange={(event) =>
              setFilters((current) => ({ ...current, type: event.target.value }))
            }
          >
            <NativeSelectOption value="">Semua</NativeSelectOption>
            <NativeSelectOption value="in">Masuk</NativeSelectOption>
            <NativeSelectOption value="out">Keluar</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="report-start-date">Tanggal Mulai</Label>
          <Input
            id="report-start-date"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, startDate: event.target.value }))
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="report-end-date">Tanggal Akhir</Label>
          <Input
            id="report-end-date"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              setFilters((current) => ({ ...current, endDate: event.target.value }))
            }
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Filter
          </Button>
        </div>
        <div className="flex items-end">
          <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </form>

      <DataTable columns={stockTransactionsColumns} data={transactions} />
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string
  value: number
  description: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}
