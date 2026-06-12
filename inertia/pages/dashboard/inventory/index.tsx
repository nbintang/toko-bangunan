import * as React from 'react'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import {
  stockTransactionsColumns,
  type StockTransaction,
} from '@/components/data-table/columns/stock-transactions-columns'
import { DataTable } from '@/components/data-table/table'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit_button'
import type { InertiaProps } from '~/types'
import type { PaginatedData } from '~/types/pagination'

type InventoryProduct = {
  id: number
  code: string
  name: string
  unit: string
  stock: number
  minimumStock: number
  category: {
    id: number
    name: string
  } | null
}

type TransactionForm = {
  productId: string
  type: 'in' | 'out'
  quantity: string
  transactionDate: string
  note: string
}

type PageProps = InertiaProps<{
  products: InventoryProduct[]
  transactions: PaginatedData<StockTransaction>
  totalProducts: number
  totalStock: number
  lowStockCount: number
  emptyStockCount: number
  search?: string
}>

function today() {
  return new Date().toISOString().slice(0, 10)
}

export default function InventoryIndex({
  products,
  transactions,
  totalProducts,
  totalStock,
  lowStockCount,
  emptyStockCount,
}: PageProps) {
  const [open, setOpen] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState<TransactionForm>({
    productId: '',
    type: 'in',
    quantity: '1',
    transactionDate: today(),
    note: '',
  })

  function openCreateDialog() {
    setForm({
      productId: products[0]?.id ? String(products[0].id) : '',
      type: 'in',
      quantity: '1',
      transactionDate: today(),
      note: '',
    })
    setOpen(true)
  }

  function storeTransaction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)

    router.post(
      '/dashboard/inventory/transactions',
      {
        productId: Number(form.productId),
        type: form.type,
        quantity: Number(form.quantity),
        transactionDate: form.transactionDate,
        note: form.note,
      },
      {
        preserveScroll: true,
        onSuccess: () => setOpen(false),
        onFinish: () => setSubmitting(false),
      }
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Persediaan Barang</h1>
          <p className="text-sm text-muted-foreground">
            Pantau stok dan catat transaksi barang masuk atau keluar.
          </p>
        </div>
        <Button onClick={openCreateDialog} disabled={products.length === 0}>
          <PlusIcon data-icon="inline-start" />
          Buat
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Barang" value={totalProducts} description="Jenis barang aktif" />
        <SummaryCard title="Total Stok" value={totalStock} description="Akumulasi stok saat ini" />
        <SummaryCard
          title="Stok Menipis"
          value={lowStockCount}
          description="Stok di bawah minimum"
        />
        <SummaryCard title="Stok Kosong" value={emptyStockCount} description="Barang tanpa stok" />
      </div>

      <DataTable
        columns={stockTransactionsColumns}
        data={transactions.data}
        pagination={transactions.meta}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Buat Transaksi Persediaan</DialogTitle>
            <DialogDescription>Catat barang masuk atau keluar.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeTransaction}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-product">Barang</Label>
                <Select
                  value={form.productId}
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, productId: value }))
                  }
                  disabled={products.length === 0}
                >
                  <SelectTrigger id="transaction-product" className="w-full">
                    <SelectValue placeholder="Pilih barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={String(product.id)}>
                          {product.name} - stok {product.stock}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-type">Jenis</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((current) => ({
                      ...current,
                      type: value as TransactionForm['type'],
                    }))
                  }
                >
                  <SelectTrigger id="transaction-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="in">Masuk</SelectItem>
                      <SelectItem value="out">Keluar</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-quantity">Jumlah</Label>
                <Input
                  id="transaction-quantity"
                  type="number"
                  min="1"
                  placeholder="Masukkan jumlah barang"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, quantity: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-date">Tanggal</Label>
                <DatePicker
                  id="transaction-date"
                  value={form.transactionDate}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, transactionDate: value }))
                  }
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-note">Catatan</Label>
                <Textarea
                  id="transaction-note"
                  placeholder="Tambahkan catatan transaksi (opsional)"
                  value={form.note}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <SubmitButton loading={submitting} loadingText="Menyimpan...">
                Save
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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
