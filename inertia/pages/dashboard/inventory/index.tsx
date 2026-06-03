import * as React from 'react'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import {
  stockTransactionsColumns,
  type StockTransaction,
} from '@/components/data-table/columns/stock-transactions-columns'
import { DataTable } from '@/components/data-table/table'
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
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import type { InertiaProps } from '~/types'

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
  transactions: StockTransaction[]
  totalProducts: number
  totalStock: number
  lowStockCount: number
  emptyStockCount: number
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
          Create
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

      <DataTable columns={stockTransactionsColumns} data={transactions} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Transaksi Persediaan</DialogTitle>
            <DialogDescription>Catat barang masuk atau keluar.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeTransaction}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-product">Barang</Label>
                <NativeSelect
                  id="transaction-product"
                  className="w-full"
                  value={form.productId}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, productId: event.target.value }))
                  }
                  required
                >
                  <NativeSelectOption value="" disabled>
                    Pilih barang
                  </NativeSelectOption>
                  {products.map((product) => (
                    <NativeSelectOption key={product.id} value={product.id}>
                      {product.name} - stok {product.stock}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-type">Jenis</Label>
                <NativeSelect
                  id="transaction-type"
                  className="w-full"
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as TransactionForm['type'],
                    }))
                  }
                  required
                >
                  <NativeSelectOption value="in">Masuk</NativeSelectOption>
                  <NativeSelectOption value="out">Keluar</NativeSelectOption>
                </NativeSelect>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="transaction-quantity">Jumlah</Label>
                <Input
                  id="transaction-quantity"
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, quantity: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-date">Tanggal</Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={form.transactionDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, transactionDate: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="transaction-note">Catatan</Label>
                <Textarea
                  id="transaction-note"
                  value={form.note}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
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
