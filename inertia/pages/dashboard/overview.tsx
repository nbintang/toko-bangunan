import {
  AlertTriangleIcon,
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  BoxesIcon,
  PackageIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ChartConfig } from '@/components/ui/chart'
import type { InertiaProps } from '~/types'

type DashboardProduct = {
  id: number
  categoryId: number
  code: string
  name: string
  unit: string
  stock: number
  minimumStock: number
  description: string | null
  category: {
    id: number
    name: string
  } | null
}

type LatestTransaction = {
  id: number
  productId: number
  userId: number
  type: 'in' | 'out'
  quantity: number
  stockAfter: number
  transactionDate: string
  note: string | null
  product: DashboardProduct | null
  user: {
    id: number
    fullName: string | null
    email: string
  } | null
}

type ChartData = {
  date: string
  label: string
  stockIn: number
  stockOut: number
}

type PageProps = InertiaProps<{
  totalProducts: number
  totalStock: number
  totalStockIn: number
  totalStockOut: number
  lowStockCount: number
  lowStockProducts: DashboardProduct[]
  topMinProducts: DashboardProduct[]
  topMaxProducts: DashboardProduct[]
  latestTransactions: LatestTransaction[]
  chartData: ChartData[]
}>

const chartConfig = {
  stockIn: {
    label: 'Masuk',
    color: 'hsl(142 72% 35%)',
  },
  stockOut: {
    label: 'Keluar',
    color: 'hsl(0 72% 45%)',
  },
} satisfies ChartConfig

const numberFormatter = new Intl.NumberFormat('id-ID')
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export default function Overview({
  user,
  totalProducts,
  totalStock,
  totalStockIn,
  totalStockOut,
  lowStockCount,
  lowStockProducts,
  topMinProducts,
  topMaxProducts,
  latestTransactions,
  chartData,
}: PageProps) {
  const displayName = user?.fullName ?? user?.email ?? 'User'

  return (
    <div className="flex max-w-full flex-col gap-4 overflow-hidden p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-normal">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang, {displayName}. Pantau stok barang dan aktivitas transaksi terbaru.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Barang"
          value={totalProducts}
          description="Jenis barang aktif"
          icon={<PackageIcon />}
        />
        <SummaryCard
          title="Total Stok"
          value={totalStock}
          description="Akumulasi stok"
          icon={<BoxesIcon />}
        />
        <SummaryCard
          title="Stok Masuk"
          value={totalStockIn}
          description="Total transaksi masuk"
          icon={<ArrowDownToLineIcon />}
        />
        <SummaryCard
          title="Stok Keluar"
          value={totalStockOut}
          description="Total transaksi keluar"
          icon={<ArrowUpFromLineIcon />}
        />
        <SummaryCard
          title="Stok Rendah"
          value={lowStockCount}
          description="Stok di bawah 10"
          icon={<AlertTriangleIcon />}
          warning
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Transaksi Bulan Ini</CardTitle>
            <CardDescription>
              Perbandingan jumlah barang masuk dan keluar per tanggal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-72 w-full">
                <BarChart data={chartData} margin={{ left: -12, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval="preserveStartEnd"
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
                  <Bar dataKey="stockIn" fill="var(--color-stockIn)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="stockOut" fill="var(--color-stockOut)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                Belum ada transaksi bulan ini.
              </div>
            )}
          </CardContent>
        </Card>

        <ProductListCard
          title="Stok Perlu Dicek"
          description="Prioritas barang dengan stok paling rendah."
          products={lowStockProducts}
          emptyText="Tidak ada stok rendah."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ProductListCard
          title="Stok Terendah"
          description="Lima barang dengan stok di bawah 10."
          products={topMinProducts}
          emptyText="Tidak ada data stok rendah."
        />
        <ProductListCard
          title="Stok Tertinggi"
          description="Lima barang dengan stok paling banyak."
          products={topMaxProducts}
          emptyText="Tidak ada data stok tinggi."
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaksi Terbaru</CardTitle>
          <CardDescription>Lima aktivitas persediaan terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Barang</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Stok Akhir</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {latestTransactions.length > 0 ? (
                latestTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.transactionDate)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{transaction.product?.name ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.product?.category?.name ?? 'Tanpa kategori'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'in' ? 'secondary' : 'destructive'}>
                        {transaction.type === 'in' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {numberFormatter.format(transaction.quantity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {numberFormatter.format(transaction.stockAfter)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Belum ada transaksi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  warning = false,
}: {
  title: string
  value: number
  description: string
  icon: ReactNode
  warning?: boolean
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl">{numberFormatter.format(value)}</CardTitle>
        <CardAction
          className={
            warning ? 'text-destructive [&>svg]:size-5' : 'text-muted-foreground [&>svg]:size-5'
          }
        >
          {icon}
        </CardAction>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

function ProductListCard({
  title,
  description,
  products,
  emptyText,
}: {
  title: string
  description: string
  products: DashboardProduct[]
  emptyText: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="grid gap-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border p-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{product.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {product.code} · {product.category?.name ?? 'Tanpa kategori'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-semibold">
                    {numberFormatter.format(product.stock)}
                  </div>
                  <div className="text-xs text-muted-foreground">{product.unit}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  return dateFormatter.format(new Date(value))
}
