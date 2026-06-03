import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type ProductCategory = {
  id: number
  name: string
}

export type Product = {
  id: number
  categoryId: number
  code: string
  name: string
  unit: string
  stock: number
  minimumStock: number
  description: string | null
}

type ProductColumnsOptions = {
  categoryById: Map<number, string>
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function getProductsColumns({
  categoryById,
  onEdit,
  onDelete,
}: ProductColumnsOptions): ColumnDef<Product>[] {
  return [
    {
      id: 'no',
      header: 'No',
      size: 64,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'code',
      header: 'Kode',
      size: 140,
      cell: ({ row }) => <span className="font-medium">{row.original.code}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Nama',
      size: 220,
    },
    {
      id: 'category',
      header: 'Kategori',
      size: 180,
      cell: ({ row }) => categoryById.get(row.original.categoryId) ?? '-',
    },
    {
      accessorKey: 'unit',
      header: 'Satuan',
      size: 120,
    },
    {
      accessorKey: 'stock',
      header: () => <div className="text-right">Stok</div>,
      size: 100,
      cell: ({ row }) => <div className="text-right">{row.original.stock}</div>,
    },
    {
      accessorKey: 'minimumStock',
      header: () => <div className="text-right">Minimum</div>,
      size: 120,
      cell: ({ row }) => <div className="text-right">{row.original.minimumStock}</div>,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const product = row.original

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => onEdit(product)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault()
                    onDelete(product)
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
