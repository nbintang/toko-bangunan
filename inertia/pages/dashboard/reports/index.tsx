import * as React from 'react'
import { router } from '@inertiajs/react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import {
  stockTransactionsColumns,
  type StockTransaction,
} from '@/components/data-table/columns/stock-transactions-columns'
import { DataTable } from '@/components/data-table/table'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { InertiaProps } from '~/types'
import type { PaginatedData } from '~/types/pagination'
import { SubmitButton } from '@/components/submit_button'

type PageProps = InertiaProps<{
  transactions: PaginatedData<StockTransaction>
  totalTransactions: number
  totalIn: number
  totalOut: number
  type?: string
  startDate?: string
  endDate?: string
  search?: string
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
  const [filtering, setFiltering] = React.useState(false)
  const exportRows = React.useMemo(() => transactions.data.map(toReportRow), [transactions.data])

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (filtering) return

    setFiltering(true)

    router.get('/dashboard/reports', filters, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => setFiltering(false),
    })
  }

  function resetFilters() {
    setFilters({ type: '', startDate: '', endDate: '' })
    router.get('/dashboard/reports', {}, { preserveScroll: true })
  }

  function ensureExportable() {
    if (exportRows.length > 0) {
      return true
    }

    toast.error('Tidak ada data laporan untuk diunduh.')
    return false
  }

  function exportPdf() {
    if (!ensureExportable()) return

    const doc = new jsPDF({ orientation: 'landscape' })
    doc.text('Laporan Persediaan', 14, 14)
    doc.setFontSize(10)
    doc.text(`Total transaksi: ${totalTransactions}`, 14, 21)
    doc.text(`Barang masuk: ${totalIn}`, 14, 27)
    doc.text(`Barang keluar: ${totalOut}`, 14, 33)
    autoTable(doc, {
      startY: 40,
      head: [reportHeaders],
      body: exportRows.map((row) => reportHeaders.map((header) => row[header])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [24, 24, 27] },
    })
    doc.save('laporan-persediaan.pdf')
    toast.success('Laporan PDF berhasil diunduh.')
  }

  function exportExcel() {
    if (!ensureExportable()) return

    const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: reportHeaders })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan')
    XLSX.writeFile(workbook, 'laporan-persediaan.xlsx')
    toast.success('Laporan Excel berhasil diunduh.')
  }

  function exportCsv() {
    if (!ensureExportable()) return

    const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: reportHeaders })
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'laporan-persediaan.csv'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Laporan CSV berhasil diunduh.')
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
        className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1fr_1fr_auto_auto_auto]"
        onSubmit={applyFilters}
      >
        <div className="grid gap-2">
          <Label htmlFor="report-type">Jenis</Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(value) =>
              setFilters((current) => ({ ...current, type: value === 'all' ? '' : value }))
            }
          >
            <SelectTrigger id="report-type" className="w-full">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="in">Masuk</SelectItem>
                <SelectItem value="out">Keluar</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="report-start-date">Tanggal Mulai</Label>
          <DatePicker
            id="report-start-date"
            value={filters.startDate}
            onChange={(value) => setFilters((current) => ({ ...current, startDate: value }))}
            placeholder="Tanggal mulai"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="report-end-date">Tanggal Akhir</Label>
          <DatePicker
            id="report-end-date"
            value={filters.endDate}
            onChange={(value) => setFilters((current) => ({ ...current, endDate: value }))}
            placeholder="Tanggal akhir"
          />
        </div>
        <div className="flex items-end">
          <SubmitButton className="w-full" loading={filtering} loadingText="Memfilter...">
            Filter
          </SubmitButton>
        </div>
        <div className="flex items-end">
          <Button type="button" variant="outline" className="w-full" onClick={resetFilters}>
            Reset
          </Button>
        </div>
        <div className="flex items-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" className="w-full">
                <DownloadIcon data-icon="inline-start" />
                Unduh
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={exportPdf}>
                <FileTextIcon data-icon="inline-start" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={exportExcel}>
                <FileSpreadsheetIcon data-icon="inline-start" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={exportCsv}>
                <DownloadIcon data-icon="inline-start" />
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>

      <DataTable
        columns={stockTransactionsColumns}
        data={transactions.data}
        pagination={transactions.meta}
      />
    </div>
  )
}

const reportHeaders: string[] = [
  'Tanggal',
  'Barang',
  'Kode Barang',
  'Kategori',
  'Jenis',
  'Jumlah',
  'Stok Akhir',
  'User',
  'Catatan',
]

function toReportRow(transaction: StockTransaction): Record<string, string | number> {
  return {
    'Tanggal': formatDate(transaction.transactionDate),
    'Barang': transaction.product?.name ?? '-',
    'Kode Barang': transaction.product?.code ?? '-',
    'Kategori': transaction.product?.category?.name ?? '-',
    'Jenis': transaction.type === 'in' ? 'Masuk' : 'Keluar',
    'Jumlah': transaction.quantity,
    'Stok Akhir': transaction.stockAfter,
    'User': transaction.user?.fullName ?? transaction.user?.email ?? '-',
    'Catatan': transaction.note ?? '-',
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(new Date(value))
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
