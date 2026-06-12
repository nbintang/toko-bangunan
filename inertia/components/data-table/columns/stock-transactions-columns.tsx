import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

export type StockTransactionProduct = {
  id: number
  code: string
  name: string
  unit: string
  category: {
    id: number
    name: string
  } | null
}

export type StockTransactionUser = {
  id: number
  fullName: string | null
  email: string
}

export type StockTransaction = {
  id: number
  productId: number
  userId: number
  type: 'in' | 'out'
  quantity: number
  stockAfter: number
  transactionDate: string
  note: string | null
  product: StockTransactionProduct | null
  user: StockTransactionUser | null
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
  }).format(new Date(value))
}

export const stockTransactionsColumns: ColumnDef<StockTransaction>[] = [
  {
    id: 'no',
    header: 'No',
    size: 64,
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: 'transactionDate',
    header: 'Tanggal',
    size: 140,
    cell: ({ row }) => formatDate(row.original.transactionDate),
  },
  {
    id: 'product',
    header: 'Barang',
    size: 220,
    cell: ({ row }) => {
      const product = row.original.product

      return (
        <div className="min-w-0">
          <div className="font-medium">{product?.name ?? '-'}</div>
          <div className="text-xs text-muted-foreground">{product?.code ?? '-'}</div>
        </div>
      )
    },
  },
  {
    id: 'category',
    header: 'Kategori',
    size: 150,
    cell: ({ row }) => row.original.product?.category?.name ?? '-',
  },
  {
    accessorKey: 'type',
    header: 'Status',
    size: 120,
    cell: ({ row }) => {
      const isIn = row.original.type === 'in'

      return <Badge variant={isIn ? 'secondary' : 'destructive'}>{isIn ? 'Masuk' : 'Keluar'}</Badge>
    },
  },
  {
    accessorKey: 'quantity',
    header: () => <div className="text-right">Jumlah</div>,
    size: 120,
    cell: ({ row }) => <div className="text-right">{row.original.quantity}</div>,
  },
  {
    accessorKey: 'stockAfter',
    header: () => <div className="text-right">Stok Akhir</div>,
    size: 130,
    cell: ({ row }) => <div className="text-right">{row.original.stockAfter}</div>,
  },
  {
    id: 'user',
    header: 'User',
    size: 160,
    cell: ({ row }) => row.original.user?.fullName ?? row.original.user?.email ?? '-',
  },
  {
    accessorKey: 'note',
    header: 'Catatan',
    size: 200,
    cell: ({ row }) => row.original.note || '-',
  },
]
