import * as React from 'react'
import { router } from '@inertiajs/react'
import { PlusIcon } from 'lucide-react'
import {
  getProductsColumns,
  type Product,
  type ProductCategory,
} from '@/components/data-table/columns/products-columns'
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

type ProductForm = {
  categoryId: string
  code: string
  name: string
  unit: string
  stock: string
  minimumStock: string
  description: string
}

type PageProps = InertiaProps<{
  products: PaginatedData<Product>
  categories: ProductCategory[]
  search?: string
}>

const emptyForm: ProductForm = {
  categoryId: '',
  code: '',
  name: '',
  unit: '',
  stock: '0',
  minimumStock: '0',
  description: '',
}

export default function ProductsIndex({ products, categories }: PageProps) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editProduct, setEditProduct] = React.useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(null)
  const [form, setForm] = React.useState<ProductForm>(emptyForm)
  const [submitting, setSubmitting] = React.useState(false)

  const categoryById = React.useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories]
  )

  function openCreateDialog() {
    setForm({ ...emptyForm, categoryId: categories[0]?.id ? String(categories[0].id) : '' })
    setCreateOpen(true)
  }

  function openEditDialog(product: Product) {
    setForm({
      categoryId: String(product.categoryId),
      code: product.code,
      name: product.name,
      unit: product.unit,
      stock: String(product.stock),
      minimumStock: String(product.minimumStock),
      description: product.description ?? '',
    })
    setEditProduct(product)
  }

  function payload() {
    return {
      categoryId: Number(form.categoryId),
      code: form.code,
      name: form.name,
      unit: form.unit,
      stock: Number(form.stock),
      minimumStock: Number(form.minimumStock),
      description: form.description,
    }
  }

  function storeProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)

    router.post('/dashboard/master-data/items', payload(), {
      preserveScroll: true,
      onSuccess: () => setCreateOpen(false),
      onFinish: () => setSubmitting(false),
    })
  }

  function updateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editProduct || submitting) return

    setSubmitting(true)

    router.patch(`/dashboard/master-data/items/${editProduct.id}`, payload(), {
      preserveScroll: true,
      onSuccess: () => setEditProduct(null),
      onFinish: () => setSubmitting(false),
    })
  }

  function destroyProduct() {
    if (!deleteProduct) return

    router.delete(`/dashboard/master-data/items/${deleteProduct.id}`, {
      preserveScroll: true,
      onSuccess: () => setDeleteProduct(null),
    })
  }

  const columns = getProductsColumns({
    categoryById,
    onEdit: openEditDialog,
    onDelete: setDeleteProduct,
  })

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Daftar Barang</h1>
          <p className="text-sm text-muted-foreground">
            Kelola data barang, stok awal, dan batas minimum persediaan.
          </p>
        </div>
        <Button onClick={openCreateDialog} disabled={categories.length === 0}>
          <PlusIcon data-icon="inline-start" />
          Buat
        </Button>
      </div>

      <DataTable columns={columns} data={products.data} pagination={products.meta} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Buat Barang</DialogTitle>
            <DialogDescription>Tambahkan barang baru ke master data.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeProduct}>
            <ProductFields categories={categories} form={form} setForm={setForm} />
            <DialogFooter>
              <SubmitButton loading={submitting} loadingText="Menyimpan...">
                Save
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editProduct)} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Barang</DialogTitle>
            <DialogDescription>Perbarui data barang.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={updateProduct}>
            <ProductFields categories={categories} form={form} setForm={setForm} />
            <DialogFooter>
              <SubmitButton loading={submitting} loadingText="Menyimpan...">
                Save changes
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteProduct)}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus barang?</AlertDialogTitle>
            <AlertDialogDescription>
              Data barang {deleteProduct?.name} akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={destroyProduct}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function ProductFields({
  categories,
  form,
  setForm,
}: {
  categories: ProductCategory[]
  form: ProductForm
  setForm: React.Dispatch<React.SetStateAction<ProductForm>>
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="grid gap-2">
        <Label htmlFor="product-category">Kategori</Label>
        <Select
          value={form.categoryId}
          onValueChange={(value) => setForm((current) => ({ ...current, categoryId: value }))}
          disabled={categories.length === 0}
        >
          <SelectTrigger id="product-category" className="w-full">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-code">Kode</Label>
        <Input
          id="product-code"
          placeholder="Contoh: BRG-001"
          value={form.code}
          onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-name">Nama</Label>
        <Input
          id="product-name"
          placeholder="Masukkan nama barang"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-unit">Satuan</Label>
        <Input
          id="product-unit"
          placeholder="Contoh: pcs, sak, atau batang"
          value={form.unit}
          onChange={(event) => setForm((current) => ({ ...current, unit: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-stock">Stok</Label>
        <Input
          id="product-stock"
          type="number"
          min="0"
          placeholder="Masukkan stok awal"
          value={form.stock}
          onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-minimum-stock">Stok Minimum</Label>
        <Input
          id="product-minimum-stock"
          type="number"
          min="0"
          placeholder="Masukkan batas stok minimum"
          value={form.minimumStock}
          onChange={(event) =>
            setForm((current) => ({ ...current, minimumStock: event.target.value }))
          }
          required
        />
      </div>
      <div className="grid gap-2 sm:col-span-2">
        <Label htmlFor="product-description">Deskripsi</Label>
        <Textarea
          id="product-description"
          placeholder="Jelaskan detail barang (opsional)"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
      </div>
    </div>
  )
}
