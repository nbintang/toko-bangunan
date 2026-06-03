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

export type Category = {
  id: number
  name: string
  description: string | null
}

type CategoryColumnsOptions = {
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
}

export function getCategoriesColumns({
  onEdit,
  onDelete,
}: CategoryColumnsOptions): ColumnDef<Category>[] {
  return [
    {
      id: 'no',
      header: 'No',
      size: 64,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Nama',
      size: 220,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Deskripsi',
      size: 420,
      cell: ({ row }) => row.original.description || '-',
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const category = row.original

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
                <DropdownMenuItem onSelect={() => onEdit(category)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault()
                    onDelete(category)
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
