import * as React from 'react'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import {
  getUserManagementsColumns,
  type UserManagement,
} from '@/components/data-table/columns/user-managements-columns'
import { DataTable } from '@/components/data-table/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
import type { InertiaProps } from '~/types'

type UserForm = {
  fullName: string
  email: string
  password: string
  passwordConfirmation: string
}

type PageProps = InertiaProps<{
  users: UserManagement[]
}>

const emptyForm: UserForm = {
  fullName: '',
  email: '',
  password: '',
  passwordConfirmation: '',
}

export default function UsersIndex({ users }: PageProps) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editUser, setEditUser] = React.useState<UserManagement | null>(null)
  const [deleteUser, setDeleteUser] = React.useState<UserManagement | null>(null)
  const [form, setForm] = React.useState<UserForm>(emptyForm)

  function openCreateDialog() {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEditDialog(user: UserManagement) {
    setForm({
      fullName: user.fullName ?? '',
      email: user.email,
      password: '',
      passwordConfirmation: '',
    })
    setEditUser(user)
  }

  function storeUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    router.post('/dashboard/master-data/users', form, {
      preserveScroll: true,
      onSuccess: () => setCreateOpen(false),
    })
  }

  function updateUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editUser) return

    const payload: Partial<UserForm> = {
      fullName: form.fullName,
      email: form.email,
    }

    if (form.password) {
      payload.password = form.password
      payload.passwordConfirmation = form.passwordConfirmation
    }

    router.patch(`/dashboard/master-data/users/${editUser.id}`, payload, {
      preserveScroll: true,
      onSuccess: () => setEditUser(null),
    })
  }

  function destroyUser() {
    if (!deleteUser) return

    router.delete(`/dashboard/master-data/users/${deleteUser.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteUser(null),
    })
  }

  const columns = getUserManagementsColumns({
    onEdit: openEditDialog,
    onDelete: setDeleteUser,
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Manajemen Pengguna</h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun pengguna yang dapat mengakses aplikasi.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon data-icon="inline-start" />
          Create
        </Button>
      </div>

      <DataTable columns={columns} data={users} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Pengguna</DialogTitle>
            <DialogDescription>Tambahkan akun pengguna baru.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeUser}>
            <UserFields form={form} setForm={setForm} requirePassword />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editUser)} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
            <DialogDescription>Perbarui data akun pengguna.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={updateUser}>
            <UserFields form={form} setForm={setForm} />
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteUser)} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Akun "{deleteUser?.fullName ?? deleteUser?.email}" akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={destroyUser}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function UserFields({
  form,
  setForm,
  requirePassword = false,
}: {
  form: UserForm
  setForm: React.Dispatch<React.SetStateAction<UserForm>>
  requirePassword?: boolean
}) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="user-full-name">Nama</Label>
        <Input
          id="user-full-name"
          value={form.fullName}
          onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-email">Email</Label>
        <Input
          id="user-email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-password">Password</Label>
        <Input
          id="user-password"
          type="password"
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          required={requirePassword}
          placeholder={requirePassword ? undefined : 'Kosongkan jika tidak diubah'}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="user-password-confirmation">Konfirmasi Password</Label>
        <Input
          id="user-password-confirmation"
          type="password"
          value={form.passwordConfirmation}
          onChange={(event) =>
            setForm((current) => ({ ...current, passwordConfirmation: event.target.value }))
          }
          required={requirePassword || Boolean(form.password)}
        />
      </div>
    </div>
  )
}
