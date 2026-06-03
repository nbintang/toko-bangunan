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
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import type { InertiaProps } from '~/types'

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
  products: Product[]
  categories: ProductCategory[]
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

    router.post('/dashboard/master-data/items', payload(), {
      preserveScroll: true,
      onSuccess: () => setCreateOpen(false),
    })
  }

  function updateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editProduct) return

    router.patch(`/dashboard/master-data/items/${editProduct.id}`, payload(), {
      preserveScroll: true,
      onSuccess: () => setEditProduct(null),
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
          Create
        </Button>
      </div>

      <DataTable columns={columns} data={products} />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Barang</DialogTitle>
            <DialogDescription>Tambahkan barang baru ke master data.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={storeProduct}>
            <ProductFields categories={categories} form={form} setForm={setForm} />
            <DialogFooter>
              <Button type="submit">Save</Button>
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
              <Button type="submit">Save changes</Button>
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
              Data barang "{deleteProduct?.name}" akan dihapus permanen.
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
        <NativeSelect
          id="product-category"
          className="w-full"
          value={form.categoryId}
          onChange={(event) =>
            setForm((current) => ({ ...current, categoryId: event.target.value }))
          }
          required
        >
          <NativeSelectOption value="" disabled>
            Pilih kategori
          </NativeSelectOption>
          {categories.map((category) => (
            <NativeSelectOption key={category.id} value={category.id}>
              {category.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-code">Kode</Label>
        <Input
          id="product-code"
          value={form.code}
          onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-name">Nama</Label>
        <Input
          id="product-name"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="product-unit">Satuan</Label>
        <Input
          id="product-unit"
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
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
        />
      </div>
    </div>
  )
}
