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

export type UserManagement = {
  id: number
  fullName: string | null
  email: string
}

type UserManagementColumnsOptions = {
  onEdit: (user: UserManagement) => void
  onDelete: (user: UserManagement) => void
}

export function getUserManagementsColumns({
  onEdit,
  onDelete,
}: UserManagementColumnsOptions): ColumnDef<UserManagement>[] {
  return [
    {
      id: 'no',
      header: 'No',
      size: 64,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'fullName',
      header: 'Nama',
      size: 240,
      cell: ({ row }) => <span className="font-medium">{row.original.fullName || '-'}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 280,
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Action</div>,
      size: 80,
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original

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
                <DropdownMenuItem onSelect={() => onEdit(user)}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={(event) => {
                    event.preventDefault()
                    onDelete(user)
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
