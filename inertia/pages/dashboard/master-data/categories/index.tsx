import * as React from 'react'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import {
  type Category,
  getCategoriesColumns,
} from '@/components/data-table/columns/categories-columns'
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
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit_button'
import type { InertiaProps } from '~/types'
import type { PaginatedData } from '~/types/pagination'

type CategoryForm = {
  name: string
  description: string
}

type PageProps = InertiaProps<{
  categories: PaginatedData<Category>
  search?: string
}>

const emptyForm: CategoryForm = {
  name: '',
  description: '',
}

export default function CategoriesIndex({ categories }: PageProps) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editCategory, setEditCategory] = React.useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = React.useState<Category | null>(null)
  const [form, setForm] = React.useState<CategoryForm>(emptyForm)
  const [submitting, setSubmitting] = React.useState(false)

  function openCreateDialog() {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  function openEditDialog(category: Category) {
    setForm({
      name: category.name,
      description: category.description ?? '',
    })
    setEditCategory(category)
  }

  function storeCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)

    router.post('/dashboard/master-data/category', form, {
      preserveScroll: true,
      onSuccess: () => setCreateOpen(false),
      onFinish: () => setSubmitting(false),
    })
  }

  function updateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editCategory || submitting) return

    setSubmitting(true)

    router.patch(`/dashboard/master-data/category/${editCategory.id}`, form, {
      preserveScroll: true,
      onSuccess: () => setEditCategory(null),
      onFinish: () => setSubmitting(false),
    })
  }

  function destroyCategory() {
    if (!deleteCategory) return

    router.delete(`/dashboard/master-data/category/${deleteCategory.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteCategory(null),
    })
  }

  const columns = getCategoriesColumns({
    onEdit: openEditDialog,
    onDelete: setDeleteCategory,
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Kategori Barang</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kategori untuk mengelompokkan data barang.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusIcon data-icon="inline-start" />
          Buat
        </Button>
      </div>

      <DataTable columns={columns} data={categories.data} pagination={categories.meta} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kategori</DialogTitle>
            <DialogDescription>Tambahkan kategori barang baru.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeCategory}>
            <CategoryFields form={form} setForm={setForm} />
            <DialogFooter>
              <SubmitButton loading={submitting} loadingText="Menyimpan...">
                Save
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editCategory)} onOpenChange={(open) => !open && setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
            <DialogDescription>Perbarui data kategori barang.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={updateCategory}>
            <CategoryFields form={form} setForm={setForm} />
            <DialogFooter>
              <SubmitButton loading={submitting} loadingText="Menyimpan...">
                Save changes
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteCategory)}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Data kategori {deleteCategory?.name} akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={destroyCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function CategoryFields({
  form,
  setForm,
}: {
  form: CategoryForm
  setForm: React.Dispatch<React.SetStateAction<CategoryForm>>
}) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="category-name">Nama</Label>
        <Input
          id="category-name"
          placeholder="Contoh: Semen"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category-description">Deskripsi</Label>
        <Textarea
          id="category-description"
          placeholder="Jelaskan kategori barang (opsional)"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
      </div>
    </div>
  )
}
